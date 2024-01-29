module.exports = {
    data: {
        name: 'ping',
        description: 'ping!',
        optionName: "Terminate",
        optionDescription: "Terminate a user"
    },
    execute(message, args) {
        message.reply('pong!');
    }
}