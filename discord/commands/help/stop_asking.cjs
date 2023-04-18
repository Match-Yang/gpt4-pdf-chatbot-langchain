const { SlashCommandBuilder } = require('discord.js')

module.exports =  {
	data: new SlashCommandBuilder()
		.setName('stop_asking')
		.setDescription('Stop asking bots.'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};