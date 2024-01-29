const { MessageEmbed, ApplicationCommandOptionType } = require("discord.js");

// TODO: add option templates to each command

module.exports = {
    data: {
        name: "terminate",
        description: "Terminate a user.",
        options: [
            {
                name: "userToTerminate",
                description: "The user's ID to terminate.",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "reasonForTermination",
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
                name: "aprovedBy",
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
    async execute(message, userToBan, args) {
        const embed = new MessageEmbed()
        .setTitle("User")
        .setDesciption(`${userToBan.user.id}`)
        .setColor('#3498db')

        const embedMessage = message.channel.send({embeds: [embed]});

        try {
            const memberToBan = await message.guild.members.fetch(userToBan);
            await memberToBan.ban({reason: options.join(" ")});
            embedMessage.edit({content: "User banned successfully", embeds: [embed.setColor("#00ff00")]})
        } catch(error) {
            embedMessage.edit({ content: 'Failed to ban user', embeds: [embed.setColor('#ff0000')] });
        }
    }
} 

