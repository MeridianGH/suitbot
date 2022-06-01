// noinspection JSUnusedGlobalSymbols

// General
export const activity = {
  author: 'Aktiviteetti.',
  title: 'Klikkaa tästä avataksesi aktiviteetin',
  errors: {
    generic: 'Virhe tapahtui luodessa aktiviteettiasi!',
    voiceChannel: 'Voit valita ainoastaan puhe-kanavan!',
    missingPerms: 'Botilla ei ole tarpeeksi oikeuksia suorittaa tuota.'
  }
}
export const dashboard = {
  author: 'Paneeli.',
  title: 'SuitBot paneeli',
  description: 'Boatin paneeli nettisivu.'
}
export const help = {
  author: 'Apua.',
  title: 'SuitBot Apu Sivu',
  description: 'Tämä moduuli listaa kaikki SuitBotin komennot.\n\nKäyttääksesi komentoa, aloita kirjoitamalla `/` sitten kirjoita haluamasi komento perään. Voit myös käyttää Discordin automaattista Slash Command sivua.\n\n',
  fields: {
    invite: { name: 'Kutsu', value: 'Klikkaa tästä kutsuaksesi' },
    website: { name: 'Nettisivu', value: null },
    github: { name: 'Lähdekoodi', value: 'GitHub' },
    discord: { name: 'Discord', value: 'Kutsu' },
    buttons: { name: null, value: 'Klikkaa nappeja alhaalla vaihtaaksesi sivua haluamaasi.' }
  },
  other: {
    page: 'Sivu',
    previous: 'Edellinen',
    next: 'Seuraava'
  }
}
export const info = {
  author: 'Info.',
  title: 'Botista Tietoa',
  fields: {
    servers: { name: 'Palvelimet', value: null },
    uptime: { name: 'Käynnissäoloaika', value: null },
    memoryUsage: { name: 'Muistin Käyttö', value: null }
  }
}
export const invite = {
  author: 'Kutsu.',
  title: 'Kutsu SuitBot',
  description: 'Klikkaa tästä linkistä kutsuaksesi SuitBotin palvelimellesi!'
}
export const language = {
  author: 'Kieli.',
  title: 'Vaihda kieltä',
  description: (langCode) => `Kieli asetettiin \`${langCode}\`.`,
  errors: { userMissingPerms: 'Sinulla ei ole oikeutta suorittaa tätä komentoa!' }
}
export const ping = {
  author: 'Viive.',
  title: 'Botin & APIn Viive'
}
export const serverinfo = {
  author: 'Palvelimen Tiedot.',
  fields: {
    members: { name: 'Jäsenet', value: null },
    channels: { name: 'Kanavat', value: null },
    boosts: { name: 'Nostatukset', value: null },
    owner: { name: 'Omistaja', value: null },
    guildId: { name: 'Palvelimen ID', value: null },
    created: { name: 'Luotu', value: null }
  }
}
export const userinfo = {
  author: 'Käyttäjän Tiedot.',
  fields: {
    fullName: { name: 'Koko Nimi', value: null },
    nickname: { name: 'Lempinimi', value: null },
    bot: { name: 'Botti', value: null },
    id: { name: 'ID', value: null },
    profile: { name: 'Profiili', value: null },
    avatarURL: { name: 'Avatarin Osoite', value: 'Avatar URL' },
    status: { name: 'Tila', value: null },
    created: { name: 'Luotu', value: null },
    joined: { name: 'Liittynyt', value: null }
  },
  other: {
    online: 'Paikalla',
    idle: 'Muualla',
    dnd: 'Älä häiritse',
    offline: 'Poissa'
  },
  errors: { invalidUser: 'Voit valita vain oikean käyttäjän!' }
}

// Music
const musicErrors = {
  nothingPlaying: 'Mikään ei soi tällä hetkellä.\nKäynnistä musiikki komennolla `/play`!',
  sameChannel: 'Sinun pitää olla samassa ääni kanavassa kuin bottikin!',
  noVoiceChannel: 'Sinun pitää olla ääni kanavalla käyttääksesi komentoa.',
  missingPerms: 'Botilla ei ole tarpeeksi oikeuksia soittaakseen musiikkia kanavallasi!'
}
const repeatModes = {
  repeat: 'Toist',
  none: 'Ei Mitään',
  track: 'Soitto',
  queue: 'Jono'
}
export const clear = {
  other: { response: 'Tyhjennettiin jono.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const filter = {
  other: { response: (filter) => `Asetettiin filtteri ${filter}.` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const lyrics = {
  author: 'Sanat.',
  other: {
    repeatModes,
    genius: 'Tarjoaa genius.com',
    noResults: 'Sanoja ei löytynyt!',
    previous: 'Edellinen',
    next: 'Seuraava'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const nowplaying = {
  author: 'Nyt Soitetaan...',
  fields: {
    duration: { name: 'Kesto', value: null },
    author: { name: 'Tekijä', value: null },
    requestedBy: { name: 'Pyytäjä', value: null }
  },
  other: { repeatModes },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const pause = {
  other: {
    paused: 'Pausettu.',
    resumed: 'Jatketaan.'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const play = {
  author: 'Lisätty jonoon.',
  fields: {
    amount: { name: 'Määrä', value: (amount) => `${amount} musiikkia` },
    duration: { name: 'Kesto', value: null },
    author: { name: 'Tekijä', value: null },
    position: { name: 'Paikka', value: null }
  },
  errors: {
    generic: 'Virhe tapahtui lisätessä musiikkiasi jonoon.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const previous = {
  other: { response: (track) => `Soitetaan edellinen musiikki ${track}.` },
  errors: {
    generic: 'Et voi käyttää komentoa `/previous` juuri nyt!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const queue = {
  author: 'Jono.',
  other: {
    dashboard: 'Vielä käytät vabnhoja komentoja? Kokeile uutta [paneelia](https://suitbot.xyz) sen sijaan!',
    nowPlaying: 'Nyt Soitetaan:',
    noUpcomingSongs: 'Ei uusia musiikkeja tulossa.\nLisää musiikkeja `/play` komennolla!\n',
    songsInQueue: (amount) => `${amount} musiikkia jonossa`,
    totalDuration: (duration) => `${duration} jonon koko kesto`,
    page: 'Sivu',
    previous: 'Edellinen',
    next: 'Seuraava',
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const remove = {
  other: { response: (track) => `Poistettiin musiikki ${track}.` },
  errors: {
    index: (index) => `Voit valita musiikin 1-${index} väliltä.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const repeat = {
  other: {
    response: (mode) => `Asetettiin toisto moodi ${mode}.`,
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const resume = {
  other: { response: 'Jatketaan.' },
  errors: {
    notPaused: 'Jono ei ole pysäytetty!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const search = {
  author: 'Haun Tulokset.',
  title: (query) => `Tässä on tulokset haullesi:\n"${query}":`,
  other: {
    select: 'Valitse musiikki...',
    expires: 'Tämä valikko vanhenee 1-minuutin kuluttua.'
  },
  errors: {
    generic: 'Virhe tapahtui lisätessä musiikkiasi jonoon.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const seek = {
  other: { response: (time) => `Skipattiin ${time}.` },
  errors: {
    isLive: 'Et voi skipata live-striimissä!',
    index: (time) => `Voi skipata vain 0:00-${time} väliltä!`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const shuffle = {
  other: { response: 'Sekoitetaan jono.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const skip = {
  other: {
    skipped: 'Skipattu.',
    skippedTo: (track) => `Skipattiin ${track}.`
  },
  errors: {
    index: (index) => `Voit valita musiikin 1-${index} väliltä.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const stop = {
  other: { response: 'Pysäytetty.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const volume = {
  other: { response: (volume) => `Asetettiin voluumi ${volume}%.` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}

// Moderation
const moderationErrors = {
  userMissingPerms: 'Sinulla ei ole oikeutta suorittaa tätä komentoa!',
  invalidUser: 'Voi valita vain oikean käyttäjän!'
}
export const ban = {
  author: 'Annettiin porttikielto käyttäjälle.',
  description: (reason) => `Syy: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Botilla ei ole oikeuksia antaa porttikieltoa kyseiselle käyttäjälle!',
    generic: 'Virhe tapahtui antaessa porttikieltoa käyttäjälle.'
  }
}
export const kick = {
  author: 'Potkittiin käyttäjä.',
  description: (reason) => `Syy: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Botilla ei ole oikeuksia antaa potkuja kyseiselle käyttäjälle!',
    generic: 'Virhe tapahtui antaessa potkuja käyttäjälle.'
  }
}
export const move = {
  author: 'Siirrettiin Käyttäjä.',
  description: (username, channel) => `Siirrettiin \`${username}\` kanavalle \`${channel}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Botilla ei ole oikeuksia siirtää kyseistä käyttäjää!'
  }
}
export const moveall = {
  author: 'Siirrettiin kaikki käyttäjät.',
  description: (channel1, channel2) => `Siirrettiin kaikki käyttäjät \`${channel1}\` kanavalle \`${channel2}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Botilla ei ole oikeuksia siirtää käyttäjiä!'
  }
}
export const purge = {
  other: { response: (amount) => `Poistettiin ${amount} viesti(ä).` },
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Botilla ei ole oikeuksia poistaa viestejä!',
    index: 'Voit poistaa vain 1-100 viestiä!'
  }
}
export const slowmode = {
  author: 'Aseta hitaustila.',
  description: (channel, seconds) => `Asetettiin kanavan #${channel} ratelimitti ${seconds}sekunttiin.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Botilla ei ole oikeuksia hallita kanavia!'
  }
}

// Feedback
export const bugreport = { other: { response: 'Bug-reporttisi on lähetetty!' } }
export const github = {
  author: 'GitHub.',
  title: 'GitHub Repositorio',
  description: 'Botin lähde koodi tiedon kanssa.'
}
export const suggestion = { other: { response: 'Sinun ehdotuksesi on lähetetty!' } }

// Other
export const serverShutdown = {
  title: 'Palvelimen sammutus.',
  description: 'Palvelin jolla botti hostataan on sammunut.\nBotin pitäisi olla pian käynnissä taas.'
}
