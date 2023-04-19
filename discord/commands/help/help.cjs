const { SlashCommandBuilder } = require('discord.js')
const { DiscordSlashCommandName} = require('../../defines/commands_info.cjs');

module.exports =  {
	data: new SlashCommandBuilder()
		.setName(DiscordSlashCommandName.kHelp)
		.setDescription('Getting help of how to use this bot.'),
	async execute(interaction) {
		await interaction.reply({content: "If you want to ask me a question, please use the corresponding slash command to select the question you want to ask. For example, if you want to inquire about Flutter's Live Streaming Kit, you can use `/flutter_live_streaming_kit`. When you no longer want to ask questions, please send the `/stop_asking` command, so that I won't bother you anymore.", ephemeral: true});
	},
};