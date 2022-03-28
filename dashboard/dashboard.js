// noinspection JSCheckFunctionSignatures

const express = require('express')
const app = express()
const minify = require('express-minify')
const ejs = require('ejs')

const passport = require('passport')
const { Strategy } = require('passport-discord')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const { randomBytes } = require('crypto')

const path = require('path')
const fetch = require('node-fetch')
const websocket = require('./websocket')

const clientId = process.env.appId ?? require('../config.json').appId
const clientSecret = process.env.clientSecret ?? require('../config.json').clientSecret

module.exports = function startDashboard (client) {
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
  passport.use(new Strategy({ clientID: clientId, clientSecret: clientSecret, callbackURL: `${domain}/callback`, scope: ['identify', 'guilds'] }, (accessToken, refreshToken, profile, done) => { process.nextTick(() => done(null, profile)) }))

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

  app.use(function forceDomain (req, res, next) {
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

  // Admin endpoint.
  app.get('/admin', checkAuth, (req, res) => {
    const adminId = process.env.adminId ? process.env.adminId : require('../config.json').adminId
    if (req.user.id !== adminId) { return res.redirect('/') }
    render(req, res, 'admin.ejs')
  })

  client.dashboard = app.listen(port, null, null, () => {
    console.log(`Dashboard is up and running on port ${port}.`)
    heartbeat()
  })

  // WebSocket
  websocket.setup(client, domain)
  client.dashboard.update = function (queue) {
    client.dashboard.emit('update', queue)
  }
}
