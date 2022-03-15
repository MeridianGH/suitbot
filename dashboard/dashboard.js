// noinspection JSCheckFunctionSignatures

const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require('path')
const passport = require('passport')
const { Strategy } = require('passport-discord')
const { Permissions, MessageEmbed } = require('discord.js')
const { sleep } = require('../utilities')
const MemoryStore = require('memorystore')(session)
const fetch = require('node-fetch')

const clientId = process.env.appId ?? require('../config.json').appId
const clientSecret = process.env.clientSecret ?? require('../config.json').clientSecret

module.exports = async (client) => {
  const dataDir = __dirname
  const templateDir = path.join(dataDir, 'templates')

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))

  const port = process.env.PORT ?? 80
  const domain = process.env.PORT ? 'https://suitbotxyz.herokuapp.com' : 'http://localhost'
  const callbackUrl = `${domain}/callback`

  passport.use(
    new Strategy(
      { clientID: clientId, clientSecret: clientSecret, callbackURL: callbackUrl, scope: ['identify', 'guilds'] },
      (accessToken, refreshToken, profile, done) => {
        // On login we pass in profile with no logic.
        process.nextTick(() => done(null, profile))
      }
    )
  )

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: '#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n',
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.engine('ejs', ejs.renderFile)
  app.set('view engine', 'ejs')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/', express.static(path.join(dataDir, 'assets')))

  const renderTemplate = (req, res, template, data = {}) => {
    // Default base data which passed to the ejs template by default.
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    }
    res.render(path.join(templateDir, template), Object.assign(baseData, data))
  }

  const checkAuth = (req, res, next) => {
    // If authenticated we forward the request further in the route.
    if (req.isAuthenticated()) { return next() }
    // If not authenticated, we set the url the user is redirected to into the memory.
    req.session.backURL = req.url
    // We redirect user to login endpoint/route.
    res.redirect('/login')
  }

  const heartbeat = () => {
    setTimeout(() => {
      fetch(domain).catch(() => console.log('Error when sending heartbeat.')).finally(() => heartbeat())
    }, 1500000)
  }

  app.use(function forceDomain (req, res, next) {
    // Redirect from Heroku app to domain
    if (req.get('Host') === 'suitbotxyz.herokuapp.com') {
      return res.redirect(301, 'https://suitbot.xyz' + req.originalUrl)
    }
    return next()
  })

  // Queue update endpoint.
  const updates = {}
  app.get('/update/:guildID', (req, res) => {
    // noinspection JSUnresolvedVariable
    const guildId = req.params.guildID
    const user = req.user
    if (!user) { return }
    if (updates[guildId]) {
      const subIndex = updates[guildId].findIndex(sub => sub.userId === user.id)
      if (subIndex !== -1) {
        updates[guildId][subIndex].res = res
      } else {
        updates[guildId].push({ userId: user.id, res: res })
      }
    } else {
      updates[guildId] = [{ userId: user.id, res: res }]
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    res.write('data: subscribed\n\n')
    res.on('close', () => { res.end() })
  })
  function update (queue) {
    if (queue.guild.id in updates) {
      for (const sub of updates[queue.guild.id]) {
        sub.res.write('data: refresh\n\n')
      }
      delete updates[queue.guild.id]
    }
  }
  client.player.on('trackStart', update)
  client.player.on('queueEnd', update)
  // Heartbeat to keep connection alive
  const updateHeartbeat = () => {
    setTimeout(() => {
      for (const guildId in updates) {
        for (const sub of updates[guildId]) {
          sub.res.write('data: null\n\n')
        }
      }
      updateHeartbeat()
    }, 30000)
  }
  updateHeartbeat()

  // Login endpoint.
  app.get('/login', (req, res, next) => {
    // We determine the returning url.
    if (!req.session.backURL) {
      if (req.headers.referer) {
        const parsed = new URL(req.headers.referer)
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.pathname
        }
      } else {
        req.session.backURL = '/'
      }
    }
    // Forward the request to the passport middleware.
    next()
  }, passport.authenticate('discord'))

  // Callback endpoint.
  app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
    // If user had set a returning url, we redirect him there, otherwise we redirect him to index.
    if (req.session.backURL) {
      const backURL = req.session.backURL
      req.session.backURL = null
      res.redirect(backURL)
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
    renderTemplate(req, res, 'index.ejs')
  })

  // Dashboard endpoint.
  app.get('/dashboard', checkAuth, (req, res) => {
    renderTemplate(req, res, 'dashboard.ejs', { perms: Permissions })
  })

  // Server endpoint.
  app.get('/dashboard/:guildID', checkAuth, async (req, res) => {
    // noinspection JSUnresolvedVariable
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) { return res.redirect('/dashboard') }
    const member = guild.members.cache.get(req.user.id)
    if (!member) { return res.redirect('/dashboard') }
    const queue = client.player.getQueue(guild.id)

    renderTemplate(req, res, 'server.ejs', { guild, queue, alert: null, type: null })
  })

  // Server post endpoint
  app.post('/dashboard/:guildID', checkAuth, async (req, res) => {
    // noinspection JSUnresolvedVariable
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) { return res.redirect('/dashboard') }
    const member = guild.members.cache.get(req.user.id)
    if (!member) { return res.redirect('/dashboard') }
    const queue = client.player.getQueue(guild.id)
    if (!queue) { return res.redirect('/dashboard') }
    if (req.body.action === 'reload') { return res.redirect('back') }
    if (!(member.voice.channel === queue.connection.channel)) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: 'You need to be in the same voice channel as the bot to use this!', type: 'danger' }) }

    let alert = null
    const query = req.body.query
    const index = req.body.index
    switch (req.body.action) {
      case 'previous': {
        if (queue.streamTime > 5000) {
          await queue.seek(0)
          return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: null, type: null })
        }
        await queue.back()
        alert = `Playing previous track \`#0\`: **${queue.current.title}**.`
        break }
      case 'pause': {
        queue.setPaused(!queue.connection.paused)
        alert = queue.connection.paused ? 'Paused.' : 'Resumed.'
        break }
      case 'skip': {
        queue.skip()
        alert = 'Skipped.'
        await sleep(1)
        break }
      case 'shuffle': {
        queue.shuffle()
        alert = 'Shuffled the queue.'
        break }
      case 'repeat': {
        queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
        alert = `Set repeat mode to "${queue.repeatMode === 0 ? 'None' : queue.repeatMode === 1 ? 'Track' : 'Queue'}"`
        break }
      case 'clear': {
        queue.clear()
        alert = 'Cleared the queue.'
        break }
      case 'remove': {
        alert = `Removed track #${index}: "${queue.remove(index).title}".`
        break }
      case 'volume': {
        queue.setVolume(req.body.volume)
        alert = `Set volume to ${req.body.volume}%.`
        await sleep(1)
        break }
      case 'skipto': {
        const skipTo = queue.tracks[queue.getTrackPosition(index - 1)]
        queue.skipTo(index - 1)
        alert = `Skipped to #${index}: "${skipTo.title}".`
        await sleep(1)
        break }
      case 'play': {
        if (!query) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: null, type: null }) }
        const searchResult = await client.player.search(query, { requestedBy: member.user, searchEngine: 'playdl' })
        if (!searchResult || !searchResult.tracks.length) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: 'There was an error while adding your song to the queue.', type: 'danger' }) }

        if (searchResult.playlist) {
          const playlist = searchResult.playlist
          queue.addTracks(playlist.tracks)
          if (!queue.playing) { await queue.play() }
          alert = `Added "${playlist.title}" to the queue!`

          queue.metadata.channel.send({
            embeds: [new MessageEmbed()
              .setAuthor({ name: 'Added to queue.', iconURL: member.user.displayAvatarURL() })
              .setTitle(playlist.title)
              .setURL(playlist.url)
              .setThumbnail(playlist.thumbnail)
              .addField('Amount', `${playlist.tracks.length} songs`, true)
              .addField('Author', playlist.author.name ?? playlist.author, true)
              .addField('Position', `${(queue.getTrackPosition(playlist.tracks[0]) + 1).toString()}-${(queue.getTrackPosition(playlist.tracks[playlist.tracks.length - 1]) + 1).toString()}`, true)
              .setFooter({ text: 'SuitBot Web Interface', iconURL: client.user.displayAvatarURL() })
            ]
          })
        } else {
          const track = searchResult.tracks[0]
          queue.addTrack(track)
          if (!queue.playing) { await queue.play() }
          alert = `Added "${track.title}" to the queue!`

          queue.metadata.channel.send({
            embeds: [new MessageEmbed()
              .setAuthor({ name: 'Added to queue.', iconURL: member.user.displayAvatarURL() })
              .setTitle(track.title)
              .setURL(track.url)
              .setThumbnail(track.thumbnail)
              .addField('Duration', track.durationMS === 0 ? '🔴 Live' : track.duration, true)
              .addField('Channel', track.author, true)
              .addField('Position', (queue.getTrackPosition(track) + 1).toString(), true)
              .setFooter({ text: 'SuitBot Web Interface', iconURL: client.user.displayAvatarURL() })
            ]
          })
        }
        break }
    }

    renderTemplate(req, res, 'server.ejs', { guild, queue, alert: alert, type: 'success' })
  })

  // Admin endpoint.
  app.get('/admin', checkAuth, async (req, res) => {
    const adminId = process.env.adminId ? process.env.adminId : require('../config.json').adminId
    if (req.user.id !== adminId) { return res.redirect('/') }

    renderTemplate(req, res, 'admin.ejs')
  })

  client.dashboard = app.listen(port, null, null, () => {
    console.log(`Dashboard is up and running on port ${port}.`)
    heartbeat()
  })
}

// Copyright Notice: Most of the code in this folder (/dashboard) is heavily based on MrAugu's "simple-discordjs-dashboard" (https://github.com/MrAugu/simple-discordjs-dashboard).
