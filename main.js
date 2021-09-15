const fs = require('fs');
const path = require('path');
const { Client, Collection, Intents } = require('discord.js');
const { token} = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Add command files
client.commands = new Collection();
const commandFiles = [];

const getFilesRecursively = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            commandFiles.push(absolute);
        }
    }
};
getFilesRecursively('./commands/');

for (const file of commandFiles) {
    const command = require(`./${file}`);
    client.commands.set(command.data.name, command);
}

// Add event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
