// noinspection JSUnusedGlobalSymbols
/* eslint-disable object-curly-newline */

// General
export const activity = {
  author: 'Activity.',
  title: 'Click here to open Activity',
  errors: {
    generic: 'An error occurred while creating your activity!',
    voiceChannel: 'You can only specify a voice channel!',
    missingPerms: 'The bot is missing permissions to perform that action.'
  }
}
export const dashboard = {
  author: 'Dashboard.',
  title: 'SuitBot Dashboard',
  description: 'The bots dashboard website.'
}
export const help = {
  author: 'Help.',
  title: 'SuitBot Help Page',
  description: 'This module lists every command SuitBot currently supports.\n\nTo use a command start by typing `/` followed by the command you want to execute. You can also use Discord\'s integrated auto-completion for commands.\n\n',
  fields: {
    invite: { name: 'Invite', value: 'Click here to invite' },
    website: { name: 'Website', value: null },
    github: { name: 'Source code', value: 'GitHub' },
    discord: { name: 'Discord', value: 'Invite' },
    buttons: { name: null, value: 'Press the buttons below to switch pages and display more info.' }
  },
  other: {
    page: 'Page',
    previous: 'Previous',
    next: 'Next'
  }
}
export const info = {
  author: 'Info.',
  title: 'Bot Information',
  fields: {
    servers: { name: 'Servers', value: null },
    uptime: { name: 'Uptime', value: null },
    memoryUsage: { name: 'Memory Usage', value: null }
  }
}
export const invite = {
  author: 'Invite.',
  title: 'Invite SuitBot',
  description: 'Click this link to invite SuitBot to your server!'
}
export const language = {
  author: 'Language.',
  title: 'Change language',
  description: (langCode) => `Set language to \`${langCode}\`.`,
  errors: {
    userMissingPerms: 'You do not have permission to execute this command!'
  }
}
export const ping = {
  author: 'Ping',
  title: 'Bot & API Latency'
}
export const serverinfo = {
  author: 'Server Information.',
  fields: {
    members: { name: 'Members', value: null },
    channels: { name: 'Channels', value: null },
    boosts: { name: 'Boosts', value: null },
    owner: { name: 'Owner', value: null },
    guildId: { name: 'Guild ID', value: null },
    created: { name: 'Created', value: null }
  }
}
export const userinfo = {
  author: 'User Information.',
  fields: {
    fullName: { name: 'Full name', value: null },
    nickname: { name: 'Nickname', value: null },
    bot: { name: 'Bot', value: null },
    id: { name: 'ID', value: null },
    profile: { name: 'Profile', value: null },
    avatarURL: { name: 'Avatar URL', value: 'Avatar URL' },
    status: { name: 'Status', value: null },
    created: { name: 'Created', value: null },
    joined: { name: 'Joined', value: null }
  },
  other: {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do not disturb',
    offline: 'Offline'
  },
  errors: { invalidUser: 'You can only specify a valid user!' }
}

// Music
const musicErrors = {
  nothingPlaying: 'Nothing currently playing.\nStart playback with `/play`!',
  sameChannel: 'You need to be in the same voice channel as the bot to use this command!',
  noVoiceChannel: 'You need to be in a voice channel to use this command.',
  missingPerms: 'The bot does not have the correct permissions to play in your voice channel!'
}
const repeatModes = {
  repeat: 'Repeat',
  none: 'None',
  track: 'Track',
  queue: 'Queue'
}
export const clear = {
  other: { response: 'Cleared the queue.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const filter = {
  other: { response: (filter) => `Set filter to ${filter}` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const lyrics = {
  author: 'Lyrics.',
  other: {
    repeatModes,
    genius: 'Provided by genius.com',
    noResults: 'No results found!',
    previous: 'Previous',
    next: 'Next'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const nowplaying = {
  author: 'Now Playing...',
  fields: {
    duration: { name: 'Duration', value: null },
    author: { name: 'Author', value: null },
    requestedBy: { name: 'Requested By', value: null }
  },
  other: { repeatModes },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const pause = {
  other: {
    paused: 'Paused.',
    resumed: 'Resumed.'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const play = {
  author: 'Added to queue.',
  fields: {
    amount: { name: 'Amount', value: (amount) => `${amount} songs` },
    duration: { name: 'Duration', value: null },
    author: { name: 'Author', value: null },
    position: { name: 'Position', value: null }
  },
  errors: {
    generic: 'There was an error while adding your song to the queue.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const previous = {
  other: { response: (track) => `Playing previous track ${track}.` },
  errors: {
    generic: 'You can\'t use the command `/previous` right now!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const queue = {
  author: 'Queue.',
  other: {
    dashboard: 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!',
    nowPlaying: 'Now Playing:',
    noUpcomingSongs: 'No upcoming songs.\nAdd songs with `/play`!\n',
    songsInQueue: (amount) => `${amount} songs in queue`,
    totalDuration: (duration) => `${duration} total duration`,
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const remove = {
  other: { response: (track) => `Removed track ${track}.` },
  errors: {
    index: (index) => `You can only specify a song number between 1-${index}.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const repeat = {
  other: {
    response: (mode) => `Set repeat mode to ${mode}.`,
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const resume = {
  other: { response: 'Resumed.' },
  errors: {
    notPaused: 'The queue is not paused!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const search = {
  author: 'Search Results.',
  title: (query) => `Here are the search results for your search\n"${query}":`,
  other: {
    select: 'Select a song...',
    expires: 'This embed expires after one minute.'
  },
  errors: {
    generic: 'There was an error while adding your song to the queue.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const seek = {
  other: { response: (time) => `Skipped to ${time}.` },
  errors: {
    isLive: 'You can\'t seek in a livestream!',
    index: (time) => `You can only seek between 0:00-${time}!`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const shuffle = {
  other: { response: 'Shuffled the queue.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const skip = {
  other: {
    skipped: 'Skipped.',
    skippedTo: (track) => `Skipped to ${track}.`
  },
  errors: {
    index: (index) => `You can only specify a song number between 1-${index}.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const stop = {
  other: { response: 'Stopped.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const volume = {
  other: { response: (volume) => `Set volume to ${volume}%.` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}

// Moderation
const moderationErrors = {
  userMissingPerms: 'You do not have permission to execute this command!',
  invalidUser: 'You can only specify a valid user!'
}
export const ban = {
  author: 'Banned User.',
  description: (reason) => `Reason: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'The bot is missing permissions to ban that user!',
    generic: 'There was an error when banning this user.'
  }
}
export const kick = {
  author: 'Kicked User.',
  description: (reason) => `Reason: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'The bot is missing permissions to kick that user!',
    generic: 'There was an error when kicking this user.'
  }
}
export const move = {
  author: 'Moved User.',
  description: (username, channel) => `Moved \`${username}\` to \`${channel}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'The bot is missing permissions to move that user!'
  }
}
export const moveall = {
  author: 'Moved All Users.',
  description: (channel1, channel2) => `Moved all users from \`${channel1}\` to \`${channel2}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'The bot is missing permissions to move users!'
  }
}
export const purge = {
  other: { response: (amount) => `Deleted ${amount} message(s).` },
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'The bot is missing permissions to delete messages!',
    index: 'You can only delete between 1-100 messages!'
  }
}
export const slowmode = {
  author: 'Set Slowmode.',
  description: (channel, seconds) => `Set the rate limit of #${channel} to ${seconds}s.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'The bot is missing permissions to manage channels!'
  }
}

// Feedback
export const bugreport = {
  other: { response: 'Your bug report was sent successfully!' }
}
export const github = {
  author: 'GitHub.',
  title: 'GitHub Repository',
  description: 'The source code for this bot along with helpful information.'
}
export const suggestion = {
  other: { response: 'Your suggestion was sent successfully!' }
}

// Other
export const serverShutdown = {
  title: 'Server shutdown.',
  description: 'The server the bot is hosted on has been forced to shut down.\nThe bot should be up and running again in a few minutes.'
}
