![logo](https://repository-images.githubusercontent.com/406747355/0c0fcbbd-8dab-4259-a5d6-d8cc5069ef37)
<p align="center">
<a href="https://github.com/standard/standard"><img alt="JS Standard" src="https://cdn.rawgit.com/standard/standard/master/badge.svg" height=30></a>
<a href="https://www.heroku.com"><img alt="Heroku" src="https://img.shields.io/static/v1?label=Hosted with&message=Heroku&color=7056bf&style=for-the-badge&logo=heroku" height=30></a>
<a href="https://github.com/MeridianGH/suitbot/blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/github/license/MeridianGH/suitbot?logo=apache&style=for-the-badge" height=30></a>
<a href="https://discord.gg/qX2CBrrUpf"><img alt="Discord" src="https://shields.io/discord/610498937874546699?style=for-the-badge&logo=discord&label=discord" height=30></a>
</p>

# SuitBot

> A lightweight music and general purpose bot with dashboard, that uses slash commands and buttons to be as user-friendly as possible!

It uses [discord.js](https://discord.js.org/) and [Discord Music Player](https://discord-music-player.js.org/) for its main features.

Head on over to the [dashboard](http://suitbot.xyz) for more information!

Join the [Discord server](https://discord.gg/qX2CBrrUpf) for information about updates and support or if you'd like to report a bug or leave a suggestion.

## Availability
> Disclaimer: The bot is still in development, so expect some bugs or features that might not work 100% yet. Please report any bugs or suggestions via the respective commands.

I'm currently hosting the bot myself, and it is publicly available with this invite link:

[![invite](https://img.shields.io/static/v1?style=for-the-badge&logo=discord&label=&labelColor=212121&message=Invite&color=212121)](https://discord.com/api/oauth2/authorize?client_id=887122733010411611&permissions=2167425024&scope=bot%20applications.commands)

The dashboard is available here: [Dashboard](http://suitbot.xyz)\
You can check the current status to the right under `Environments`.


## Commands & Features
SuitBot uses slash commands to integrate itself into the server. You can easily access its commands directly by typing `/` in your chat window.

### General
Command      | Description
------------ | ---
/activity    | Creates a Discord activity.
/avatar      | Gives information about a user's avatar.
/dashboard   | Sends a link to the dashboard.
/help        | Replies with help on how to use this bot.
/info        | Shows info about the bot.
/ping        | Replies with the current latency.
/serverinfo  | Shows info about the server.
/userinfo    | Shows info about a user.

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
/skipto      | Skips to the specified song in the queue.
/stop        | Stops playback.
/volume      | Sets the volume of the music player.

### Moderation
Command      | Description
------------ | ---
/ban         | Bans a user.
/kick        | Kicks a user.
/move        | Moves the mentioned user to the specified channel.
/moveall     | Moves all users from the first channel to the second channel.
/purge       | Clears a specified amount of messages.
/slowmode    | Sets the rate limit of the current channel.

### Feedback
Command      | Description
------------ | ---
/bugreport   | Reports a bug to the developer.
/github      | Sends a link to the repo of this bot.
/suggestion  | Sends a suggestion to the developer.



## Running the Bot
You'll need Node.js v16.x and FFmpeg v4.4.\
Installing SuitBot:

```shell
git clone https://github.com/MeridianGH/suitbot.git
cd suitbot
npm install
```
Rename `config_example.json` to `config.json` and replace the placeholders inside with your info:
- A Discord Bot Token (**[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**)
- Your Application ID which you can find the the `General Information` tab in your Discord application.
- Your Client Secret which is under `OAuth2` in your Discord application. 
  - While you're here, add `http://localhost/callback` to the `Redirects`.
- The Guild ID of the server in which you want to test the bot. To get this ID, activate `Developer Mode` in Discord's options and right-click your server.
- Your User ID of your Discord account which will be your Admin-Account for the bot. Right-click yourself with `Developer Mode` activated.

Use `node deploy-commands.js` to update and add commands in the guild you specified and `node deploy-commands-global.js` to update the commands in every guild the bot is in.\
Guild commands are refreshed instantly while global commands can take up to an hour.

Start the bot with
```shell
node main.js
```

### Heroku
It is also possible to install and run the bot in Heroku.
- Replace the domain in `dashboard.js` with the domain of you Heroku app.
- Replace `http://localhost/callback` in your Discord Application Redirects with `http://yourHerokuDomain/callback`
- Add your fork of this repository as a GitHub source, add the buildpacks listed below and place your config information with their respective names in the config vars.
```
heroku/nodejs
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest
```

Deploying on Heroku automatically deploys all commands globally, so make sure to test your commands locally beforehand.

## License
<a href="https://github.com/MeridianGH/suitbot/blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/github/license/MeridianGH/suitbot?logo=apache&style=for-the-badge" height=30></a>
