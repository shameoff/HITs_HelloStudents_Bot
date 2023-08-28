const { log } = require("console") //to use console.log and so on
const fs = require('node:fs');
const path = require('node:path')
require("dotenv").config(); //to start process from .env file

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, REST, Routes, userMention} = require('discord.js');

// variables
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_BOT_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection()
client.welcome_messages = new Collection()

// Grab all the command files from the commands directory you created earlier
const commandsFolderPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(commandsFolderPath).filter(dir => fs.lstatSync(path.join(commandsFolderPath, dir)).isDirectory());

const commandsFolder = fs.readdirSync(commandsFolderPath)
for (const file of commandsFolder.filter(file => fs.lstatSync(path.join(commandsFolderPath, file)).isFile())
	.filter(file => file.endsWith(".js"))) {
	const filePath = path.join(commandsFolderPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//handling commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		let result = await command.execute(interaction);
		console.log(result);
		if (interaction.commandName === "set-message") {
			client.welcome_messages.set(guildId, result)
		}
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.GuildMemberAdd, async member => {
	let welcome_channel = member.guild.channels.cache.find((channel) => channel.name === "welcome")
	let student_role = member.guild.roles.cache.find((role) => role.name === "Student")
	await member.roles.add(student_role)
	welcome_channel.send(`${userMention(member.id)}, ${welcome_messages.guildId}`)
	console.log(`New Student, his displayName is ${member.displayName}!`)
})

// Login to Discord with your client's token
client.login(token);
