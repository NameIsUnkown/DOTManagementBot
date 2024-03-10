require("dotenv").config();
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/*
Work more on the proof part - where it should display an image
*/

module.exports = {
  data: {
    name: "permsrp",
	description: "Roles for roleplay.",
	options: [
	  {
		name: "user",
		description: "The user.",
		type: ApplicationCommandOptionType.Mentionable,
		required: true,
	  },
	  {
		name: "location",
		description: "The location.",
		type: ApplicationCommandOptionType.String,
		required: true,
	  },
	  {
		name: "action",
		description: "The action.",
		type: ApplicationCommandOptionType.String,
		required: true,
	  },
	  {
		name: "proof",
		description: "Proof.",
		type: ApplicationCommandOptionType.Attachment,
		required: false,
	  },
	],
  },
  async execute(client, interaction) {
	if (!interaction.member.roles.cache.some((role) => role.name === "DOT | MR")) {
		await interaction.reply({content: "You don't have permission to use this command.", ephemeral: true});
		return;
	}

	const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, '');
	const targetMember = await interaction.guild.members.cache.get(targetMemberId);
	// For testing in the test server
    // const targetChannelId = "1204133154860834816";
    const targetChannel = interaction.guild.channels.cache.get(process.env.PERMS_RP_CHANNEL_ID);

	const permsRolePlay = new EmbedBuilder()
    .setColor(0x140524)
    .setTitle("Application Reviewer")
    .addFields(
      { name: "Username", value: `${targetMember}` },
      { name: "Location", value: `${interaction.options.get("location").value}`},
      { name: "Action", value: `${interaction.options.get("action").value}`},
	  { name: "Approved By", value: `<@${interaction.user.id}>`},
      { name: "Proof", value: `${interaction.options.get("proof")?.value || "No proof was provided."}`},
    )
	.setImage()

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [permsRolePlay]});
      }
	  await interaction.reply({content: `Successfully sent embed to ${targetChannel}`, ephemeral: true});
    } catch(error) {
      await interaction.reply({content: `An error occured while sending the embed.`, ephemeral: true});
    }
  }
}

