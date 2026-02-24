import { Server, Socket } from 'socket.io';
import { Player } from '@engine-core/Player';
import { RoomManager } from '@engine-managers/RoomManager';
import { GameStateResponse, GameStateType, JOIN_ROOM_STATUS } from '@shared/types';
import Room from '@engine/core/room/Room';
import { TurnBasedMinigame } from '@minigame-base/TurnBasedMinigame';
import { RoundBaseTimeoutState, TurnBaseTimeoutState } from '@backend-types';
import { RoundBasedMinigame } from '@minigame-base/RoundBasedMinigame';
import { getMinigame } from '@engine/managers/MinigameManager';
import { COUNTDOWN, MAX_PLAYERS } from '@shared/constants/gameRules';

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on('create_room', (roomCode: string, nickname: string) => {
    let room = RoomManager.getRoom(roomCode);
    if (room) return { success: false, message: `Room ${roomCode} already exists!` };

    room = RoomManager.createRoom(
      roomCode,
      (room: Room, finishedGameState: GameStateType, response: GameStateResponse) => {
        if (finishedGameState === GameStateType.Finished) {
          io.to(roomCode).emit('end_game');
          return;
        }

        if (finishedGameState === GameStateType.Lobby) io.to(roomCode).emit('got_players', room.getPlayers());

        io.to(roomCode).emit('update_game_state', response);
      },
      (room: Room) => {
        const currentMinigame = room.settings.getNextMinigame();
        const roomCode = room.getData().roomCode;

        if (!currentMinigame) {
          throw new Error('Missing currentMinigame');
        }

        const currentMinigameClass = getMinigame(currentMinigame.name);
        room.currentMinigame = new currentMinigameClass(room.players, (response: TurnBaseTimeoutState | RoundBaseTimeoutState) => {
          const game = room.currentMinigame;

          if (!game || !response.success) return;

          if (game instanceof TurnBasedMinigame) {
            switch (response.state) {
              case 'NEXT_TURN':
                console.log('NEXT_TURN');
                room.setGameState(GameStateType.MinigameIntro);
                room.startTimer(COUNTDOWN.MINIGAME_INTRO_MS);

                const { id, nickname } = game.getCurrentTurnPlayer();

                io.to(roomCode).emit('player_exploded', room.getPlayers());
                io.to(roomCode).emit('update_game_state', {
                  gameState: room.getGameState(),
                  endAt: room.getTimer()?.getEndAt(),
                  event: 'ANIMATION_UPDATE',
                  payload: { type: 'TURN', value: { id, nickname } },
                });
                break;
              case 'END_GAME':
                console.log('END_GAME');
                room.setGameState(GameStateType.MinigameOutro);
                room.startTimer(COUNTDOWN.MINIGAME_CLOSE_DELAY_MS);

                io.to(roomCode).emit('player_exploded', room.getPlayers());
                io.to(roomCode).emit('update_game_state', { gameState: room.getGameState(), endAt: room.getTimer()?.getEndAt() });
                break;
            }
          } else if (game instanceof RoundBasedMinigame) {
            switch (response.state) {
              case 'SHOW_RESULT':
                console.log('SHOW_RESULT');
                room.setGameState(GameStateType.MinigameOutro);

                io.to(roomCode).emit('round_end', room.getGameState(), game.getSummaryTimer().getEndAt(), room.getPlayers(), game.getGameData());
                break;
              case 'NEXT_ROUND':
                console.log('NEXT_ROUND');
                room.setGameState(GameStateType.MinigameIntro);
                room.startTimer(COUNTDOWN.MINIGAME_INTRO_MS);

                io.to(roomCode).emit('update_game_state', {
                  gameState: room.getGameState(),
                  endAt: room.getTimer()?.getEndAt(),
                  event: 'ANIMATION_UPDATE',
                  payload: { type: 'ROUND', value: game.getRound(), config: game.getGameConfig() },
                });
                break;
              case 'END_GAME':
                console.log('END_GAME');
                room.setGameState(GameStateType.MinigameOutro);
                room.startTimer(COUNTDOWN.MINIGAME_CLOSE_DELAY_MS);

                io.to(roomCode).emit('update_game_state', { gameState: room.getGameState(), endAt: room.getTimer()?.getEndAt() });
                break;
            }
          }
        });

        return currentMinigame;
      },
    );

    const player = new Player(socket.id, nickname, true);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      io.to(socket.id).emit('created_room', { roomCode, id: socket.id });
    }
  });

  socket.on('join_room', (roomCode: string, nickname: string, storageId: string, callback) => {
    let room = RoomManager.getRoom(roomCode);
    if (!room) return callback(JOIN_ROOM_STATUS.ROOM_NOT_FOUND);
    if (room.getPlayers().length === MAX_PLAYERS) return callback(JOIN_ROOM_STATUS.ROOM_FULL);
    if (room.getData().gameState !== GameStateType.Lobby || (room.getData().gameState === GameStateType.Lobby && room.getTimer()?.getEndAt()))
      return callback(JOIN_ROOM_STATUS.ROOM_IN_GAME);

    const player = new Player(socket.id, nickname);
    const result = room.addPlayer(player);

    if (result.success) {
      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.to(roomCode).emit('player_join_toast', nickname);
      callback(JOIN_ROOM_STATUS.SUCCESS);
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
