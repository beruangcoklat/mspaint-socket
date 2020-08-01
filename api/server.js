const express = require("express");
const app = express();
const server = app.listen(8080, "0.0.0.0");
const io = require("socket.io").listen(server);
const redis = require("redis");
const publisher = redis.createClient(6379, "redis");
const subscriber = redis.createClient(6379, "redis");
const currID = Math.random().toString(36).substring(7);

var sockets = [];

const broadcastData = (msg, socket) => {
  sockets.filter((e) => e != socket).forEach((s) => s.emit("data", msg));
};

io.on("connection", (socket) => {
  sockets.push(socket);

  socket.on("disconnect", () => {
    sockets = sockets.filter((e) => e != socket);
  });

  socket.on("data", (msg) => {
    broadcastData(msg, socket);
    publisher.publish(
      "data",
      JSON.stringify({
        msg,
        id: currID,
      })
    );
  });
});

subscriber.on("message", (channel, message) => {
  if (channel === "data") {
    const { id, msg } = JSON.parse(message);
    if (id === currID) return;
    broadcastData(msg, null);
  }
});

subscriber.subscribe("data");
