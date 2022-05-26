![logo](https://repository-images.githubusercontent.com/406747355/0c0fcbbd-8dab-4259-a5d6-d8cc5069ef37)

[![Invite](https://img.shields.io/static/v1?style=for-the-badge&logo=discord&label=Invite&message=SuitBot&color=000000)](https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024)
[![Discord](https://shields.io/discord/610498937874546699?style=for-the-badge&logo=discord&label=discord)](https://discord.gg/qX2CBrrUpf)
[![Heroku](https://img.shields.io/static/v1?label=Hosted%20with&message=Heroku&color=7056bf&style=for-the-badge&logo=heroku)](https://www.heroku.com)
[![License](https://img.shields.io/github/license/MeridianGH/suitbot?logo=gnu&style=for-the-badge)](https://github.com/MeridianGH/suitbot/blob/main/LICENSE.md)

# SuitBot

> A lightweight music and general purpose bot with dashboard, that uses slash commands and buttons to be as user-friendly as possible!

[Invite](#Invite) • [Commands & Features](#Commands--Features) • [Installation](#Installation) • [Heroku](#Heroku) • [Stats](#Stats) • [Licensing](#Licensing)

Head on over to the [dashboard](https://suitbot.xyz) for more information!

Check out the [Progress Board](https://github.com/MeridianGH/suitbot/projects/1) if you're interested in the current progress in development!

Join the [Discord server](https://discord.gg/qX2CBrrUpf) for information about updates and support or if you'd like to report a bug or leave a suggestion.

## Invite
> Disclaimer: The bot is still in development, so expect some bugs or features that might not work 100% yet. Please report any bugs or suggestions via the respective commands.

It's not recommended to try and run the bot yourself. I am hosting a public instance which is available with this invite link:

[![Invite](https://img.shields.io/static/v1?style=for-the-badge&logo=discord&label=&labelColor=212121&message=Invite&color=212121)](https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024)

## Commands & Features
SuitBot uses slash commands to integrate itself into the server. You can easily access its commands directly by typing `/` in your chat window.

### General
| Command     | Description                               |
|-------------|-------------------------------------------|
| /activity   | Creates a Discord activity.               |
| /dashboard  | Sends a link to the dashboard.            |
| /help       | Replies with help on how to use this bot. |
| /info       | Shows info about the bot.                 |
| /invite     | Sends an invite link for the bot.         |
| /language   | Changes the bots language.                |
| /ping       | Replies with the current latency.         |
| /serverinfo | Shows info about the server.              |
| /userinfo   | Shows info about a user.                  |

### Music
| Command     | Description                                                       |
|-------------|-------------------------------------------------------------------|
| /clear      | Clears the queue.                                                 |
| /filter     | Sets filter modes for the player.                                 |
| /lyrics     | Shows the lyrics of the currently playing song.                   |
| /nowplaying | Shows the currently playing song.                                 |
| /pause      | Pauses playback.                                                  |
| /play       | Searches and plays a song or playlist from YouTube or Spotify.    |
| /previous   | Plays the previous track.                                         |
| /queue      | Displays the queue.                                               |
| /remove     | Removes the specified track from the queue.                       |
| /repeat     | Sets the current repeat mode.                                     |
| /resume     | Resumes playback.                                                 |
| /search     | Searches five songs from YouTube and lets you select one to play. |
| /seek       | Skips to the specified point in the current track.                |
| /shuffle    | Shuffles the queue.                                               |
| /skip       | Skips the current track or to a specified point in the queue.     |
| /stop       | Stops playback.                                                   |
| /volume     | Sets the volume of the music player.                              |

### Moderation
| Command   | Description                                                   |
|-----------|---------------------------------------------------------------|
| /ban      | Bans a user.                                                  |
| /kick     | Kicks a user.                                                 |
| /move     | Moves the mentioned user to the specified channel.            |
| /moveall  | Moves all users from the first channel to the second channel. |
| /purge    | Clears a specified amount of messages.                        |
| /slowmode | Sets the rate limit of the current channel.                   |

### Feedback
| Command     | Description                           |
|-------------|---------------------------------------|
| /bugreport  | Reports a bug to the developer.       |
| /github     | Sends a link to the repo of this bot. |
| /suggestion | Sends a suggestion to the developer.  |

## Installation
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
- Get your YouTube cookie like described in this **[Guide](https://github.com/play-dl/play-dl/blob/main/instructions/README.md)**, but don't create any file. Just paste it in here.
- Get a Genius API application **[here](https://docs.genius.com/)**, generate an access token and paste it here. Can be an empty string.

Use `node deploy-commands.js` to update and add commands in the guild you specified and `node deploy-commands.js global` to update the commands in every guild the bot is in.\
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

## Stats

### Size
![Lines of code](https://img.shields.io/tokei/lines/github/MeridianGH/suitbot?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/MeridianGH/suitbot?style=for-the-badge)

### Code
![GitHub top language](https://img.shields.io/github/languages/top/MeridianGH/suitbot?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/MeridianGH/suitbot?style=for-the-badge)
[![CodeFactor](https://img.shields.io/codefactor/grade/github/MeridianGH/suitbot?style=for-the-badge)](https://www.codefactor.io/repository/github/meridiangh/suitbot)
\
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/MeridianGH/suitbot?style=for-the-badge)
[![discord.js](https://img.shields.io/github/package-json/dependency-version/MeridianGH/suitbot/discord.js?color=44b868&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/discord.js)
[![play-dl](https://img.shields.io/github/package-json/dependency-version/MeridianGH/suitbot/play-dl?color=44b868&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/play-dl)

### GitHub
![GitHub issues](https://img.shields.io/github/issues/MeridianGH/suitbot?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/MeridianGH/suitbot?style=for-the-badge)
\
![GitHub last commit](https://img.shields.io/github/last-commit/MeridianGH/suitbot?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/MeridianGH/suitbot?style=for-the-badge)
\
![GitHub Repo stars](https://img.shields.io/github/stars/MeridianGH/suitbot?style=for-the-badge)
![GitHub watchers](https://img.shields.io/github/watchers/MeridianGH/suitbot?style=for-the-badge)

### Dashboard
![GitHub deployments](https://img.shields.io/github/deployments/MeridianGH/suitbot/suitbotxyz?label=Deployment&style=for-the-badge)
![Website](https://img.shields.io/website?down_message=offline&label=dashboard&style=for-the-badge&up_message=online&url=https%3A%2F%2Fsuitbot.xyz)

## Licensing
If you want to host your own version of SuitBot, with or without modifications to the source code or plan to use any part of this source code, you must disclose the source and reference this repository/license.

[![License](https://img.shields.io/github/license/MeridianGH/suitbot?logo=gnu&style=for-the-badge)](https://github.com/MeridianGH/suitbot/blob/main/LICENSE.md)
