const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-message')
        .setDescription('sets message for greeting new people')
        .addStringOption(option =>
            option.setName("message")
                .setDescription("message, which will be set")
                .setRequired(true)),
    async execute(interaction) {
        const message = interaction.options.get('message');

        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply(`Successfully installed new greeting message!`);
        return message;
    },
};