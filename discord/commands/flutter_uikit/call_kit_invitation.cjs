const { SlashCommandBuilder } = require('discord.js')
const { DiscordSlashCommandName} = require('../../defines/commands_info.cjs');

module.exports =  {
	data: new SlashCommandBuilder()
		.setName(DiscordSlashCommandName.kFlutterCallKitInvitation)
		.setDescription('Asking question about flutter Call Kit with invitation feature'),
	async execute(interaction) {
		await interaction.reply({content: 'Hey, you can ask me anything about Flutter Call Kit with invitation feature now! Please feel free to ask one question at a time, as asking too many questions at once might make me confused.', ephemeral: true});
	},
};