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
		name: "action",
		description: "The action.",
		type: ApplicationCommandOptionType.String,
		required: true,
	  },
	  {
		name: "proof",
		description: "Proof.",
		type: ApplicationCommandOptionType.String,
		required: true,
	  },
	],
  },
  async execute(client, interaction) {
	const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, '');
	const targetMember = await interaction.guild.members.cache.get(targetMemberId);
  }
}

