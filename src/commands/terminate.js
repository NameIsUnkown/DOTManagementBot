const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        name: "terminate",
        description: "Terminate a user.",
    },
    async execute(message, userToBan, options) {
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

