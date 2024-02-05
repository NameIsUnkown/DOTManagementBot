require("dotenv").config();
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

/* 
Make sure that the user cannot enter a role higher than the new role
*/

module.exports = { 
  data: {
    name: "demotion",
    description: "Demote a user.",
    options: [
      {
        name: "user",
        description: "Ping (@) a user to strike.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "Reason for demoting this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "oldrole1",
        description: "Old rank (role) to take away from this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
	  {
        name: "newrole1",
        description: "New rank (role) to give this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "oldrole2",
        description: "Old rank (role) to take away from this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },
	  {
        name: "newrole2",
        description: "New rank (role) to give this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },
      {
        name: "oldrole3",
        description: "Old rank (role) to take away from this user.",
        type: ApplicationCommandOptionType.Mentionable,
        required: false,
      },

      {
        name: "newrole3",
        description: "New rank (role) to give this user.",
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

    const oldRoles = [
      interaction.options.get("oldrole1").value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("oldrole2")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("oldrole3")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
    ];

    const removedOldRoles = [];

    const newRoles = [
      interaction.options.get("newrole1").value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("newrole2")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
      interaction.options.get("newrole3")?.value.replace(/[<@!>]/g, '').replace(/&/g, ''),
    ];

    const addedNewRoles = [];

	  const fetchRoles = (roleIds) => {
		  return roleIds.map((roleId) => interaction.guild.roles.cache.get(roleId));
	  };
  
    const removeRoles = async (member, roles) => {
	    for (const role of roles) {
	      if (role && member.roles.cache.has(role.id)) {
		    removedOldRoles.push(role);
		    await member.roles.remove(role);
	      }
	    }
    };
  
	  const addRoles = async (member, roles) => {
		  for (const role of roles) {
		    if (role && !member.roles.cache.has(role.id)) {
			  addedNewRoles.push(role);
			  await member.roles.add(role);
		    }
		  }
	  };
  
    const oldRolesToBeRemoved = fetchRoles(oldRoles);
    await removeRoles(targetMember, oldRolesToBeRemoved);
  
    const newRolesToBeAdded = fetchRoles(newRoles);
    await addRoles(targetMember, newRolesToBeAdded);

	  const removedRolesNames = removedOldRoles.map((role) => `${role}`).join(", ");
	  const addedRolesNames = addedNewRoles.map((role) => `${role}`).join(", ");

    const demotionEmbed = new EmbedBuilder()
    .setColor(0x140524)
    .setTitle("DOT Movement: Demotion")
    .addFields(
      { name: "Username", value: `${targetMember}` },
      { name: "Promotion reason", value: `${promotionReason}`},
	    { name: "Old rank(s)", value: `${removedRolesNames}`},
      { name: "New rank(s)", value: `${addedRolesNames}`},
      { name: "Approved by", value: `<@${interaction.user.id}>`}
    );

    try {
      if (targetChannel) {
        targetChannel.send({content: `<@${targetMemberId}>`, embeds: [demotionEmbed]});
      }
    } catch(error) {
      console.error(`An error occured: ${error.message}`);
    }
  },
};
