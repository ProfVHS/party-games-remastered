import { Server, Socket } from 'socket.io';
import { Player } from '@engine-core/Player';
import { RoomManager } from '@engine-managers/RoomManager';
import { GameStateType } from '@shared/types';
import { Room } from '@engine/core/room/Room';
import { TurnBasedMinigame } from '@minigame-base/TurnBasedMinigame';
import { RoundBaseTimeoutState, TurnBaseTimeoutState } from '@backend-types';
import { RoundBasedMinigame } from '@minigame-base/RoundBasedMinigame';
import { getMinigame } from '@engine/managers/MinigameManager';
import { GAME_STATE_DURATION } from '@engine/core';
import { COUNTDOWN_INTRO_MS } from '@shared/constants/gameRules';

const setMinigame = (io: Server, room: Room) => {
  const currentMinigame = room.settings.getNextMinigame();
  const roomCode = room.getData().roomCode;

  console.log('currentMinigame', currentMinigame);

  if (!currentMinigame) {
    console.log('Undefined minigame');
    return;
  }

  const currentMinigameClass = getMinigame(currentMinigame.name);
  room.currentMinigame = new currentMinigameClass(room.players, (response: TurnBaseTimeoutState | RoundBaseTimeoutState) => {
    const game = room.currentMinigame;

    if (!game || !response.success) {
      return;
    }

    if (game instanceof TurnBasedMinigame) {
      switch (response.state) {
        case 'NEXT_TURN':
          console.log('NEXT_TURN');
          room.setGameState(GameStateType.Animation);
          room.startTimer(COUNTDOWN_INTRO_MS);

          io.to(roomCode).emit('player_exploded', room.getPlayers());
          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt: room.getTimer()?.getEndAt() });
          break;
        case 'END_GAME':
          console.log('END_GAME');
          io.to(roomCode).emit('player_exploded', room.getPlayers());
          room.startTimer(GAME_STATE_DURATION.MINIGAME);
          break;
      }
    } else if (game instanceof RoundBasedMinigame) {
      switch (response.state) {
        case 'SHOW_RESULT':
          console.log('SHOW_RESULT');
          io.to(roomCode).emit('round_end', game.getSummaryTimer().getEndAt(), room.getPlayers(), game.getGameData());
          break;
        case 'NEXT_ROUND':
          console.log('NEXT_ROUND');
          room.setGameState(GameStateType.Animation);
          room.startTimer(COUNTDOWN_INTRO_MS);

          io.to(roomCode).emit(
            'update_game_state',
            { ...room.getData(), endAt: room.getTimer()?.getEndAt() },
            { type: 'ANIMATION_UPDATE', payload: { type: 'ROUND', value: game.getRound() } },
          );
          break;
        case 'END_GAME':
          console.log('END_GAME');

          room.startTimer(GAME_STATE_DURATION.MINIGAME);
          break;
      }
    }
  });

  return currentMinigame;
};

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on('create_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (room) return { success: false, message: `Room ${roomCode} already exists!` };

    //TODO: merge Lobby and Leaderboard
    //TODO: W lobby, animation i leaderboard są dziwne if'y, ponieważ currentTurn można pobrać tylko po zaczęciu gry zeby był on aktualny
    // można np. zmienić logike w kalsachl, np curretnTurn jest tworziony w konstruktorze a nastepnie zmieniany po rundzie?
    // Teraz gracze otrzymuja turn jak zaczyna sie grać dlatego nie można w animacji pokazać kogo jest tura
    room = RoomManager.createRoom(roomCode, (room: Room, state: GameStateType) => {
      let endAt = 0;
      let type = null;
      let value = null;

      switch (state) {
        case GameStateType.Lobby:
          console.log('Lobby END');

          room.setAllReady(false);

          const minigame = setMinigame(io, room);

          if (room.settings.getData().isTutorialsEnabled) {
            room.setGameState(GameStateType.Tutorial);
            room.startTimer(GAME_STATE_DURATION.TUTORIAL);

            endAt = room.getTimer()?.getEndAt() ?? 0;

            io.to(roomCode).emit('got_players', room.getPlayers());
            io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt }, { type: 'MINIGAME_UPDATE', payload: { type, minigame, value } });
            return;
          }

          room.setGameState(GameStateType.Animation);
          room.startTimer(GAME_STATE_DURATION.ANIMATION);

          endAt = room.getTimer()?.getEndAt() ?? 0;

          if (room.currentMinigame instanceof RoundBasedMinigame) {
            value = room.currentMinigame.getRound();
            type = 'ROUND';
          } else if (room.currentMinigame instanceof TurnBasedMinigame) {
            value = null;
            type = 'TURN';
          }

          io.to(roomCode).emit('got_players', room.getPlayers());
          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt }, { type: 'MINIGAME_UPDATE', payload: { type, minigame, value } });
          break;

        case GameStateType.Tutorial:
          console.log('Tutorial END');
          room.setGameState(GameStateType.Animation);
          room.startTimer(GAME_STATE_DURATION.ANIMATION);

          endAt = room.getTimer()?.getEndAt() ?? 0;

          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt });
          break;

        case GameStateType.Animation:
          console.log('Animation END');

          room.setGameState(GameStateType.Minigame);
          room.currentMinigame?.start();

          const gameEndAt = room.currentMinigame?.getTimer().getEndAt();

          if (room.currentMinigame instanceof RoundBasedMinigame) {
            value = null;
            type = 'ROUND';
          } else if (room.currentMinigame instanceof TurnBasedMinigame) {
            const { id, nickname } = room.currentMinigame.getCurrentTurnPlayer();
            value = { id, nickname };
            type = 'TURN';
          }

          io.to(roomCode).emit(
            'update_game_state',
            { roomCode: room.getData().roomCode, gameState: room.getData().gameState, endAt: gameEndAt },
            { type: 'ANIMATION_UPDATE', payload: { type, value } },
          );
          break;

        case GameStateType.Minigame:
          console.log('Minigame END');

          room.setGameState(GameStateType.Leaderboard);
          room.startTimer(GAME_STATE_DURATION.LEADERBOARD);

          endAt = room.getTimer()?.getEndAt() ?? 0;

          io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt }, { type: 'PLAYERS_UPDATE', payload: room.getPlayers() });
          break;

        case GameStateType.Leaderboard:
          if (room.settings.isLastMinigame()) {
            room.setGameState(GameStateType.Finished);
            room.startTimer(GAME_STATE_DURATION.FINISHED);

            endAt = room.getTimer()?.getEndAt() ?? 0;

            io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt }, { type: 'PLAYERS_UPDATE', payload: room.getPlayers() });
          } else {
            console.log('Leaderboard END');

            const minigame = setMinigame(io, room);

            room.setGameState(GameStateType.Animation);
            room.startTimer(GAME_STATE_DURATION.ANIMATION);

            endAt = room.getTimer()?.getEndAt() ?? 0;

            if (room.currentMinigame instanceof RoundBasedMinigame) {
              value = room.currentMinigame.getRound();
              type = 'ROUND';
            } else if (room.currentMinigame instanceof TurnBasedMinigame) {
              value = null;
              type = 'TURN';
            }

            io.to(roomCode).emit('update_game_state', { ...room.getData(), endAt }, { type: 'MINIGAME_UPDATE', payload: { type, minigame, value } });
          }

          break;

        case GameStateType.Finished:
          console.log('Finished END');
          console.log('Delete room');
          break;
      }
    });
    const player = new Player(socket.id, nickname, true);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      io.to(socket.id).emit('created_room', { roomCode, id: socket.id });
    }
  });

  socket.on('join_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (!room) return { success: false, message: 'Room not found!' };

    const player = new Player(socket.id, nickname);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.to(roomCode).emit('player_join_toast', nickname);
      io.to(socket.id).emit('joined_room', { roomCode, id: socket.id });
    }
  });

  socket.on('disconnect', () => {
    let room = RoomManager.getRoom(socket.data.roomCode);

    console.log('Socket disconnected: ', room?.getGameState(), socket.id);

    room?.removePlayer(socket.id);

    if (room?.getPlayers().length === 0) {
      RoomManager.deleteRoom(room.roomCode);
    }

    io.to(socket.data.roomCode).emit('got_players', room?.getPlayers());

    socket.leave(socket.data.roomCode);
  });
};
