const { SlashCommandBuilder } = require('discord.js')
const { DiscordSlashCommandName} = require('../../defines/commands_info.cjs');

module.exports =  {
	data: new SlashCommandBuilder()
		.setName(DiscordSlashCommandName.kStopAsking)
		.setDescription('Stop asking bots.'),
	async execute(interaction) {
		await interaction.reply({content: 'Goodbye, feel free to ask me if you have any questions.', ephemeral: true});
	},
};