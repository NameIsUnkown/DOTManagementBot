require("dotenv").config();
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/* 
Limit the role selection to only 2 roles - @Accepted and @Declined
*/

module.exports = {
  data: {
    name: "appresults",
    description: "Application results.",
    options: [
      {
        name: "result",
        description: "Result of the application for this applicant.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "user",
        description: "The applicant.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "notes",
        description: "Notes.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.some((role) => role.name === "DOT | HR")) {
      await interaction.reply({content: "You don't have permission to use this command.", ephemeral: true});
      return;
    }

    const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, "");
    // const targetMember = await interaction.guild.members.cache.get(targetMemberId);
	  // Send the embed to the defined channel 
    // const targetChannel = interaction.guild.channels.cache.get(process.env.APP_RESULTS_CHANNEL_ID);
    const targetChannel = "1204133154860834816";

    // const fetchRole = (roleId) => {
    //   return interaction.guild.roles.cache.get(roleId);
    // };

    const resultRoleName = interaction.options.get("result").value;

    const appResultsEmbed = new EmbedBuilder()
      .setColor(0x140524)
      .setTitle("Application Results")
      .addFields(
        { name: "Results", value: `${resultRoleName}` },
        { name: "Username", value: `<@${targetMemberId}>` },
        { name: "Approved By", value: `<@${interaction.user.id}>` },
        { name: "Notes", value: `${interaction.options.get("notes").value}` }
      );

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`,embeds: [appResultsEmbed]});
      }
      await interaction.reply({ content: `Successfully sent the embed to ${targetChannel}`, ephemeral: true });
    } catch (error) {
      await interaction.reply({content: `An error occured while sending the embed.`, ephemeral: true});
    }
  },
};
