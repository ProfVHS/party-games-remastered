import classNames from 'classnames';

export function setSessionVariables(roomCode: string, id: string) {
  sessionStorage.setItem('roomCode', roomCode);
  localStorage.setItem('id', id);
}

export function clearSessionVariables() {
  sessionStorage.removeItem('roomCode');
  localStorage.removeItem('id');
}

type Modifier = string | false | null | undefined;
type ConditionalModifiers = Record<string, boolean | undefined | null>;
type ClassName = string | undefined;

export const ClassNames = (block: string, ...args: (Modifier[] | ConditionalModifiers | ClassName)[]): string => {
  let modifiers: Modifier[] = [];
  let conditionalModifiers: ConditionalModifiers = {};
  let className: string | undefined;

  args.forEach((arg) => {
    if (Array.isArray(arg)) {
      modifiers = arg;
    } else if (typeof arg === 'string') {
      className = arg;
    } else if (typeof arg === 'object' && arg !== null) {
      conditionalModifiers = arg;
    }
  });

  const formattedModifiers = modifiers.filter((modifier) => Boolean(modifier)).map((modifier) => `${block}--${modifier}`);
  const conditionalClasses = Object.entries(conditionalModifiers)
    .filter(([_key, value]) => Boolean(value))
    .map(([key]) => `${block}--${key}`);

  return classNames(block, ...formattedModifiers, ...conditionalClasses, className);
};

export const formatMilisecondsToTimer = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const miliseconds = ms % 100;

  return `${String(seconds).padStart(2, '0')}:${String(miliseconds).padStart(2, '0')}`;
};

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
    'Sir'
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
    'Amigo'
  ];

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

// Record => Object which needs to have: keys of type XYZ and values of type XYZ
// In this case Keys NEED to be a number and values NEED to be an array of objects with...
// ... keys named row and col which are both numbers
export const possibleAvatarLayouts: Record<number, { row: number; col: number }[]> = {
  // All positions comments are relative to the lobby e.g. Top means Above/Top of the lobby
  1: [{ row: 1, col: 2 }], // Top
  2: [
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 } // Right
  ],
  3: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 } // Top right
  ],
  4: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 3 } // Bottom right
  ],
  5: [
    { row: 2, col: 1 }, // Left
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 3 } // Right
  ],
  6: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 } // Bottom right
  ],
  7: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 } // Bottom right
  ],
  8: [
    { row: 1, col: 1 }, // Top left
    { row: 1, col: 2 }, // Top
    { row: 1, col: 3 }, // Top right
    { row: 2, col: 1 }, // Left
    { row: 2, col: 3 }, // Right
    { row: 3, col: 1 }, // Bottom left
    { row: 3, col: 2 }, // Bottom
    { row: 3, col: 3 } // Bottom right
  ]
};
