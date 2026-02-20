export type ReturnDataType = {
  success: boolean;
  payload?: any;
};

export const JOIN_ROOM_STATUS = {
    SUCCESS: "SUCCESS",
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
    ROOM_FULL: "ROOM_FULL",
    ROOM_IN_GAME: "ROOM_IN_GAME",
    INTERNAL_ERROR: "INTERNAL_ERROR",
}

export type JoinRoomStatus =
    typeof JOIN_ROOM_STATUS[keyof typeof JOIN_ROOM_STATUS];