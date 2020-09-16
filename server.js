const ipc = require("node-ipc");
const {
  mqMessage,
  mqServerName,
  mqClientConnected,
  mqClientDisconnected,
  mqResponseRequested,
} = require("./constants");

ipc.config.id = mqServerName;
ipc.config.retry = 1500;
ipc.config.silent = true;

/**
 * mqMessage object schema:
 * {
 *      target: 0 for all otherwise player name, corresponding to client id
 *      responseToken: uuid, client expects a response, emit this message and payload
 *      id: ID of the client sending the message,
 *      message: {
 *          type: MqMessageType - Eval, GetHealth, GetMana etc.,
 *          payload: data - function to run possibly
 *      },
 * }
 */

const clients = {};
const start = (mq = {}) => {
  ipc.serveNet(function () {
    if (mq.log) {
      mq.log("Server started");
    }
    function disconnect() {
      ipc.server.broadcast("kill.connection", {
        id: ipc.config.id,
      });
    }

    // Cleanup handler
    process.on("beforeExit", disconnect);
    process.on("SIGINT", () => {
      disconnect();
      process.exit(0);
    });
    process.on("SIGTERM", disconnect);

    // On client connect, add to map
    ipc.server.on(mqClientConnected, function (id, socket) {
      clients[id] = socket;
    });
    // On client disconnected, delete from map
    ipc.server.on(mqClientDisconnected, function (id, socket) {
      clients[id] = socket;
    });
    ipc.server.on(mqMessage, function (data, socket) {
      const { target, responseToken, id, message } = data;
      const uniqueResponse = `${mqResponseRequested}-${responseToken}`;

      const respondToSender = (data) => {
        ipc.server.emit(socket, responseToken, data);
      };
      // Intent to broadcast to all clients
      if (target === 0) {
        const dataResponse = {};
        function clientCallback({ returnValue, id }) {
          dataResponse[id] = returnValue;

          // When we're finished, unregister and send the aggregate back to caller
          if (Object.keys(clients).every((clientId) => Object.keys(dataResponse).includes(clientId))) {
            respondToSender(dataResponse);
            ipc.server.off(uniqueResponse, clientCallback);
          }
        }
        ipc.server.on(uniqueResponse, clientCallback);

        ipc.server.broadcast(mqResponseRequested, {
          uniqueResponse,
          message,
        });
      } else {
        if (clients[target]) {
          function clientCallback({ returnValue }) {
            // Now we send back to the original caller
            respondToSender(returnValue);

            // And unregister our event
            ipc.server.off(uniqueResponse, clientCallback);
          }
          ipc.server.on(uniqueResponse, clientCallback);

          ipc.server.emit(clients[target], mqResponseRequested, { uniqueResponse, message });
        } else {
          // Otherwise client is not connected or does not exist
          respondToSender({ error: `Client does not exist: ${target}` });
        }
      }
      //ipc.log("got a message from", data.id, data.message);
      ipc.server.emit(socket, mqMessage, {
        id: ipc.config.id,
        message: data.message + " world!",
      });
    });
  });
};

module.exports = {
  start,
  stop: ipc.server.stop,
  server: ipc.server,
};
