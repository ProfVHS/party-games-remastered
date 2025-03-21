export function setSessionVariables(roomCode: string, nickname: string) {
  sessionStorage.setItem('roomCode', roomCode);
  sessionStorage.setItem('nickname', nickname);
}
