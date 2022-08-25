const fs = require("fs")

require("dotenv").config(); //to start process from .env file

// Require the necessary discord.js classes
const { Client, GatewayIntentBits, messageLink } = require('discord.js');
const { log } = require("console");
const token = process.env.TOKEN;

const welcomeMessageFor1stGrade = fs.readFileSync("./welcomeTextFor1stGradeServer").toString();
const welcomeMessageForFreeTime = fs.readFileSync("./welcomeTextForFreeTimeServer").toString();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot is online!');
});


client.on("guildMemberAdd", async member => {
	// let student_role = member.guild.roles.cache.find((role) => role.name === "Student")
	// member.roles.add(student_role)
	let welcome_channel = member.guild.channels.cache.find((channel) => channel.name === "welcome")
	welcome_channel.send(`${member}` + (member.guild.name == "972205"? welcomeMessageFor1stGrade : welcomeMessageForFreeTime))
	console.log("NEW USER!")
})
// Login to Discord with your client's token
client.login(token);
