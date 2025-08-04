import {
  handleJoinRoom,
  handleSubmitAnswer,
  handleDisconnect,
  handleStartGame, // ✅ now exists
  handleLeaveGame, // ✅ now exists

} from '../Socket/controllers/multiplayerController.js';

export function setupMultiplayerSocket(io) {
  io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => handleJoinRoom(io, socket, data));
    socket.on('submitAnswer', (data) => handleSubmitAnswer(io, socket, data));
    socket.on('startGame', (data) => handleStartGame(io, socket, data));
    socket.on('disconnect', () => handleDisconnect(io, socket));
    socket.on("leaveGame", () => {
      
      console.log("leaveGame received from client");
      handleLeaveGame(io, socket);
    });
  });
}
  console.log('✅ Multiplayer socket setup complete');