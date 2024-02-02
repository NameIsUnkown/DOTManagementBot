const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, Embed } = require("discord.js");

module.exports = {
    /** 
     * 
     * @param {Client} client
     * @param {Interaction} interaction
    */
    data: {
        name: "terminate",
        description: "Terminate a user.",
        options: [
            {
                name: "user",
                description: "The user's ID to terminate.",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "reason",
                description: "The reason for user termination.",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "appealable",
                description: "Can the ban be revoked?",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "proof",
                description: "Image ID",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            }
        ],
        permissionsRequired: [PermissionFlagsBits.BanMembers],
        botPermissions: [PermissionFlagsBits.BanMembers],
    },
    async execute(client, interaction) {
        const targetUserId = interaction.options.get('user').value.replace(/[<@!>]/g, '');
        const reason = interaction.options.get('reason').value || "No reason provided.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("That user does not exist in the server.");
            return;
        }

        // if (targetUser.id === interaction.guild.ownerId) {
        //     await interaction.editReply("```Cannot ban the server owner.```");
        //     return;
        // }

        const targetUserRolePosition = targetUser.roles.highest.position;
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
        .setColor(0x5aaf2e)
        .setTitle("DOT Termination")
        .addFields(
            {name: "Username", value: `${targetUser}`},
            {name: "Reason", value: `${reason}`},
            {name: "Appealable?", value: `${interaction.options.get("appealable").value}`},
            {name: "Approved By", value: `<@${interaction.user.id}>`},
            {name: "Proof", value: "Image proof"},
        )
        .setImage(interaction.options.get("proof").value)

        try {
            await targetUser.ban({reason});
            await interaction.editReply({content: `<@${targetUser.id}>`, embeds: [bannedUserEmbed]});
        } catch(error) {
            console.log("Error banning the user", error);
        }
    }
} 

