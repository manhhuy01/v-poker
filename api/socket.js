import io from 'socket.io-client';
let socket;

const API = process.env.NEXT_PUBLIC_API

export const initiateSocket = ({ token }) => {
  socket = io(API, { query: { token } })
  console.log(`connected socket...`);
  socket.on("disconnect", () => {
    socket.connect();
  });
}

export const subscribeToGetData = (cb) => {
  if (!socket) return (true);
  socket.on('data', data => {
    return cb(null, data);
  });
}

export const subscribeToGetNotification = (cb) => {
  if (!socket) return (true);
  socket.on('notification', data => {
    return cb(null, data);
  });
}


export const subscribeToGetMessage = (cb) => {
  if (!socket) return (true);
  socket.on('chat', data => {
    return cb(null, data);
  });
}

export const sendMessage = ({ message, userName }) => {
  socket.emit('sendMessage', { userName, message })
}
