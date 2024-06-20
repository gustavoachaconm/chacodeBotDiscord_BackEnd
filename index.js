
//IMPORTS
const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN } = process.env;
const loadCommands = require("./selectors/commandsSelector");
const loadEvents = require("./selectors/eventsSelector"); 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();


//ROUTES
const authRoutes = require('./services/auth')


// DB CONNECTION
const ConnectDB = require("./database/db");
const morgan = require("morgan");
ConnectDB()
const port = process.env.PORT || 9000


// DISCORD BOT
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
loadCommands(client);
loadEvents(client);
client.login(DISCORD_TOKEN);


//MIDDLEWARE EXPRESS

const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser())


app.use('/v1/api/auth',authRoutes)


app.listen(port,()=>{
  console.log(`Rest Api works on port ${port}`)
})