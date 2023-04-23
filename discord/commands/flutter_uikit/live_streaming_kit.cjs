const { SlashCommandBuilder } = require('discord.js')
const { DiscordSlashCommandName} = require('../../defines/commands_info.cjs');

module.exports =  {
	data: new SlashCommandBuilder()
		.setName(DiscordSlashCommandName.kFlutterLiveStreamingKit)
		.setDescription('Asking question about flutter Live Streaming Kit'),
	async execute(interaction) {
		await interaction.reply({content: 'Hey, you can ask me anything about Flutter Live Streaming Kit now! Please feel free to ask one question at a time, as asking too many questions at once might make me confused.', ephemeral: true});
	},
};