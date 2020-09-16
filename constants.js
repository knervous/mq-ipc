const mqServerName = "macroquest";
const mqClientConnected = "MACROQUEST_CLIENT_CONNECTED";
const mqClientDisconnected = "MACROQUEST_CLIENT_DISCONNECTED";
const mqMessage = "MACROQUEST_MESSAGE";
const mqResponseRequested = "MACROQUEST_RESPONSE_REQUESTED";

/**
 * Message Types
 * @enum {number}
 */
const MqMessageTypes = {
  Eval: 100,
  GetHealth: 101,
  GetMana: 102,
};

module.exports = {
  mqClientConnected,
  mqClientDisconnected,
  mqMessage,
  mqResponseRequested,
  mqServerName,
  MqMessageTypes,
};
