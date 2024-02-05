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
	const targetMemberId = interaction.options.get("user").value.replace(/[<@!>]/g, '');
	const targetMember = await interaction.guild.members.cache.get(targetMemberId);

	const acceptedRoleId = "1204143457514426449";
	const declinedRoleId = "1204143499314987038";

	const targetChannelId = "1204133154860834816";
    const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

	const fetchRole = (roleId) => {
	  return interaction.guild.roles.cache.get(roleId);
	};

	const resultRoleName = interaction.options.get("result").value;
	const resultRole = interaction.options.get("result").value.replace(/[<@!>]/g, '').replace(/&/g, '');


	if (resultRole) {
		const role = fetchRole(resultRole);
		if (role && !targetMember.roles.cache.has(role.id)) {
		  await targetMember.roles.add(role);
		} else {
		  console.error(`Failed to assign role ${resultRole} to user.`);
		}
	} else {
	  console.error("No resultsrole");
	}

	const appResultsEmbed = new EmbedBuilder()
    .setColor(0x140524)
    .setTitle("Application Results")
    .addFields(
      { name: "Results", value: `${resultRoleName}` },
      { name: "Username", value: `<@${targetMemberId}>`},
	  { name: "Approved By", value: `<@${interaction.user.id}>`},
      { name: "Notes", value: `${interaction.options.get("notes").value}`},
    );

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [appResultsEmbed]});
      }
    } catch(error) {
      console.error(`An error occured: ${error.message}`);
    }
  }
}