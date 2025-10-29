export const MIN_PLAYERS_TO_START = 1;
export const MAX_PLAYERS = 8;

export const CLICK_THE_BOMB_RULES = {
  LOSS: -50,
  POINTS: [15, 17, 20, 23, 26, 30, 35],
  COUNTDOWN: 15, // Seconds
};

export const CARDS_RULES = {
  COUNTDOWN: 10,
  ROUND_1: [25, 25, 30, 50, 50, 60, -15, -15, -30],
  ROUND_2: [50, 50, 50, 70, 90, -15, -30, -30, -50],
  ROUND_3: [50, 90, 90, 120, -40, -40, -70, -70, -90],
};
