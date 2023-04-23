import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Client, Collection, Events, IntentsBitField } from 'discord.js'
import { DiscordSlashCommandName, DiscordSlashCommandPineconeInfo } from '../defines/commands_info.cjs';


// 定义一个名为DiscordBot的类
export default class DiscordBot {
    constructor(port) {
        const discordClient = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ]
        });
        discordClient.commands = new Collection();
        discordClient.on(Events.InteractionCreate, this.commandHandler.bind(this));
        discordClient.on(Events.MessageCreate, this.messageHandler.bind(this));
        discordClient.on(Events.ClientReady, () => {
            console.log('Discord bot is ready');
        });

        discordClient.login(process.env.DISCORD_BOT_TOKEN);

        this._discordClient = discordClient;
        this._port = port;
        this._askingUserMap = {};

        this._setCommandsToBot();
    }

    async commandHandler(interaction) {
        if (!interaction.isChatInputCommand()) return;
        console.log(interaction);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if (interaction.commandName == DiscordSlashCommandName.kHelp) {
                // Show help
            }
            else if (interaction.commandName == DiscordSlashCommandName.kStopAsking) {
                if (this._askingUserMap[interaction.user.id]) {
                    delete this._askingUserMap[interaction.user.id];
                }
            } else {
                if (interaction.commandName in DiscordSlashCommandPineconeInfo) {
                    this._askingUserMap[interaction.user.id] = DiscordSlashCommandPineconeInfo[interaction.commandName];
                }
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }

    async messageHandler(message) {
        if (message.author.bot) return;
        if (message.content.startsWith('!')) return;
        // 如果message.author.id不在this._askingUserMap的Key列表中，则直接返回。这表示客户没有用slash command开始咨询
        const userAskingInfo = this._askingUserMap[message.author.id];
        if (!userAskingInfo) return;

        console.log('message: ', message)

        await message.channel.sendTyping();

        // Fetch history message
        let history = [];
        let prevMessages = await message.channel.messages.fetch({ limit: 20 });
        // prevMessages.reverse();

        var maxHistoryCount = 0;
        prevMessages.forEach(msg => {
            if (maxHistoryCount >= 4) return;
            if (message.content.startsWith('!')) return;
            if (msg.author.id != this._discordClient.user.id && message.author.bot) return;
            // 只需要当前发消息这个用户相关的历史
            if (msg.author.id != message.author.id) return;

            history.push(msg.content);
            maxHistoryCount ++;
        });

        try {
            const response = await fetch(`http://localhost:${this._port}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: message.content,
                    history,
                    pinecone_index_name: userAskingInfo.pinecone_index_name,
                    pinecone_name_space: userAskingInfo.pinecone_name_space,
                }),
            });
            const data = await response.json();
            console.log('data', data);

            if (data.error) {
                console.log("Fetch data from /api/chat error: ", data.error);
            } else {
                var answer = data.text;
                // 如果answer以符号.结尾，那么在符号.前加一个空格。
                answer = answer.replace(/\.\s*$/, ' .');
                message.reply(answer);
            }
        } catch (e) {
            console.log(e)
        }
    }

    _setCommandsToBot() {
        const foldersPath = path.join(this._getCurrentFolder(), '../commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                import(filePath).then(data => {
                    const command = data.default;
                    // Set a new item in the Collection with the key as the command name and the value as the exported module
                    if ('data' in command && 'execute' in command) {
                        this._discordClient.commands.set(command.data.name, command);
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }
                });
            }
        }
    }
    _getCurrentFolder() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return __dirname;
    }
}