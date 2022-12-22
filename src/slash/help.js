const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("help").setDescription("Shows help info and commands"),
	run: async ({ interaction }) => {
		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setDescription(`hi`)
        ],
		})
	},
}
