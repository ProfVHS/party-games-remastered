# Party Games -  Real Time Multiplayer Web Application
**PartyGames** is a full-featured real-time multiplayer web application designed for 4–8 players, offering a set of competitive mini-games with dynamic session management.

## Core Features:
- Advanced lobby system with:
   - Configurable game modes (random mini-games or predefined list)
   - Original custom avatar selection
   - Optional tutorial before each mini-game
- Mini-games can be round-based or turn-based
- Real-time gameplay synchronization using `Socket.IO`: player and game actions are controlled by backend and sent to frontend for display
- Dynamic leaderboard displayed after each mini-game
- Final podium screen with automatic winner selection
- Toast notifications for success and error events
- Animations for smoother user experience

## Backend Architecture:
- Modular, object-oriented (class-based) backend design
- Game logic implemented using structured state management
- Centralized application state as a single source of truth
- Scalable architecture designed for easy addition of new mini-games
- Currently, players who disconnect are removed

## Tech Stack:
Frontend: `React`

Backend: `Node.js` + `Express`

Real-Time Communication: `Socket.IO`

## Notes & Future Enhancements
- Implement reconnect for disconnected players
- Add Redis for scalable session management
