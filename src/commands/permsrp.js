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
		required: true,
	  },
	],
  },
  async execute(client, interaction) {
	const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, '');
	const targetMember = await interaction.guild.members.cache.get(targetMemberId);
	
	const permsRolePlay = new EmbedBuilder()
    .setColor(0x140524)
    .setTitle("Application Results")
    .addFields(
      { name: "Username", value: `${targetMember}` },
      { name: "Location", value: `${interaction.options.get("location").value}`},
      { name: "Action", value: `${interaction.options.get("action").value}`},
	  { name: "Approved By", value: `<@${interaction.user.id}>`},
      { name: "Notes", value: `${interaction.options.get("notes").value}`},
    )
	.setImage()

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [permsRolePlay]});
      }
    } catch(error) {
      console.error(`An error occured: ${error.message}`);
    }
  }
}

