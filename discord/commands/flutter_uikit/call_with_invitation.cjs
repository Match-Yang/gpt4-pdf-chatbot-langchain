const { SlashCommandBuilder } = require('discord.js')

module.exports =  {
	data: new SlashCommandBuilder()
		.setName('flutter_uikit_call_invitation')
		.setDescription('Asking question about flutter Call Kit with invitation feature'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};