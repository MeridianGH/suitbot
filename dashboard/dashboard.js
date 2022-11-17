import express from 'express'
import session from 'express-session'
import minify from 'express-minify'
import ejs from 'ejs'
import memorystore from 'memorystore'
const MemoryStore = memorystore(session)
import { Routes } from 'discord-api-types/v10'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'
import { marked } from 'marked'
import { setupWebsocket } from './websocket.js'
import { adminId, appId, clientSecret } from '../utilities/config.js'
import { logging } from '../utilities/logging.js'

const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function startDashboard(client) {
  const port = 80
  const domain = 'https://suitbot.xyz'
  const host = process.env.NODE_ENV === 'production' ? domain : 'http://localhost'

  // Set EJS engine
  app.engine('ejs', ejs.renderFile)
  app.set('view engine', 'ejs')

  // Minify and set files
  app.use(minify())
  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.use('/queue', express.static(path.join(__dirname, 'queue')))

  // Session storage
  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false
  }))

  const render = (req, res, template, data = {}) => {
    const baseData = { djsClient: client, path: req.path, user: req.session.user ?? null }
    res.render(path.join(__dirname, 'templates', template), Object.assign(baseData, data))
  }

  const checkAuth = (req, res, next) => {
    if (req.session.user) { return next() }
    req.session.backURL = req.url
    res.redirect('/login')
  }

  // Login endpoint.
  app.get('/login', (req, res) => {
    const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${appId}&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${host}/callback`)}`
    if (!req.session.user) { return res.redirect(loginUrl) }
  })

  // Callback endpoint.
  app.get('/callback', async (req, res) => {
    if (!req.query.code) { return res.redirect('/') }

    const body = new URLSearchParams({ 'client_id': appId, 'client_secret': clientSecret, 'code': req.query.code, 'grant_type': 'authorization_code', 'redirect_uri': `${host}/callback` })
    const token = await client.rest.post(Routes.oauth2TokenExchange(), { body: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, auth: false, passThroughBody: true }).catch(() => null)
    console.log(token)
    if (!token?.access_token) { return res.redirect('/login') }

    const user = await client.rest.get(Routes.user(), { headers: { authorization: `${token.token_type} ${token.access_token}` }, auth: false }).catch((e) => { logging.warn('Error while fetching user while authenticating: ' + e) })
    const guilds = await client.rest.get(Routes.userGuilds(), { headers: { authorization: `${token.token_type} ${token.access_token}` }, auth: false }).catch((e) => { logging.warn('Error while fetching guilds while authenticating: ' + e) })
    console.log(user, guilds)
    if (!user || !guilds) { return res.redirect('/login') }

    user.guilds = guilds
    req.session.user = user

    if (req.session.backURL) {
      res.redirect(req.session.backURL)
      req.session.backURL = null
    } else {
      res.redirect('/')
    }
  })

  // Logout endpoint.
  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/')
    })
  })

  // Index endpoint.
  app.get('/', (req, res) => {
    render(req, res, 'index.ejs')
  })

  // Dashboard endpoint.
  app.get('/dashboard', checkAuth, (req, res) => {
    render(req, res, 'dashboard.ejs')
  })

  // Queue endpoint.
  app.get('/dashboard/:guildId', checkAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId)
    if (!guild) { return res.redirect('/dashboard') }
    render(req, res, 'queue.ejs', { guild: guild })
  })

  // Commands endpoint.
  app.get('/commands', (req, res) => {
    const readme = fs.readFileSync('./README.md').toString()
    const markdown = marked.parse(readme.substring(readme.indexOf('### General'), readme.indexOf('## Installation')))
    render(req, res, 'commands.ejs', { markdown: markdown })
  })

  // Admin endpoint.
  app.get('/admin', checkAuth, (req, res) => {
    if (req.session.user.id !== adminId) { return res.redirect('/') }
    render(req, res, 'admin.ejs')
  })

  // Terms of Service endpoint.
  app.get('/terms', (req, res) => {
    render(req, res, 'legal/terms.ejs')
  })

  // Privacy Policy endpoint.
  app.get('/privacy', (req, res) => {
    render(req, res, 'legal/privacy.ejs')
  })

  // 404
  app.get('*', (req, res) => {
    render(req, res, '404.ejs')
  })

  client.dashboard = app.listen(port, null, null, () => {
    logging.success(`Dashboard is up and running on port ${port}.`)
  })
  client.dashboard.host = host

  // WebSocket
  const wss = setupWebsocket(client, host)
  client.dashboard.update = function(player) {
    client.dashboard.emit('update', player)
  }

  client.dashboard.shutdown = () => {
    client.dashboard.close()
    wss.closeAllConnections()
  }
}
