const { clientConnect } = require("./client.js");

const client = clientConnect({ me: { name: "TestClient1", spawn: { hpCurrent: 42, manaCurrent: 99 } } });

client.onConnected.then(async () => {
  console.log("I was connected");
});
