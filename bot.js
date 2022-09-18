const { log } = require("console") //to use console.log and so on
require("dotenv").config(); //to start process from .env file

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');

// variables
const token = process.env.TOKEN;
const group_server_name = process.env.GROUPSERVER_NAME
const freetime_server_name = process.env.FREETIMESERVER_NAME

const MessageForGroupServer = process.env.WELCOME_MESSAGE_FOR_GROUP_SERVER
const MessageForFreeTime = process.env.WELCOME_MESSAGE_FOR_FREETIME_SERVER

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot is online!');
});


client.on("guildMemberAdd", async member => {
	let welcome_channel = member.guild.channels.cache.find((channel) => channel.name === "welcome")
	if (member.guild.name === group_server_name){
		
		let student_role = member.guild.roles.cache.find((role) => role.name === "Student")
		member.roles.add(student_role)
		welcome_channel.send(`${member} ${MessageForGroupServer}`)
		console.log("New Student!")
	}
	else if (member.guild.name === freetime_server_name){

		let guest_role = member.guild.roles.cache.find((role) => role.name === "Guest")
		member.roles.add(guest_role)
		welcome_channel.send(`${member}  ${MessageForFreeTime}`)
		console.log("New Guest!")
	}
})
// Login to Discord with your client's token
client.login(token);
