require("dotenv").config();
const {
  REST,
  Client,
  GatewayIntentBits,
  Routes,
  ApplicationCommandOptionType,
} = require("discord.js");
const commandHandler = require("./commandHandler");
const token = process.env.TOKEN;

// fix applicationcommandoptiontype

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const commands = [];
commandHandler(client, null, commands);

const prefix = "/";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands.find((cmd) => cmd.data.name === commandName);

  if (!command) return;

  try {
    const userToBan = message.mentions.users.first();
    command.execute(message, userToBan, args);
  } catch (error) {
    console.error(error);
  }
});

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const formattedCommands = commands.map((command) => {
      const baseCommand = {
        name: command.data.name,
        description: command.data.description,
        options: [],
      };

      if (command.data.options) {
        console.log(command.data.options)
        baseCommand.options = command.data.options.map((option) => ({
          name: option.name,
          description: option.description,
          type: ApplicationCommandOptionType.String,
          required: option.required || false,
        }));
      }

      return baseCommand;
    });

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: formattedCommands }
    );
    console.log(`Successfully reloaded (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);
