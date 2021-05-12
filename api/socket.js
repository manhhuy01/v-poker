import io from 'socket.io-client';
let socket;

const API = process.env.NEXT_PUBLIC_API

export const initiateSocket = ({ user }) => {
  socket = io(API, { query: { userName: user.userName } })
  console.log(`connected socket...`);
  socket.on("disconnect", () => {
    socket.connect();
  });
}

export const subscribeToGetData = (cb) => {
  if (!socket) return (true);
  socket.on('data', data => {
    console.log('data event received!');
    return cb(null, data);
  });
}

export const sendMessage = (room, message) => {
  if (socket) socket.emit('chat', { message, room });
}