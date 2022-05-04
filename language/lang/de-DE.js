/* eslint-disable object-curly-newline */

// General
export const activity = {
  author: 'Aktivität.',
  title: 'Hier klicken, um die Aktivität zu öffnen',
  errors: {
    generic: 'Es gab einen Fehler beim Erstellen der Aktivität!',
    voiceChannel: 'Du kannst nur einen Sprachkanal angeben!',
    missingPerms: 'Dem Bot fehlen Berechtigungen, um diese Aktion auszuführen!'
  }
}
export const dashboard = {
  author: 'Dashboard.',
  title: 'SuitBot Dashboard',
  description: 'Das Dashboard des Bots.'
}
export const help = {
  author: 'Hilfe.',
  title: 'SuitBot Hilfe-Seite',
  description: 'Dieses Modul listet alle Befehle, die SuitBot unterstützt, auf.\n\nUm einen Befehl zu benutzen, tippe `/` gefolgt von dem Befehl, den du ausführen möchtest. Du kannst auch Discord\'s integrierte Auto-Vervollständigung für Befehle benutzen.\n\n',
  fields: {
    invite: { name: 'Einladen', value: 'Klick hier zum Einladen' },
    website: { name: 'Website', value: null },
    github: { name: 'Quellcode', value: 'GitHub' },
    discord: { name: 'Discord', value: 'Einladung' },
    buttons: { name: null, value: 'Benutze die Buttons unten, um die Seiten zu wechseln und mehr Informationen anzuzeigen.' }
  },
  other: {
    page: 'Seite',
    previous: 'Zurück',
    next: 'Weiter'
  }
}
export const info = {
  author: 'Info.',
  title: 'Bot-Information',
  fields: {
    servers: { name: 'Server', value: null },
    uptime: { name: 'Betriebszeit', value: null },
    memoryUsage: { name: 'Speichernutzung', value: null }
  }
}
export const invite = {
  author: 'Einladen.',
  title: 'Lade SuitBot ein',
  description: 'Klicke den Link, um SuitBot auf deinen Server einzuladen!'
}
export const language = {
  author: 'Sprache.',
  title: 'Sprache ändern',
  description: (langCode) => `Sprache zu \`${langCode}\` geändert.`
}
export const ping = {
  author: 'Ping',
  title: 'Bot & API Latenz'
}
export const serverinfo = {
  author: 'Server-Information.',
  fields: {
    members: { name: 'Mitglieder', value: null },
    channels: { name: 'Kanäle', value: null },
    boosts: { name: 'Boosts', value: null },
    owner: { name: 'Besitzer', value: null },
    guildId: { name: 'Server ID', value: null },
    created: { name: 'Erstellt', value: null }
  }
}
export const userinfo = {
  author: 'Benutzer-Information.',
  fields: {
    fullName: { name: 'Ganzer Name', value: null },
    nickname: { name: 'Spitzname', value: null },
    bot: { name: 'Bot', value: null },
    id: { name: 'ID', value: null },
    profile: { name: 'Profil', value: null },
    avatarURL: { name: 'Profilbild-URL', value: 'Profilbild-URL' },
    status: { name: 'Status', value: null },
    created: { name: 'Erstellt', value: null },
    joined: { name: 'Beigetreten', value: null }
  },
  other: {
    noNickname: 'Kein Spitzname',
    online: 'Online',
    idle: 'Untätig',
    dnd: 'Bitte nicht stören',
    offline: 'Offline'
  },
  errors: { invalidUser: 'Du musst einen gültigen Benutzer angeben!' }
}

// Music
const musicErrors = {
  nothingPlaying: 'Aktuell wird nichts gespielt.\nStarte die Wiedergabe mit /play!',
  sameChannel: 'Du musst im gleichen Sprachkanal wie der Bot sein, um diesen Befehl benutzen zu können!',
  noVoiceChannel: 'Du musst in einem Sprachkanal sein, um diesen Befehl benutzen zu können.',
  missingPerms: 'Dem Bot fehlen Berechtigungen, um in deinem Sprachkanal zu spielen!'
}
const repeatModes = {
  repeat: 'Wiederholung',
  none: 'Keine',
  track: 'Lied',
  queue: 'Alle'
}
export const clear = {
  other: { response: 'Wiedergabeliste gelöscht.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const lyrics = {
  author: 'Songtext.',
  other: {
    repeatModes,
    genius: 'Bereitgestellt von genius.com',
    noResults: 'Keine Ergebnisse gefunden!',
    previous: 'Zurück',
    next: 'Weiter'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const nowplaying = {
  author: 'Spielt gerade...',
  fields: {
    duration: { name: 'Dauer', value: null },
    author: { name: 'Autor', value: null },
    requestedBy: { name: 'Eingereiht von', value: null }
  },
  other: { repeatModes },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const pause = {
  other: {
    paused: 'Pausiert.',
    resumed: 'Fortgesetzt.'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const play = {
  author: 'Zur Wiedergabeliste hinzugefügt.',
  fields: {
    amount: { name: 'Menge', value: (amount) => `${amount} Titel` },
    duration: { name: 'Dauer', value: null },
    author: { name: 'Autor', value: null },
    position: { name: 'Position', value: null }
  },
  errors: {
    generic: 'Es gab einen Fehler beim Hinzufügen des Titels.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const previous = {
  other: { response: (track) => `Spielt vorherigen Titel ${track}.` },
  errors: {
    generic: 'Du kannst den Befehl `previous` gerade nicht benutzen!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const queue = {
  author: 'Wiedergabeliste.',
  other: {
    dashboard: 'Benutzt du immer noch alte und langweilige Befehle? Schau dir das neue [Web Dashboard](https://suitbot.xyz) an!',
    nowPlaying: 'Spielt gerade:',
    noUpcomingSongs: 'Keine kommenden Titel.\nFüge Lieder mit /play hinzu!\n',
    songsInQueue: (amount) => `${amount} Lieder in der Wiedergabeliste`,
    totalDuration: (duration) => `${duration} Gesamtdauer`,
    page: 'Seite',
    previous: 'Zurück',
    next: 'Weiter',
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const remove = {
  other: { response: (track) => `Titel ${track} entfernt.` },
  errors: {
    index: (index) => `Du kannst nur eine Nummer zwischen 1-${index} angeben.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const repeat = {
  other: {
    response: (mode) => `Wiederholungsmodus auf ${mode} gesetzt.`,
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const resume = {
  other: { response: 'Fortgesetzt.' },
  errors: {
    notPaused: 'Die Wiedergabe ist nicht pausiert!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const search = {
  author: 'Suchergebnisse.',
  title: (query) => `Hier sind die Suchergebnisse für deine Suche\n"${query}":`,
  other: {
    select: 'Wähle einen Titel aus...',
    expires: 'Diese Nachricht läuft nach einer Minute ab.'
  },
  errors: {
    generic: 'Es gab einen Fehler beim Hinzufügen des Titels.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const seek = {
  other: { response: (time) => `Zu ${time} vorgespult.` },
  errors: {
    isLive: 'Du kannst in einem Livestream nicht vor-/zurückspulen!',
    index: (time) => `Du kannst nur zwischen 0:00-${time} vor-/zurückspulen!`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const shuffle = {
  other: { response: 'Wiedergabeliste gemischt.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const skip = {
  other: {
    skipped: 'Übersprungen.',
    skippedTo: (track) => `Zu ${track} gesprungen.`
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const stop = {
  other: { response: 'Gestoppt.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const volume = {
  other: { response: (volume) => `Lautstärke auf ${volume}% gesetzt.` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}

// Moderation
const moderationErrors = {
  userMissingPerms: 'Du hast nicht die Berechtigung, diesen Befehl auszuführen!',
  invalidUser: 'Du musst einen gültigen Benutzer angeben!'
}
export const ban = {
  author: 'Nutzer gebannt.',
  description: (reason) => `Grund: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Dem Bot fehlen Berechtigungen, um diesen Nutzer zu bannen!',
    generic: 'Es gab einen Fehler beim Bannen dieses Nutzers.'
  }
}
export const kick = {
  author: 'Nutzer gekickt.',
  description: (reason) => `Grund: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Dem Bot fehlen Berechtigungen, um diesen Nutzer zu kicken!',
    generic: 'Es gab einen Fehler beim Kicken dieses Nutzers.'
  }
}
export const move = {
  author: 'Nutzer verschoben.',
  description: (username, channel) => `\`${username}\` nach \`${channel}\` verschoben.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'Dem Bot fehlen Berechtigungen, um diesen Nutzer zu verschieben!'
  }
}
export const moveall = {
  author: 'Alle Nutzer verschoben.',
  description: (channel1, channel2) => `Alle Nutzer von \`${channel1}\` nach \`${channel2}\` verschoben.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Dem Bot fehlen Berechtigungen, Nutzer zu verschieben!'
  }
}
export const purge = {
  other: { response: (amount) => `${amount} Nachricht(en) gelöscht.` },
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Dem Bot fehlen Berechtigungen, Nachrichten zu löschen!',
    index: 'Du kannst nur zwischen 1-100 Nachrichten löschen!'
  }
}
export const slowmode = {
  author: 'Slow-Modus gesetzt.',
  description: (channel, seconds) => `Intervall von #${channel} auf ${seconds}s gesetzt.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'Dem Bot fehlen Berechtigungen, Kanäle zu verwalten!'
  }
}

// Feedback
export const bugreport = {
  other: { response: 'Deine Fehlermeldung wurde erfolgreich abgeschickt!' }
}
export const github = {
  author: 'GitHub.',
  title: 'GitHub Projektarchiv',
  description: 'Der Quellcode dieses Bots und weitere nützliche Informationen.'
}
export const suggestion = {
  other: { response: 'Deine Anregung wurde erfolgreich abgeschickt!' }
}

// Other
export const serverShutdown = {
  title: 'Server heruntergefahren.',
  description: 'Der Server, auf dem der Bot läuft, musste heruntergefahren werden.\nDer Bot sollte innerhalb weniger Minuten wieder online sein.'
}
