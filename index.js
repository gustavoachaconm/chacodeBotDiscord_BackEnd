require("dotenv").config();
const mongoose = require("mongoose");
const { Client, GatewayIntentBits } = require("discord.js");

const { DISCORD_TOKEN, MONGODB_URI } = process.env;

const loadCommands = require("./selectors/commandsSelector");
const loadEvents = require("./selectors/eventsSelector");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    loadCommands(client);
    loadEvents(client);
    client.login(DISCORD_TOKEN);
  })
  .catch((err) => {
    console.error("Error de conexión a MongoDB:", err);
    process.exit(1);
  });
