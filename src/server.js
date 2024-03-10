require("dotenv").config();
const { REST, Client, GatewayIntentBits, Routes, ApplicationCommandOptionType, } = require("discord.js");
const commandHandler = require("./commandHandler");

const clientID = process.env['CLIENT_ID'];
const guildID = process.env['GUILD_ID'];

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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;

  const args = interaction.options.data.map((option) => {
    if (option.type === ApplicationCommandOptionType.Mentionable) {
      return option.value.id;
    }
    return option.value;
  });
  const commandName = interaction.commandName;

  const command = commands.find((cmd) => cmd.data.name === commandName);

  if (!command) return;

  try {
    command.execute(client, interaction,);
  } catch (error) {
    console.error(error);
  }
});


const rest = new REST().setToken(process.env.TOKEN);

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
        baseCommand.options = command.data.options.map((option) => ({
          name: option.name,
          description: option.description,
          type: ApplicationCommandOptionType.String,
          required: option.required,
        }));
      }

      return baseCommand;
    });

    await rest.put(
      Routes.applicationGuildCommands(clientID, guildID), { body: formattedCommands });
    console.log(`Successfully reloaded ${commands.length} (/) command(s).`);
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.TOKEN);
