const { SlashCommandBuilder } = require('discord.js')

module.exports =  {
	data: new SlashCommandBuilder()
		.setName('flutter_uikit_call')
		.setDescription('Asking question about flutter Call Kit'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};