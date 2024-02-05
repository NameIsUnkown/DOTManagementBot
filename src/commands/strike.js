require("dotenv").config();
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "strike",
    description: "Strike a user.",
    options: [
      {
        name: "user",
        description: "Ping (@) a user to strike.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for striking this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "isappealable",
        description: "Is the ban on this user revokable?",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
    ],
  },
  async execute(client, interaction) {
    const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, "");
    const reason = interaction.options.get("reason").value || "No reason provided.";

    const targetMember = await interaction.guild.members.cache.get(targetMemberId);

    const targetChannelId = "1204133154860834816";
    const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

    const strike1 = "1203050312986927187";
    const strike2 = "1203050353453699162";
    const strike3 = "1203050378539700224"; // replace these with the actual role IDs

    let assignedRole;

    const roleToAssign = async (guildId, roleId) => {
      try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
          console.error(`Guild with ID ${guildId} not found.`);
        }
        const role = await guild.roles.fetch(roleId);
        console.log("Role: ", role);
        return role;
      } catch (error) {
        console.error(
          `Error fetching role with ID ${roleId}: ${error.message}`
        );
        return null;
      }
    };

    if (!targetMember.roles.cache.has(strike1)) {
      const role1 = await roleToAssign(interaction.guild.id, strike1);
      if (role1) {
        assignedRole = role1;
        await targetMember.roles.add(role1);
      } else {
        console.log("Error fetching role1.");
      }
    } else if (
      !targetMember.roles.cache.has(strike2) &&
      targetMember.roles.cache.has(strike1)
    ) {
      const role2 = await roleToAssign(interaction.guild.id, strike2);
      if (role2) {
        assignedRole = role2;
        await targetMember.roles.add(role2);
      } else {
        console.log("Error fetching role2.");
      }
    } else if (
      !targetMember.roles.cache.has(strike3) &&
      targetMember.roles.cache.has(strike2) &&
      targetMember.roles.cache.has(strike1)
    ) {
      const role3 = await roleToAssign(interaction.guild.id, strike3);
      if (role3) {
        assignedRole = role3;
        await targetMember.roles.add(role3);
      } else {
        console.log("Error fetching role3.");
      }
    } else {
      console.log("Error assigning the role to the user.");
    }

    const strikeEmbed = new EmbedBuilder()
      .setColor(0x140524)
      .setTitle("DOT Strike")
      .addFields(
        { name: "Username", value: `${targetMember}` },
        { name: "Strike", value: `${assignedRole}` },
        { name: "Reason", value: `${reason}` },
        { name: "Appealable?",value: `${interaction.options.get("isappealable").value}`,},
        { name: "Approved by", value: `<@${interaction.user.id}>` }
      );

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [strikeEmbed]});
      }
    } catch (error) {
      console.error("An error occured: ", error);
    }
  },
};
