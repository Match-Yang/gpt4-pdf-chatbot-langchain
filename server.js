import express from 'express'
import next from 'next'
import { Client, IntentsBitField } from 'discord.js'

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

  discordClient.on('ready', () => {
    console.log('Discord bot is ready');
  })
  discordClient.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    console.log('message: ',message)

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