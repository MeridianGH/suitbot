// noinspection JSCheckFunctionSignatures

import express from 'express'
import minify from 'express-minify'
import ejs from 'ejs'

import passport from 'passport'
import { Strategy } from 'passport-discord'
import session from 'express-session'
import memorystore from 'memorystore'
import { randomBytes } from 'crypto'

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { marked } from 'marked'
import { setupWebsocket } from './websocket.js'
import { adminId, appId, clientSecret } from '../utilities/config.js'

import { fileURLToPath } from 'url'

const app = express()
const MemoryStore = memorystore(session)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function startDashboard(client) {
  const port = process.env.PORT ?? 80
  const domain = process.env.PORT ? 'https://suitbotxyz.herokuapp.com' : 'http://localhost'

  // Set EJS engine
  app.engine('ejs', ejs.renderFile)
  app.set('view engine', 'ejs')

  // Minify and set files
  app.use(minify())
  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.use('/queue', express.static(path.join(__dirname, 'queue')))

  // Passport Discord login
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))
  passport.use(new Strategy({ clientID: appId, clientSecret: clientSecret, callbackURL: `${domain}/callback`, scope: ['identify', 'guilds'] }, (accessToken, refreshToken, profile, done) => { process.nextTick(() => done(null, profile)) }))

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  const render = (req, res, template, data = {}) => {
    const baseData = { djsClient: client, path: req.path, user: req.isAuthenticated() ? req.user : null }
    res.render(path.join(__dirname, 'templates', template), Object.assign(baseData, data))
  }

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    req.session.backURL = req.url
    res.redirect('/login')
  }

  const heartbeat = () => {
    setTimeout(() => {
      fetch(domain).catch(() => console.log('Error when sending heartbeat.')).finally(heartbeat)
    }, 1500000)
  }

  app.use(function forceDomain(req, res, next) {
    // Redirect from Heroku app to domain
    if (req.get('Host') === 'suitbotxyz.herokuapp.com') {
      return res.redirect(301, 'https://suitbot.xyz' + req.originalUrl)
    }
    return next()
  })

  // Login endpoint.
  app.get('/login', (req, res, next) => {
    next()
  }, passport.authenticate('discord'))

  // Callback endpoint.
  app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
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
      req.logout()
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
    if (req.user.id !== adminId) { return res.redirect('/') }
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
    console.log(`Dashboard is up and running on port ${port}.`)
    heartbeat()
  })

  // WebSocket
  const wss = setupWebsocket(client, domain)
  client.dashboard.update = function(player) {
    client.dashboard.emit('update', player)
  }

  client.dashboard.shutdown = () => {
    client.dashboard.close()
    wss.closeAllConnections()
  }
}
