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

const setMinigame = (io: Server, room: Room) => {
  const currentMinigame = room.settings.getNextMinigame();
  const roomCode = room.getData().roomCode;

  console.log('currentMinigame', currentMinigame);

  if (!currentMinigame) {
    console.log('Undefined minigame');
    return;
  }

  const currentMinigameClass = getMinigame(currentMinigame.name);
  room.currentMinigame = new currentMinigameClass(room.players, (state: TurnBaseTimeoutState | RoundBaseTimeoutState) => {
    const game = room.currentMinigame;

    if (!game) {
      return;
    }

    if (game instanceof TurnBasedMinigame) {
      switch (state) {
        case 'NEXT_TURN':
          console.log('NEXT_TURN');
          break;
        case 'INTRO_END':
          console.log('INTRO_END');
          break;
        case 'END_GAME':
          console.log('END_GAME');

          room.startTimer(GAME_STATE_DURATION.MINIGAME);
          break;
      }
    } else if (game instanceof RoundBasedMinigame) {
      switch (state) {
        case 'SHOW_RESULT':
          console.log('SHOW_RESULT');
          break;
        case 'NEXT_ROUND':
          console.log('NEXT_ROUND');
          break;
        case 'INTRO_END':
          console.log('INTRO_END');
          break;
        case 'END_GAME':
          console.log('END_GAME');

          room.startTimer(GAME_STATE_DURATION.MINIGAME);
          break;
      }
    }
  });
};

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on('create_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (room) return { success: false, message: `Room ${roomCode} already exists!` };

    //TODO: merge Lobby and Leaderboard
    room = RoomManager.createRoom(roomCode, (room: Room, state: GameStateType) => {
      switch (state) {
        case GameStateType.Lobby:
          console.log('Lobby END');

          setMinigame(io, room);

          room.setGameState(GameStateType.Animation);
          room.startTimer(GAME_STATE_DURATION.ANIMATION);

          //TODO: gameState, endAt, minigame
          io.to(roomCode).emit('temp', 'MINIGAME_INTRO');
          break;

        case GameStateType.Animation:
          console.log('Animation END');

          room.setGameState(GameStateType.Minigame);
          room.currentMinigame?.start();

          //TODO: gameState, endAt from game,
          break;

        case GameStateType.Minigame:
          console.log('Minigame END');

          room.setGameState(GameStateType.Leaderboard);
          room.startTimer(GAME_STATE_DURATION.LEADERBOARD);

          //TODO: gameState, endAt, players
          break;

        case GameStateType.Leaderboard:
          if (room.settings.isLastMinigame()) {
            room.setGameState(GameStateType.Finished);
            room.startTimer(GAME_STATE_DURATION.FINISHED);

            //TODO: gameState, endAt, players
          } else {
            console.log('Leaderboard END');

            setMinigame(io, room);

            room.setGameState(GameStateType.Animation);
            room.startTimer(GAME_STATE_DURATION.ANIMATION);

            //TODO: gameState, endAt, minigame
            io.to(roomCode).emit('temp', 'MINIGAME_INTRO');
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
