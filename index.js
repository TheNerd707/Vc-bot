require("dotenv").config();
const { databaseToken } = process.env;
const { connect } = require("mongoose");
const start  = require(`./functions/start`)
const left = require(`./functions/left`);
const joined = require(`./functions/joined`);
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});



client.once("ready", async () => {
  console.log("Up");
 //start(client) //only needed to set database 
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState.channel && !oldState.channel) {
    console.log("VC Joined");
    await joined(newState, oldState, client);
  }
  if (!newState.channel && oldState.channel) {
    console.log("VC Left");
    await left(newState, oldState, client);
  }
  if (newState.channel && oldState.channel) {
    console.log("VC Switched");
    await joined(newState, oldState, client);
    await left(newState, oldState, client);
  }
});

client.login(process.env.token);
(async () => {
  connect(databaseToken).catch(console.error);
})();