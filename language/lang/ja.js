// noinspection JSUnusedGlobalSymbols

// General
export const activity = {
  author: 'アクティビティー',
  title: 'ここからアクティビティーを開始できます。',
  errors: {
    generic: 'アクティビティー開始中にエラーが発生しました！',
    voiceChannel: 'ボイスチャンネルを指定してください！',
    missingPerms: 'ボットの権限が足りません！'
  }
}
export const dashboard = {
  author: 'ダッシュボード',
  title: 'SuitBotダッシュボード',
  description: 'ボットのダッシュボードウエブサイト'
}
export const help = {
  author: 'ヘルプ',
  title: 'SuitBotヘルプページ',
  description: 'こちらからSuitBotのコマンド一覧が見れます。\n\nコマンドを利用するには `/` を入力して、出てきたコマンドを使ってください。\n\n',
  fields: {
    invite: { name: '招待', value: 'こちらからSuitBotを招待できます。' },
    website: { name: 'サイト', value: null },
    github: { name: 'ソースコード', value: 'GitHub' },
    discord: { name: 'Discord', value: 'サポートサーバー' },
    buttons: { name: null, value: '下のボタンでページ変更ができます。' }
  },
  other: {
    page: 'ページ',
    previous: '前',
    next: '次'
  }
}
export const info = {
  author: '詳細情報',
  title: 'ボットの詳細情報',
  fields: {
    servers: { name: '参加サーバー数', value: null },
    uptime: { name: 'アップタイム', value: null },
    memoryUsage: { name: 'メモリー使用率', value: null }
  }
}
export const invite = {
  author: '招待',
  title: 'SuitBotを招待する',
  description: 'こちらからSuitBotをサーバーに招待できます！'
}
export const language = {
  author: '言語',
  title: 'ボット言語変更',
  description: (langCode) => `ボット言語を \`${langCode}\` に設定しました。`,
  errors: { userMissingPerms: 'このコマンドを利用する権限がありません！' }
}
export const ping = {
  author: 'Ping',
  title: 'ボットとAPIの応答速度'
}
export const serverinfo = {
  author: 'サーバー情報',
  fields: {
    members: { name: 'メンバー数', value: null },
    channels: { name: 'チャンネル数', value: null },
    boosts: { name: 'サーバーブースト数', value: null },
    owner: { name: 'オーナー', value: null },
    guildId: { name: 'サーバーID', value: null },
    created: { name: '作成時', value: null }
  }
}
export const userinfo = {
  author: 'ユーザー情報',
  fields: {
    fullName: { name: 'ユーザー名', value: null },
    nickname: { name: 'ニックネーム', value: null },
    bot: { name: 'Bot', value: null },
    id: { name: 'ユーザーID', value: null },
    profile: { name: 'メンション', value: null },
    avatarURL: { name: 'アバター画像URL', value: 'Avatar URL' },
    created: { name: 'アカウント作成時', value: null },
    joined: { name: 'サーバー参加時', value: null }
  },
  other: {
    online: 'オンライン',
    idle: '退席',
    dnd: '取り込み中',
    offline: 'オフライン'
  },
  errors: { invalidUser: '無効なユーザーが指定されました！' }
}

// Music
const musicErrors = {
  nothingPlaying: '現在何も再生されていません。\n`/play` で再生を開始しよう！',
  sameChannel: 'ボットと同じVCに参加してください！',
  noVoiceChannel: 'VCに参加してください！',
  missingPerms: 'ボットに発言権限がありません！'
}
const repeatModes = {
  repeat: 'ループ',
  none: 'なし',
  track: '一曲ループ',
  queue: '再生待ちを全てループ'
}
export const clear = {
  other: { response: '再生待ちを削除しました。' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const filter = {
  other: { response: (filter) => `オーディオフィルタを${filter}に設定しました。` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const lyrics = {
  author: '歌詞',
  other: {
    repeatModes,
    genius: 'genius.comより提供',
    noResults: '歌詞が見つかりません！',
    previous: '前',
    next: '次'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const nowplaying = {
  author: '現在再生中',
  fields: {
    duration: { name: '継続時間', value: null },
    author: { name: '作成者', value: null },
    requestedBy: { name: 'リクエストしたユーザー', value: null }
  },
  other: { repeatModes },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const pause = {
  other: {
    paused: '再生を一時停止しました。',
    resumed: '再生を再開しました。'
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const play = {
  author: '再生待ちに追加しました。',
  fields: {
    amount: { name: '曲数', value: (amount) => `${amount}曲` },
    duration: { name: '継続時間', value: null },
    author: { name: '作成者', value: null },
    position: { name: '再生待ちの順番', value: null }
  },
  errors: {
    generic: '再生待ち追加時にエラーが発生しました。',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const previous = {
  other: { response: (track) => `前の曲${track}に飛びました。` },
  errors: {
    generic: '現在 `/previous` は利用できません！',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const queue = {
  author: '再生待ちリスト',
  other: {
    dashboard: (url) => `まだコマンドなんか使ってるの？便利な[Webダッシュボード](${url})を使ってみよう！`,
    nowPlaying: '現在再生中',
    noUpcomingSongs: '再生待ちの曲がありません。\n`/play` で曲を追加しよう！\n',
    songsInQueue: (amount) => `${amount}曲が再生待ち`,
    totalDuration: (duration) => `総継続時間 ${duration}`,
    page: 'ページ',
    previous: '前',
    next: '次',
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const remove = {
  other: { response: (track) => `${track}を削除しました。` },
  errors: {
    index: (index) => `1-${index}の間の数字を指定してください。`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const repeat = {
  other: {
    response: (mode) => `ループモードを${mode}に設定しました。`,
    repeatModes
  },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const resume = {
  other: { response: '再生を再開しました。' },
  errors: {
    notPaused: '再生が一時停止されていません！',
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const search = {
  author: '検索結果',
  title: (query) => `「${query}」の検索結果です。`,
  other: {
    select: '曲を選択してください。',
    expires: '一分以内に選択してください。'
  },
  errors: {
    generic: '再生待ち追加時にエラーが発生しました。',
    noVoiceChannel: musicErrors.noVoiceChannel,
    sameChannel: musicErrors.sameChannel,
    missingPerms: musicErrors.missingPerms
  }
}
export const seek = {
  other: { response: (time) => `${time}に動きました。` },
  errors: {
    isLive: 'ライブ配信は巻き戻し・早送りできません！',
    index: (time) => `0:00-${time} の間の時間を指定してください。`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const shuffle = {
  other: { response: '再生待ちをシャッフルしました。' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const skip = {
  other: {
    skipped: '曲を飛ばしました。',
    skippedTo: (track) => `${track} に飛びました。`
  },
  errors: {
    index: (index) => `1-${index} の間の数字を指定してください。`,
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const stop = {
  other: { response: '再生を停止しました。' },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}
export const volume = {
  other: { response: (volume) => `音量を${volume}%に設定しました。` },
  errors: {
    nothingPlaying: musicErrors.nothingPlaying,
    sameChannel: musicErrors.sameChannel
  }
}

// Moderation
const moderationErrors = {
  userMissingPerms: 'このコマンドを利用する権限がありません！',
  invalidUser: '無効なユーザーが指定されました！'
}
export const ban = {
  author: 'ユーザーをBAN',
  description: (reason) => `理由： \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'ボットにユーザーをBANする権限がありません！',
    generic: 'BAN処理時にエラーが発生しました！'
  }
}
export const kick = {
  author: 'ユーザーを追放',
  description: (reason) => `理由： \`\`\`${reason}\`\`\``,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'ボットにユーザーを追放する権限がありません！',
    generic: '追放処理時にエラーが発生されました！'
  }
}
export const move = {
  author: 'ユーザー移動',
  description: (username, channel) => `\`${username}\` を \`${channel}\` に移動しました。`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    invalidUser: moderationErrors.invalidUser,
    missingPerms: 'ボットにユーザーを移動する権限がありません！'
  }
}
export const moveall = {
  author: '全ユーザー移動',
  description: (channel1, channel2) => `全ユーザーを \`${channel1}\` から \`${channel2}\` に移動しました。`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'ボットにユーザーを移動する権限がありません！'
  }
}
export const purge = {
  other: { response: (amount) => `メッセージ${amount}個削除しました。` },
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'ボットにメッセージを削除する権限がありません！',
    index: '1-100の間のメッセージ数を指定してください！'
  }
}
export const slowmode = {
  author: '低速モード',
  description: (channel, seconds) => `#${channel}の低速モードを${seconds}秒に設定しました。`,
  errors: {
    userMissingPerms: moderationErrors.userMissingPerms,
    missingPerms: 'ボットにチャンネルを管理する権限がありません！'
  }
}

// Feedback
export const bugreport = { other: { response: '障害報告が送信されました！' } }
export const github = {
  author: 'ソースコード',
  title: 'GitHubレポジトリー',
  description: 'こちらからSuitBotのソースコードと詳細情報が見れます。'
}
export const suggestion = { other: { response: '機能リクエストが送信されました！' } }

// Other
export const serverShutdown = {
  title: 'サーバー停止',
  description: 'ボットのサーバーが何らかの理由で強制停止されました。\n再稼働まで数分お待ちください。'
}
