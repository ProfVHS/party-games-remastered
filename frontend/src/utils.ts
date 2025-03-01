import { Minigame } from "./types";

export function setSessionVariables(roomCode: string, nickname: string) {
  sessionStorage.setItem('roomCode', roomCode);
  sessionStorage.setItem('nickname', nickname);
}

export function clearSessionVariables() {
  sessionStorage.removeItem('roomCode');
  sessionStorage.removeItem('nickname');
}

export const generateRandomUserName = () => {
  const adjectives = [
    'Ultra',
    'Super',
    'Cool',
    'Magic',
    'Banana',
    'Boring',
    'Lazy',
    'Strong',
    'Infinity',
    'Party',
    'Funny',
    'Crazy',
    'Happy',
    'Sad',
    'Angry',
    'Epic',
    'Legendary',
    'Pro',
    'Noob',
    'Dumb',
    'Smart',
    'Fast',
    'Slow',
    'Big',
    'Small',
    'Mr',
    'Mrs',
    'Sensei',
    'Master',
    'King',
    'Queen',
    'Lord',
    'Sir',
  ];

  const nouns = [
    'Mango',
    'Monkey',
    'Kiwi',
    'Guy',
    'Bread',
    'Ninja',
    'Samurai',
    'Panda',
    'Potato',
    'Sigma',
    'Banana',
    'Cat',
    'Dog',
    'Cyclop',
    'Bro',
    'Dude',
    'Doc',
    'Buffalo',
    'Chicken',
    'Turtle',
    'Penguin',
    'Marcello',
    'Fernando Melo',
    'Amigo',
  ];

  const randomUsername = `${adjectives[Math.floor(Math.random() * adjectives.length)]}
                          ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  return randomUsername;
};

export const shuffleGames = (minigames: Minigame[]) => {
  const shuffledGames = minigames;
  for (let i = shuffledGames.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledGames[i], shuffledGames[j]] = [shuffledGames[j], shuffledGames[i]];
  }
  return shuffledGames;
}

// Record => Object which needs to have: keys of type XYZ and values of type XYZ
// In this case Keys NEED to be a number and values NEED to be an array of objects with...
// ... keys named row and col which are both numbers
export const possibleAvatarLayouts: Record<number, { row: number; col: number }[]> = {
  // All positions comments are relative to the lobby eg. Top means Above/Top of the lobby
  1: [{ row: 1, col: 2 }], // Top
  2: [
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 }, // Right
  ],
  3: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
  ],
  4: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 3 }, // Bottom right
  ],
  5: [
    { row: 2, col: 1 }, // Left
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 3 }, // Right
  ],
  6: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
  7: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
  8: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 }, // Right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 }, // Bottom right
  ],
};
