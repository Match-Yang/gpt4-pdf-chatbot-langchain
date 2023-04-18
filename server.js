import express from 'express'
import next from 'next'
import { Client, Collection, Events, IntentsBitField } from 'discord.js'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT, 10) || 3002
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })

  const discordClient = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ]
  });

  discordClient.commands = new Collection();
  const foldersPath = path.join(__dirname, 'discord/commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      // const command = (await import(filePath)).default;
      import(filePath).then(data => {
        const command = data.default;
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
          discordClient.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      });
    }
  }
  discordClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      // await command.execute(interaction);
      await interaction.reply({ content: 'Command executed successfully!', ephemeral: false })
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  });


  discordClient.on(Events.ClientReady, () => {
    console.log('Discord bot is ready');
  })
  discordClient.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    console.log('message: ', message)

    await message.channel.sendTyping();

    // Fetch history message
    let history = [];
    let prevMessages = await message.channel.messages.fetch({ limit: 20 });
    prevMessages.reverse();

    prevMessages.forEach(msg => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id != discordClient.user.id && message.author.bot) return;
      // 只需要当前发消息这个用户相关的历史
      if (msg.author.id != message.author.id) return;

      history.push(msg.content);
    });

    try {
      const response = await fetch(`http://localhost:${port}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message.content,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        console.log("Fetch data from /api/chat error: ", data.error);
      } else {
        message.reply(data.text)
      }
    } catch (e) {
      console.log(e)
    }


  })

  discordClient.login(process.env.DISCORD_BOT_TOKEN)
})

// sudo lsof -i -P -n | grep LISTEN