const { clientConnect } = require("./client.js");
const { mqClientConnected } = require("./constants.js");

// Mock mq object
const client = clientConnect({ me: { name: "TestClient2", spawn: { hpCurrent: 100, manaCurrent: 150 } } });

client.onConnected.then(async () => {

    console.log('I was connected');

    const response = await client.playerEval('TestClient1', () => {
        // Enter their scope and return health + mana
        return mq.me.spawn.hpCurrent + mq.me.spawn.manaCurrent;
    });

    const allHealth = await client.allGetHealth();

    console.log('Got response', response)
    console.log('Healths')
    console.dir(allHealth)
})