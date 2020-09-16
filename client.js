const ipc = require("node-ipc");
const { v4: uuid } = require("uuid");
const {
  mqMessage,
  mqServerName,
  mqClientConnected,
  mqClientDisconnected,
  MqMessageTypes,
  mqResponseRequested,
} = require("./constants");

function clientConnect(mq) {
  ipc.config.id = mq.me.name;
  ipc.config.retry = 1500;
  ipc.config.maxRetries = 10;
  ipc.config.silent = true;

  let connectedRes;
  const onConnected = new Promise((res) => (connectedRes = res));

  const tryReconnect = () =>
    ipc.connectToNet(mqServerName, function () {
      // Cleanup handler
      process.on("beforeExit", disconnect);
      process.on("SIGINT", () => {
        disconnect();
        process.exit(0);
      });
      process.on("SIGTERM", disconnect);

      ipc.of[mqServerName].on("connect", function () {
        connectedRes();
        ipc.of[mqServerName].emit(mqClientConnected, ipc.config.id);
      });

      ipc.of[mqServerName].on("disconnect", disconnect);

      ipc.of[mqServerName].on(mqResponseRequested, async function ({ uniqueResponse, message }) {
        let returnValue;
        switch (message.type) {
          case MqMessageTypes.Eval:
            const fn = eval(message.payload);
            if (typeof fn === "function") {
              try {
                returnValue = await fn();
              } catch (e) {
                if (mq.warn) {
                  mq.warn(e.stack);
                }
                returnValue = { error: e.message, stack: e.stack };
              }
            }
            break;
          case MqMessageTypes.GetHealth:
            returnValue = mq.me.spawn.hpCurrent;
            break;
          case MqMessageTypes.GetMana:
            returnValue = mq.me.spawn.manaCurrent;
            break;
          default:
            break;
        }

        ipc.of[mqServerName].emit(uniqueResponse, { returnValue, id: ipc.config.id });
      });

      ipc.of[mqServerName].on("kill.connection", function (data) {
        ipc.disconnect(mqServerName);
      });
    });

  tryReconnect();

  /**
   *
   * @param {*} target Target playername or 0 for broadcasting to everyone
   * @param {*} type Type of action to perform
   * @param {*} data Data to send
   */
  function sendMessage(target, type, data) {
    return new Promise((res, rej) => {
      try {
        const responseToken = uuid();
        // Send payload to server to route wherever needed
        ipc.of[mqServerName].emit(mqMessage, {
          target,
          responseToken,
          id: ipc.config.id,
          message: { type: type, payload: data },
        });
        // Server will respond to responseToken with possible data
        ipc.of[mqServerName].once(responseToken, (response) => {
          res(response);
        });
      } catch (e) {
        rej(e);
        console.warn("Error", e);
      }
    });
  }

  // Exported functions

  function disconnect() {
    if (ipc.of[mqServerName]) {
      ipc.of[mqServerName].emit(mqClientDisconnected, ipc.config.id);
    }
  }

  function _sendToPlayer(player, type, data) {
    return sendMessage(player, type, data);
  }

  function _sendToAll(type, data) {
    return sendMessage(0, type, data);
  }

  function playerEval(player, fn) {
    if (typeof fn !== "function") {
      throw new Error("You need to pass a function to eval");
    }
    return _sendToPlayer(player, MqMessageTypes.Eval, fn.toString());
  }

  function playerGetHealth(player) {
    return _sendToPlayer(player, MqMessageTypes.GetHealth);
  }

  function playerGetMana(player) {
    return _sendToPlayer(player, MqMessageTypes.GetMana);
  }

  function allEval(fn) {
    if (typeof fn !== "function") {
      throw new Error("You need to pass a function to eval");
    }
    return _sendToAll(MqMessageTypes.Eval, fn.toString());
  }

  function allGetHealth() {
    return _sendToAll(MqMessageTypes.GetHealth);
  }

  function allGetMana() {
    return _sendToAll(MqMessageTypes.GetMana);
  }

  return {
    // Connected promise
    onConnected,

    // Connection start/stop
    tryReconnect,
    disconnect,

    // Exposed to get values
    playerEval,
    playerGetHealth,
    playerGetMana,
    allEval,
    allGetHealth,
    allGetMana,
  };
}

module.exports = { clientConnect };
