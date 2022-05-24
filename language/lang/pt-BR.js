// noinspection JSUnusedGlobalSymbols
/* eslint-disable object-curly-newline */

// General
export const activity = {
  author: 'Atividade.',
  title: 'Clique aqui para abrir a atividade',
  errors: {
    generic: 'Ocorreu um erro ao criar sua atividade!',
    voiceChannel: 'Você só pode especificar um canal de voz!',
    missingPerms: 'O bot não tem permissões para executar essa ação.'
  }
}
export const dashboard = {
  author: 'Dashboard.',
  title: 'SuitBot Dashboard',
  description: 'Painel da SuitBot.'
}
export const help = {
  author: 'Ajuda.',
  title: 'SuitBot Ajuda',
  description: 'Este módulo lista todos os comandos que a SuitBot suporta atualmente.\n\nPara usar um comando, comece digitando `/` seguido pelo comando que você deseja executar. Você também pode usar o preenchimento automático integrado do Discord para comandos.\n\n',
  fields: {
    invite: { name: 'Convite', value: 'Clique aqui para convidar' },
    website: { name: 'Website', value: null },
    github: { name: 'Source code', value: 'GitHub' },
    discord: { name: 'Discord', value: 'Entrar' },
    buttons: { name: null, value: 'Clique nos botões abaixo para alternar entre as páginas e exibir mais informações.' }
  },
  other: {
    page: 'Página',
    previous: 'Anterior',
    next: 'Próxima'
  }
}
export const info = {
  author: 'Informações.',
  title: 'Informações sobre o Bot',
  fields: {
    servers: { name: 'Servidores', value: null },
    uptime: { name: 'Tempo de atividade', value: null },
    memoryUsage: { name: 'Memória Usada', value: null }
  }
}
export const invite = {
  author: 'Convite.',
  title: 'Convite da SuitBot',
  description: 'Clique nesse link para convidar a SuitBot pro seu servidor!'
}
export const language = {
  author: 'Idioma.',
  title: 'Mudar idioma',
  description: (langCode) => `Definir idioma para \`${langCode}\`.`,
  errors: {
    userMissingPerms: 'Você não tem permissão para executar este comando!'
  }
}
export const ping = {
  author: 'Ping',
  title: 'Bot & Latência da API'
}
export const serverinfo = {
  author: 'Informações do Servidor.',
  fields: {
    members: { name: 'Membros', value: null },
    channels: { name: 'Canais', value: null },
    boosts: { name: 'Boosts', value: null },
    owner: { name: 'Dono', value: null },
    guildId: { name: 'ID do Servidor', value: null },
    created: { name: 'Criado', value: null }
  }
}
export const userinfo = {
  author: 'Informações do Usuário.',
  fields: {
    fullName: { name: 'Nome completo', value: null },
    nickname: { name: 'Apelido', value: null },
    bot: { name: 'Bot', value: null },
    id: { name: 'ID', value: null },
    profile: { name: 'Perfil', value: null },
    avatarURL: { name: 'Avatar URL', value: 'Avatar URL' },
    status: { name: 'Status', value: null },
    created: { name: 'Criado', value: null },
    joined: { name: 'Entrou', value: null }
  },
  other: {
    online: 'Online',
    idle: 'Ausênte',
    dnd: 'Não perturbe',
    offline: 'Offline'
  },
  errors: { invalidUser: 'Você só pode especificar um usuário válido!' }
}

// Music
const musicErrors = {
  nothingPlaying: 'Nada está sendo reproduzido no momento.\nInicie a reprodução de uma música com `/play`!',
  sameChannel: 'Você precisa estar no mesmo canal de voz que o bot para usar este comando!',
  noVoiceChannel: 'Você precisa estar em um canal de voz para usar este comando.',
  missingPerms: 'O bot não tem as permissões corretas para tocar no seu canal de voz!'
}
const repeatModes = {
  repeat: 'Repetir',
  none: 'Nenhuma',
  track: 'Música',
  queue: 'Fila'
}
export const clear = {
  other: { response: 'Limpei a Fila.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const lyrics = {
  author: 'Lyrics.',
  other: {
    repeatModes,
    genius: 'Fornecido por genius.com',
    noResults: 'Sem resultados encontrados!',
    previous: 'Anterior',
    next: 'Próxima'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const nowplaying = {
  author: 'Tocando Agora...',
  fields: {
    duration: { name: 'Duração', value: null },
    author: { name: 'Autor', value: null },
    requestedBy: { name: 'Requisitado por', value: null }
  },
  other: { repeatModes },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const pause = {
  other: {
    paused: 'Pausada.',
    resumed: 'Retomada.'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const play = {
  author: 'Adicionada a Fila.',
  fields: {
    amount: { name: 'Quantidade', value: (amount) => `${amount} música` },
    duration: { name: 'Duração', value: null },
    author: { name: 'Autor', value: null },
    position: { name: 'Posição', value: null }
  },
  errors: {
    generic: 'Ocorreu um erro ao adicionar sua música à fila.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const previous = {
  other: { response: (track) => `Reproduzindo a música anterior ${track}.` },
  errors: {
    generic: 'Você não pode usar o comando `/previous` agora!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const queue = {
  author: 'Fila.',
  other: {
    dashboard: 'Ainda usando comandos antigos e chatos? Use o novo [dashboard](https://suitbot.xyz)!',
    nowPlaying: 'Tocando Agora:',
    noUpcomingSongs: 'Nenhuma música na fila.\nAdicione músicas com `/play`!\n',
    songsInQueue: (amount) => `${amount} músicas na fila`,
    totalDuration: (duration) => `${duration} duração total`,
    page: 'Página',
    previous: 'Anterior',
    next: 'Próxima',
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const remove = {
  other: { response: (track) => `Música removida ${track}.` },
  errors: {
    index: (index) => `Você só pode especificar um número de música entre 1-${index}.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const repeat = {
  other: {
    response: (mode) => `Definido o modo de repetição para ${mode}.`,
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const resume = {
  other: { response: 'Retomada.' },
  errors: {
    notPaused: 'A fila não está pausada!',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const search = {
  author: 'Procurar Resultados.',
  title: (query) => `Aqui estão os resultados da pesquisa para\n"${query}":`,
  other: {
    select: 'Selecione a Música...',
    expires: 'Esta embed expira após um minuto.'
  },
  errors: {
    generic: 'Ocorreu um erro ao pesquisar sua consulta.',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const seek = {
  other: { response: (time) => `Pulando para ${time}.` },
  errors: {
    isLive: 'Você não pode procurar em uma transmissão ao vivo!',
    index: (time) => `Você só pode buscar entre 0:00-${time}!`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const shuffle = {
  other: { response: 'Embaralhou a fila.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const skip = {
  other: {
    skipped: 'Pulando.',
    skippedTo: (track) => `Pulada para ${track}.`
  },
  errors: {
    index: (index) => `Você só pode especificar um número de música entre 1-${index}.`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const stop = {
  other: { response: 'Parando.' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const volume = {
  other: { response: (volume) => `Volume definido em ${volume}%.` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}

// Moderation
const moderationErrors = {
  userMissingPerms: 'Você não tem permissão para executar este comando!',
  invalidUser: 'Você só pode especificar um usuário válido!'
}
export const ban = {
  author: 'Usuário Banido.',
  description: (reason) => `Motivo: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'O bot não tem permissão para banir esse usuário!',
    generic: 'Ocorreu um erro ao banir este usuário.'
  }
}
export const kick = {
  author: 'Usuário Expulso.',
  description: (reason) => `Motivo: \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'O bot não tem permissão para expulsar esse usuário!',
    generic: 'Ocorreu um erro ao expulsar este usuário.'
  }
}
export const move = {
  author: 'Usuário Movido.',
  description: (username, channel) => `Movido \`${username}\` para \`${channel}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'O bot não tem permissões para mover esse usuário!'
  }
}
export const moveall = {
  author: 'Todos os usuários movidos.',
  description: (channel1, channel2) => `Movidos todos os usuários de \`${channel1}\` para \`${channel2}\`.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'O bot não tem permissões para mover usuários!'
  }
}
export const purge = {
  other: { response: (amount) => `Deletei ${amount} mensagens.` },
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'O bot não tem permissão para excluir mensagens!',
    index: 'Você só pode excluir entre 1-100 mensagens!'
  }
}
export const slowmode = {
  author: 'Definir modo lento.',
  description: (channel, seconds) => `Define o limite de mensagens ne #${channel} para ${seconds}s.`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'O bot não tem permissões para gerenciar canais!'
  }
}

// Feedback
export const bugreport = {
  other: { response: 'Seu relatório de bug foi enviado com sucesso!' }
}
export const github = {
  author: 'GitHub.',
  title: 'GitHub Repositório',
  description: 'A source desse bot juntamente com informações úteis.'
}
export const suggestion = {
  other: { response: 'Sua sugestão foi enviada com sucesso!' }
}

// Other
export const serverShutdown = {
  title: 'Desligamento do bot.',
  description: 'O servidor no qual o bot está hospedado foi forçado a desligar.\nO bot deve estar funcionando novamente em alguns minutos.'
}
