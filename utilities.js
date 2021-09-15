const { MessageEmbed } = require('discord.js');

module.exports = {
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    simpleEmbed: function(content) {
        return {embeds: [new MessageEmbed().setDescription(content)]};
    },
};

// const { simpleEmbed } = require('../../utilities');