module.exports = {
    name: 'channelEmpty',
    execute(queue) {
        queue.lastTextChannel.send('Left because channel empty.');
    },
};