export function setSessionVariables(roomCode: string, nickname: string) {
  sessionStorage.setItem('roomCode', roomCode);
  sessionStorage.setItem('nickname', nickname);
}

export const generateRandomUserName = () => {
  const adjectives = [
    "Ultra",
    "Super",
    "Cool",
    "Magic",
    "Banana",
    "Boring",
    "Lazy",
    "Strong",
    "Infinity",
    "Party",
    "Funny",
    "Crazy",
    "Happy",
    "Sad",
    "Angry",
    "Epic",
    "Legendary",
    "Pro",
    "Noob",
    "Dumb",
    "Smart",
    "Fast",
    "Slow",
    "Big",
    "Small",
    "Mr",
    "Mrs",
    "Sensei",
    "Master",
    "King",
    "Queen",
    "Lord",
    "Sir",
  ];

  const nouns = [
    "Mango",
    "Monkey",
    "Kiwi",
    "Guy",
    "Bread",
    "Ninja",
    "Samurai",
    "Panda",
    "Potato",
    "Sigma",
    "Banana",
    "Cat",
    "Dog",
    "Cyclop",
    "Bro",
    "Dude",
    "Doc",
    "Buffalo",
    "Chicken",
    "Turtle",
    "Penguin",
    "Marcello",
    "Fernando Melo",
    "Amigo",
  ]; 

  const randomUsername = `${adjectives[Math.floor(Math.random() * adjectives.length)]}
                          ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  return randomUsername;
}