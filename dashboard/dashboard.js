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

const clientId = process.env.token ? process.env.token : require('../config.json').appId
const clientSecret = process.env.token ? process.env.token : require('../config.json').clientSecret

module.exports = async (client) => {
  // We declare absolute paths.
  const dataDir = __dirname
  const templateDir = path.join(dataDir, 'templates')
  console.log(dataDir, templateDir)

  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))

  const port = 80
  const domain = `http://localhost:${port}`
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
    if (req.isAuthenticated()) return next()
    // If not authenticated, we set the url the user is redirected to into the memory.
    req.session.backURL = req.url
    // We redirect user to login endpoint/route.
    res.redirect('/login')
  }

  // Queue update endpoint.
  let sse = null
  app.get('/update', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    sse = res
  })
  client.player.on('songChanged', () => {
    sse.write('data: refresh\n\n')
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
  app.get(
    '/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    /* We authenticate the user, if user canceled we redirect him to index. */ (
      req,
      res
    ) => {
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
  app.get('/logout', function (req, res) {
    // We destroy the session.
    req.session.destroy(() => {
      // We logout the user.
      req.logout()
      // We redirect user to index.
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
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect('/dashboard')
    const member = guild.members.cache.get(req.user.id)
    if (!member) return res.redirect('/dashboard')
    const queue = client.player.getQueue(guild.id)
    // TODO: Check if member is in the same voice channel

    renderTemplate(req, res, 'server.ejs', { guild, queue })
  })

  // Server post endpoint
  app.post('/dashboard/:guildID', checkAuth, async (req, res) => {
    // We validate the request, check if guild exists, member is in guild and if member has minimum permissions, if not, we redirect it back.
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) return res.redirect('/dashboard')
    const member = guild.members.cache.get(req.user.id)
    if (!member) return res.redirect('/dashboard')
    const queue = client.player.getQueue(guild.id)
    // TODO: Check if member is in the same voice channel

    const query = req.body.query
    switch (req.body.action) {
      case 'pause':
        queue.setPaused(queue.connection.paused !== true)
        // queue.lastTextChannel.send(simpleEmbed(queue.connection.paused === true ? '⏸ Paused.' : '▶ Resumed.', false, 'SuitBot Webinterface'))
        break
      case 'skip':
        queue.skip()
        // queue.lastTextChannel.send(simpleEmbed('⏭ Skipped.', false, 'SuitBot Webinterface'))
        await sleep(1)
        break
      case 'shuffle':
        queue.shuffle()
        // queue.lastTextChannel.send(simpleEmbed('🔀 Shuffled the queue.', false, 'SuitBot Webinterface'))
        break
      case 'repeat':
        queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
        // queue.lastTextChannel.send(simpleEmbed(`Set repeat mode to ${mode === 0 ? 'None ▶' : mode === 1 ? 'Song 🔂' : 'Queue 🔁'}`, false, 'SuitBot Webinterface'))
        break
      // TODO: "Remove" endpoint
      case 'play':
        if (!query) { return }
        if (query.match(/^https?:\/\/(?:open|play)\.spotify\.com\/playlist\/.+$/i) ||
          query.match(/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=.+$/i)) {
          const playlist = await queue.playlist(query).catch(error => { console.log(error) })
          if (!playlist) { return }
          playlist.songs.forEach(song => {
            song.requestedBy = member.displayName
          })

          queue.lastTextChannel.send({
            embeds: [new MessageEmbed()
              .setAuthor('Added to queue.', member.user.displayAvatarURL())
              .setTitle(playlist.name)
              .setURL(playlist.url)
              .setThumbnail(playlist.songs[0].thumbnail)
              .addField('Author', typeof playlist.author === 'string' ? playlist.author : playlist.author.name, true)
              .addField('Amount', `${playlist.songs.length} songs`, true)
              .addField('Position', `${queue.songs.indexOf(playlist.songs[0]).toString()}-${queue.songs.indexOf(playlist.songs[playlist.songs.length - 1]).toString()}`, true)
              .setFooter('SuitBot', client.user.displayAvatarURL())
            ]
          })
        } else {
          const song = await queue.play(query).catch(error => { console.log(error) })
          if (!song) { return }
          song.requestedBy = member.displayName

          queue.lastTextChannel.send({
            embeds: [new MessageEmbed()
              .setAuthor('Added to queue.', member.user.displayAvatarURL())
              .setTitle(song.name)
              .setURL(song.url)
              .setThumbnail(song.thumbnail)
              .addField('Channel', song.author, true)
              .addField('Duration', song.duration, true)
              .addField('Position', queue.songs.indexOf(song).toString(), true)
              .setFooter('SuitBot Webinterface', client.user.displayAvatarURL())
            ]
          })
        }
        break
    }

    renderTemplate(req, res, 'server.ejs', { guild, queue })
  })

  app.listen(port, null, null, () =>
    console.log(`Dashboard is up and running on port ${port}.`)
  )
}
