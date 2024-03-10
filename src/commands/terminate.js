const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, } = require("discord.js");

/*
Work more on the proof part - where it should display an image
*/

module.exports = {
  data: {
    name: "terminate",
    description: "Terminate a user.",
    options: [
      {
        name: "user",
        description: "Ping (@) a user to terminate.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for user termination.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "appealable",
        description: "Can the ban be revoked?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
      {
        name: "proof",
        description: "Image ID",
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  },
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.some((role) => role.name === "DOT | HR")) {
      await interaction.reply({content: "You don't have permission to use this command.", ephemeral: true});
      return;
    }
    
    const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, "");
    const reason = interaction.options.get("reason").value || "No reason provided.";

    const targetMember = await interaction.guild.members.fetch(targetMemberId);

    // const targetChannelId = "1204133154860834816";
    const targetChannel = interaction.guild.channels.cache.get(process.env.TERMINATIONS_CHANNEL_ID);

    if (!targetMember) {
      await interaction.editReply("```That user does not exist in the server.```");
      return;
    }

    const targetUserRolePosition = targetMember.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("```You can't ban that user because they have the same/higher role than you.```");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("```I cant ban that user because they have the same/higher role than me.```");
      return;
    }

    const bannedUserEmbed = new EmbedBuilder()
      .setColor(0x140524)
      .setTitle("DOT Termination")
      .addFields(
        { name: "Username", value: `${targetMember}` },
        { name: "Reason", value: `${reason}` },
        { name: "Appealable?", value: `${interaction.options.get("appealable").value}`, },
        { name: "Approved By", value: `<@${interaction.user.id}>` },
        { name: "Proof", value: "Image proof" }
      )
      .setImage(interaction.options.get("proof").value.url);

    try {
      await targetMember.ban({ reason });
      if (targetChannel) {
        await targetChannel.send({ content: `<@${targetMemberId}>`, embeds: [bannedUserEmbed], });
      }
      await interaction.reply({content: `Successfully demoted`, ephemeral: true});
    } catch (error) {
      await interaction.reply({content: `An error occured while sending the embed.`, ephemeral: true});
    }
  },
}; 

