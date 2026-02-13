export const MIN_PLAYERS_TO_START = 2;
export const MAX_PLAYERS = 8;

export const CLICK_THE_BOMB_RULES = {
  LOSS: -50,
  POINTS: [15, 17, 20, 23, 26, 30, 35],
  COUNTDOWN: 10, // Seconds
};

export const CARDS_RULES = {
  COUNTDOWN_MS: 10000,
  COUNTDOWN_SUMMARY_MS: 8000,
  MAX_ROUNDS: 3,
  ROUND_1: [25, 25, 30, 50, 50, 60, -15, -15, -30],
  ROUND_2: [50, 50, 50, 70, 90, -15, -30, -30, -50],
  ROUND_3: [50, 90, 90, 120, -40, -40, -70, -70, -90],
};

export const TRICKY_DIAMONDS_RULES = {
  COUNTDOWN_MS: 10000,
  COUNTDOWN_SUMMARY_MS: 5000,
  MAX_ROUNDS: 3,
  ROUND_1: [150, 100, 35],
  ROUND_2: [200, 125, 50],
  ROUND_3: [250, 150, 75],
};
