require("dotenv").config(); //to start process from .env file
// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot is online!');
});

// Login to Discord with your client's token
client.login(token);