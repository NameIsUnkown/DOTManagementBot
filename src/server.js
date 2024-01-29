require("dotenv").config()
const { REST, Client, GatewayIntentBits, Routes } = require("discord.js");
const commandHandler = require("./commandHandler");
const token = process.env.TOKEN;
const terminate = require("./commands/terminate");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const commands = [];
commandHandler(client, null, commands);

const prefix = '/';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.find(cmd => cmd.data.name === commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }

    switch (commandName) {
        case 'terminate':
            const userToBan = message.mentions.users.first();
            terminate(message, userToBan, args);
    }
});

client.on('interactionCreate', (interaction) => {
    if (interaction.commandName === "ping") {
        interaction.reply("hey")
    }
});

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
        const formattedCommands = commands.map(command => ({
            name: command.data.name,
            description: command.data.description,
        }));

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: formattedCommands }
        );
        console.log(`Successfully reloaded (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(token);
