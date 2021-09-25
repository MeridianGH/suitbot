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
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const clientId = process.env.appId || require('../config.json').appId
const clientSecret = process.env.clientSecret || require('../config.json').clientSecret

module.exports = async (client) => {
  // We declare absolute paths.
  const dataDir = __dirname
  const templateDir = path.join(dataDir, 'templates')

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))

  const port = process.env.PORT || 80
  const domain = process.env.PORT ? 'https://suitbotxyz.herokuapp.com' : 'http://localhost'
  const callbackUrl = `${domain}/callback`

  passport.use(
    new Strategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        scope: ['identify', 'guilds']
      },
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
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )

  app.use('/', express.static(path.join(dataDir, 'assets')))

  const renderTemplate = (req, res, template, data = {}) => {
    // Default base data which passed to the ejs template by default.
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    }
    // We render template using the absolute path of the template and the merged default data with the additional data provided.
    res.render(
      path.join(templateDir, template),
      Object.assign(baseData, data)
    )
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

  // Queue update endpoint.
  app.get('/update', (req, res) => {
    function refreshHandler () {
      res.write('data: refresh\n\n')
      client.player.removeListener('songChanged', refreshHandler)
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    // Heartbeat to keep connection alive
    const updateHeartbeat = () => {
      setTimeout(() => {
        try {
          res.write('data: null\n\n')
        } catch (error) {
          console.log('Error when sending /update heartbeat.')
        } finally {
          updateHeartbeat()
        }
      }, 30000)
    }
    updateHeartbeat()

    client.player.on('songChanged', refreshHandler)
  })

  // Login endpoint.
  app.get('/login', (req, res, next) => {
    // We determine the returning url.
    if (!req.session.backURL) {
      if (req.headers.referer) {
        const parsed = new URL(req.headers.referer)
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path
        }
      } else {
        req.session.backURL = '/'
      }
    }
    // Forward the request to the passport middleware.
    next()
  },
  passport.authenticate('discord')
  )

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
    }
  )

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
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) { return res.redirect('/dashboard') }
    const member = guild.members.cache.get(req.user.id)
    if (!member) { return res.redirect('/dashboard') }
    const queue = client.player.getQueue(guild.id)


    renderTemplate(req, res, 'server.ejs', { guild, queue, alert: null, type: null })
  })

  // Server post endpoint
  app.post('/dashboard/:guildID', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) { return res.redirect('/dashboard') }
    const member = guild.members.cache.get(req.user.id)
    if (!member) { return res.redirect('/dashboard') }
    const queue = client.player.getQueue(guild.id)
    if (!(member.voice.channel === queue.connection.channel)) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: 'You need to be in the same voice channel as the bot to use this!', type: 'danger' }) }

    let alert = null
    const query = req.body.query
    const index = req.body.index
    switch (req.body.action) {
      case 'pause':
        queue.setPaused(queue.connection.paused !== true)
        alert = queue.connection.paused === true ? '⏸ Paused.' : '▶ Resumed.'
        break
      case 'skip':
        queue.skip()
        alert = '⏭ Skipped.'
        await sleep(1)
        break
      case 'shuffle':
        queue.shuffle()
        alert = '🔀 Shuffled the queue.'
        break
      case 'repeat':
        queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
        alert = `Set repeat mode to ${queue.repeatMode === 0 ? 'None ▶' : queue.repeatMode === 1 ? 'Song 🔂' : 'Queue 🔁'}`
        break
      case 'clear':
        queue.clearQueue()
        alert = '🗑️ Cleared the queue.'
        break
      case 'remove':
        alert = `🗑️ Removed track #${index}: "${queue.remove(index).name}".`
        break
      case 'skipto':
        queue.songs = queue.songs.slice(index - 1)
        alert = `⏭ Skipped to #${index}: "${queue.skip().name}".`
        break
      case 'play':
        if (!query) { return }
        if (query.match(/^https?:\/\/(?:open|play)\.spotify\.com\/playlist\/.+$/i) ||
          query.match(/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=.+$/i)) {
          const playlist = await queue.playlist(query)
          if (!playlist) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: 'There was an error when adding that playlist!', type: 'danger' }) }
          playlist.songs.forEach(song => {
            song.requestedBy = member.displayName
          })

          alert = `Added playlist "${playlist.name}" by ${playlist.author.name || playlist.author} to the queue!`

          queue.lastTextChannel.send({
            embeds: [new MessageEmbed()
              .setAuthor('Added to queue.', member.user.displayAvatarURL())
              .setTitle(playlist.name)
              .setURL(playlist.url)
              .setThumbnail(playlist.songs[0].thumbnail)
              .addField('Author', playlist.author.name || playlist.author, true)
              .addField('Amount', `${playlist.songs.length} songs`, true)
              .addField('Position', `${queue.songs.indexOf(playlist.songs[0]).toString()}-${queue.songs.indexOf(playlist.songs[playlist.songs.length - 1]).toString()}`, true)
              .setFooter('SuitBot Web Interface', client.user.displayAvatarURL())
            ]
          })
        } else {
          const song = await queue.play(query)
          if (!song) { return renderTemplate(req, res, 'server.ejs', { guild, queue, alert: 'There was an error when adding that song!', type: 'danger' }) }
          song.requestedBy = member.displayName

          alert = `Added "${song.name}" to the queue!`

          queue.lastTextChannel.send({
            embeds: [new MessageEmbed()
              .setAuthor('Added to queue.', member.user.displayAvatarURL())
              .setTitle(song.name)
              .setURL(song.url)
              .setThumbnail(song.thumbnail)
              .addField('Channel', song.author, true)
              .addField('Duration', song.duration, true)
              .addField('Position', queue.songs.indexOf(song).toString(), true)
              .setFooter('SuitBot Web Interface', client.user.displayAvatarURL())
            ]
          })
        }
        break
    }

    renderTemplate(req, res, 'server.ejs', { guild, queue, alert, type: 'success' })
  })

  app.listen(port, () => {
    console.log(`Dashboard is up and running on port ${port}.`)
    heartbeat()
  })
}

// Copyright Notice: Most of the code in this folder (/dashboard) is heavily based on MrAugu's "simple-discordjs-dashboard" (https://github.com/MrAugu/simple-discordjs-dashboard).