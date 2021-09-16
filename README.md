![logo](https://repository-images.githubusercontent.com/406747355/0c0fcbbd-8dab-4259-a5d6-d8cc5069ef37)

# SuitBot

> A lightweight music and general purpose bot, that uses slash commands and buttons to be as user-friendly as possible!

It uses [discord.js](https://discord.js.org/) and [Discord Music Player](https://discord-music-player.js.org/) for its main features.

## Availability
I'm currently hosting the bot myself, and it is publicly available with this invite link:
[Invite](https://discord.com/api/oauth2/authorize?client_id=887122733010411611&permissions=2167425024&scope=bot%20applications.commands)

## Commands & Features
SuitBot uses slash commands to integrate itself into the server. You can easily access its commands directly by typing `/` in your chat window.

### General
Command      | Description
------------ | ---
/github      | Sends a link to the repo of this bot.
/help        | Replies with help on how to use this bot.
/move        | Moves the mentioned user to the specified channel.
/moveall     | Moves all users from the first channel to the second channel.
/ping        | Replies with the current latency.
/purge       | Clears a specified amount of messages.
/uptime      | Tells you how long the bot has been running.

### Music
Command      | Description
------------ | ---
/clear       | Clears the queue.
/nowplaying  | Shows the currently playing song.
/pause       | Pauses playback.
/play        | Searches and plays a song or playlist from YouTube or Spotify.
/queue       | Displays the queue.
/remove      | Removes the specified track from the queue.
/repeat      | Sets the current repeat mode.
/resume      | Resumes playback.
/seek        | Skips to the specified point in the current track.
/shuffle     | Shuffles the queue.
/skip        | Skips the current song.
/stop        | Stops playback.
/volume      | Sets the volume of the music player.


## Running the Bot
You'll need Node.js v16 or newer and FFmpeg v4 or newer.\
Installing SuitBot:

```shell
git clone https://github.com/MeridianGH/suitbot.git
cd suitbot
npm install
```
Rename `config_example.json` to `config.json` and replace the placeholders inside with your info: 
- A Discord Bot Token (**[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**)
- Your Application ID which you can find the the `General Information` tab in your Discord application.
- The Guild ID of the server in which you want to test the bot. To get this ID, activate `Developer Mode` in Discord's options and right-click your server.

Start the bot with
```shell
node deploy-commands.js
node main.js
```

Use `node deploy-commands.js` to update the commands in the guild you specified and `node deploy-commands-global.js` to update the commands in every guild the bot is in.\
Guild commands are refreshed instantly while global commands can take up to an hour.