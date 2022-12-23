const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const mch = require("mc-heads-api");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Whitelists a user")
    .addStringOption((option) => option.setName("user").setDescription("User to whitelist").setRequired(true)),
  run: async ({ interaction }) => {
    const player = await mch.getPlayer(interaction.options.get("user").value);
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
        .setTitle("Whitelisted")
        .setDescription(
          `Succesfully whitelisted ${player.username}!`
        )
        .setThumbnail(player.avatar)
        .setColor("PURPLE"),
      ],
    });
    
    fs.appendFile("./src/storage/usernames.csv", `${player.username}\n` , function (err) { if (err) throw err; });
  },
};
