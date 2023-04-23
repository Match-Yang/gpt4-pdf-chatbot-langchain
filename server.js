import express from 'express'
import next from 'next'
import DiscordBot from './discord/server/index.js'

const port = parseInt(process.env.PORT, 10) || 3004
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
  const discordBot = new DiscordBot(port);
})

// sudo lsof -i -P -n | grep LISTEN

// Enable port: https://www.vultr.com/docs/how-to-configure-uncomplicated-firewall-ufw-on-ubuntu-20-04/