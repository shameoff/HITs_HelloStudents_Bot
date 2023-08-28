// parsing commands
const {REST, Routes} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require("dotenv").config(); //to start process from .env file


const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_BOT_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID

// Grab all the command files from the commands directory you created earlier
const commands = [];
const commandsFolderPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(commandsFolderPath).filter(dir => fs.lstatSync(path.join(commandsFolderPath, dir)).isDirectory());

const commandsFolder = fs.readdirSync(commandsFolderPath)
for (const file of commandsFolder.filter(file => fs.lstatSync(path.join(commandsFolderPath, file)).isFile())
    .filter(file => file.endsWith(".js"))) {
    const filePath = path.join(commandsFolderPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();