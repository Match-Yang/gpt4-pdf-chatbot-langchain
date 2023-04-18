const { SlashCommandBuilder } = require('discord.js')

module.exports =  {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Getting help of how to use this bot.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};