require("dotenv").config();
const { ApplicationCommandOptionType, EmbedBuilder, } = require("discord.js");

module.exports = {
  data: {
    name: "promotion",
    description: "Promote a user.",
    options: [
      {
        name: "user",
        description: "Ping (@) a user to strike.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for promoting this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "newrole1",
        description: "New rank (role) to promote this user to.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "newrole2",
        description: "New rank (role) to promote this user to.",
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },
      {
        name: "newrole3",
        description: "New rank (role) to promote this user to.",
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },
    ],
  },
  async execute(client, interaction) {
    const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, '');
    const promotionReason = interaction.options.get("reason")?.value || "No reason provided.";

    const targetMember = await interaction.guild.members.cache.get(targetMemberId);

    const targetChannelId = "1204133154860834816";
    const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

    const roles = [
      interaction.options.get("newrole1").value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("newrole2")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("newrole3")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
    ].filter(Boolean);

    let assignedRoles = [];

    const roleToAssign = async (guildId, roleId) => {
      if (roleId == null) {
        return;
      }
      try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
          console.error(`Guild with ID ${guildId} not found.`);
        }
        const role = await guild.roles.fetch(roleId);
        return role;
      } catch(error) {
        console.error(`Error fetching role with ID ${roleId}: ${error.message}`);
        return null;
      }
    };

    if (roles[0]) {
      if (!targetMember.roles.cache.has(roles[0])) {
        const role = await roleToAssign(interaction.guild.id, roles[0]);
        if (role) {
          assignedRoles.push(role);
          await targetMember.roles.add(role.id);
        } else {
          console.error(`Failed to add role 1 ${role} to user ${targetMember}`);
        }
      };
    }

    if (roles[1]) {
      if (!targetMember.roles.cache.has(roles[1])) {
        const role = await roleToAssign(interaction.guild.id, roles[1]);
        if (role) {
          assignedRoles.push(role);
          await targetMember.roles.add(role.id);
        } else {
          console.error(`Failed to add role 2 ${role} to user ${targetMember}`);
        }
      };
    }

    if (roles[2]) {
      if (!targetMember.roles.cache.has(roles[2])) {
        const role = await roleToAssign(interaction.guild.id, roles[2]);
        if (role) {
          assignedRoles.push(role);
          await targetMember.roles.add(role.id);
        } else {
          console.error(`Failed to add role 3 ${role} to user ${targetMember}`);
        }
      };
    }

    const assignedRolesNames = assignedRoles.map((role) => `${role}`).join(", ");

    const promotionEmbed = new EmbedBuilder()
    .setColor(0x140524)
    .setTitle("DOT Movement: Promotion")
    .addFields(
      { name: "Username", value: `${targetMember}` },
      { name: "Promotion reason", value: `${promotionReason}`},
      { name: "New rank(s)", value: `${assignedRolesNames}\n`},
      { name: "Approved by", value: `<@${interaction.user.id}>`}
    );

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [promotionEmbed]});
      }
    } catch(error) {
      console.error(`An error occured: ${error.message}`);
    }
  }
}