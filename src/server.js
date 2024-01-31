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

// refactor the code & fix terminate.js

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
  console.log("Interaction received:", interaction.commandName);

  if (!interaction.isCommand()) return;

  const args = interaction.options.data.map((option) => option.value);
  const commandName = interaction.commandName;

  const command = commands.find((cmd) => cmd.data.name === commandName);

  if (!command) return;

  try {
    const targetUser = interaction.options.get("usertoterminate");
    const targetUserId = interaction.options.get("usertoterminate").value;
    command.execute(interaction, targetUser, targetUserId, args);
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
      Routes.applicationGuildCommands(
        clientID,
        guildID
      ),
      { body: formattedCommands }
    );
    console.log(`Successfully reloaded (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

client.login(token);
