const fs = require("fs");
const path = require("path");

module.exports = (client, discord, commands) => {
    const commandsPath = path.join(__dirname, "commands");

    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            commands.push(command);
            console.log(`Command ${command.data.name} loaded from ${filePath}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a 'data' or 'execute' property.`);
        }
    }
};
