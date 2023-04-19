const { SlashCommandBuilder } = require('discord.js')
const { DiscordSlashCommandName} = require('../../defines/commands_info.cjs');

module.exports =  {
	data: new SlashCommandBuilder()
		.setName(DiscordSlashCommandName.kFlutterCallKit)
		.setDescription('Asking question about flutter Call Kit'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};