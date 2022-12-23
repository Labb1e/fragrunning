const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
require("dotenv").config()

const OWNER_ID = process.env.OWNER_ID;
const ACCOUNT_NAME1 = process.env.ACCOUNT_NAME1;
const ACCOUNT_NAME2 = process.env.ACCOUNT_NAME2;

module.exports = {
	data: new SlashCommandBuilder().setName("run").setDescription("Runs a command on a fragbot").addStringOption((option) => option.setName("bot").setDescription("Bot to run command").setRequired(true).addChoice(ACCOUNT_NAME1, ACCOUNT_NAME1).addChoice(ACCOUNT_NAME2, ACCOUNT_NAME2)).addStringOption((option) => option.setName("command").setDescription("Command to run").setRequired(true)),

	run: async ({ interaction }) => {
		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setDescription(`a`)
        ],
		})
	},
}
