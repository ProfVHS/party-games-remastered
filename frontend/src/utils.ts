import classNames from 'classnames';

export function setSessionVariables(roomCode: string, id: string) {
  localStorage.setItem('roomCode', roomCode);
  localStorage.setItem('id', id);
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

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};
