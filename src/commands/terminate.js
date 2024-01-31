const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: {
        name: "terminate",
        description: "Terminate a user.",
        options: [
            {
                name: "usertoterminate",
                description: "The user's ID to terminate.",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "reasonfortermination",
                description: "The reason for user termination.",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "appealable",
                description: "Can the ban be revoked?",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "aprovedby",
                description: "Who is it approved by?",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "proof",
                description: "Image ID",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    async execute(message, targetUser, targetUserId, args) {
        const embed = new EmbedBuilder()
        .setTitle("User")
        .setDescription(`${targetUser}`)
        .setColor('#3498db')

        const embedMessage = await message.channel.send({embeds: [embed]});

        const memberToBan = await message.guild.members.fetch(targetUser);
        console.log("member to ban:", memberToBan)
        await memberToBan.ban({reason: "noob"});
        embedMessage.edit({content: "User banned successfully", embeds: [embed.setColor("#00ff00")]})
    }
} 

