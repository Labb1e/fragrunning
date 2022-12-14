require("dotenv").config();
const mineflayer = require("mineflayer");
const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const TOKEN = process.env.TOKEN;
const LOGS = process.env.LOGS;
const PUB1 = process.env.BOT1;
const PUB2 = process.env.BOT2;

const bot1 = mineflayer.createBot({
  viewDistance: "tiny",
  version: "1.17.1",
  defaultChatPatterns: false,
  host: "mc.hypixel.net",
  username: process.env.ACCOUNT_NAME1,
  auth: process.env.AUTH1,
  profilesFolder: "./.bot1",
});

const bot2 = mineflayer.createBot({
  viewDistance: "tiny",
  version: "1.17.1",
  defaultChatPatterns: false,
  host: "mc.hypixel.net",
  username: process.env.ACCOUNT_NAME2,
  auth: process.env.AUTH2,
  profilesFolder: "./.bot2",
});

function LOGDISCORD(message) {
  const channel = client.channels.cache.get(LOGS)
  channel.send({
    "embeds": [
      {
        "title": "Discord logs",
        "description": message,
        "color": 0x00ff00,
        "type": "rich"
      }
    ]
  })
}

function LOG1(message) {
  console.log(message);
  const channel = client.channels.cache.get(LOGS)
  channel.send({
    "embeds": [
      {
        "title": "Bot 1 logs",
        "description": message,
        "color": 0x00ff00,
        "type": "rich"
      }
    ]
  })
}

function LOG2(message) {
  console.log(message);
  const channel = client.channels.cache.get(LOGS)
  channel.send({
    "embeds": [
      {
        "title": "Bot 2 logs",
        "description": message,
        "color": 0x00ff00,
        "type": "rich"
      }
    ]
  })
}

function PUBLIC1(message) {
  const channel = client.channels.cache.get(PUB1)
  channel.send({
    "embeds": [
      {
        "title": "Beaditch logs",
        "description": message,
        "color": 0x00ff00,
        "type": "rich"
      }
    ]
  })
}

function PUBLIC2(message) {
  const channel = client.channels.cache.get(PUB2)
  channel.send({
    "embeds": [
      {
        "title": "gaylittlecatgirl logs",
        "description": message,
        "color": 0x00ff00,
        "type": "rich"
      }
    ]
  })
}

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});

let usernames = ["labb1e", "beedit", "Strecs"];

bot1.on("message", (message) => {
  console.log(message.toAnsi());
  if (message.toString().includes(` has invited you to join their party!`)) {
    if (usernames.includes(message.toString().split(" ")[1])) {
      const usernum = usernames.indexOf(message.toString().split(" ")[1]);
      console.log(usernum);
      const user = usernames[usernum];
      PUBLIC1(`${user} has invited Beaditch to join their party!`)
      LOG1(`Running /p join ${user}`);
      bot1.chat(`/p join ${user}`);
      setTimeout(() => {
        LOG1("Running /p leave")
        bot1.chat(`/p leave`);
      }, 5000);
    }
  }
});

bot1.on("login", () => {
  LOG1("Logged in");
  LOG1("Running §")
  bot1.chat("§");
  LOG1 ("Running /p leave")
  bot1.chat("/p leave");
});

bot1.on("kicked", LOG1);
bot1.on("error", LOG1);

bot2.on("message", (message) => {
  console.log(message.toAnsi());
  if (message.toString().includes(` has invited you to join their party!`)) {
    if (usernames.includes(message.toString().split(" ")[1])) {
      const usernum = usernames.indexOf(message.toString().split(" ")[1]);
      console.log(usernum);
      const user = usernames[usernum];
      PUBLIC2(`${user} has invited gaylittlecatgirl to join their party!`)
      LOG2(`Running /p join ${user}`)
      bot2.chat(`/p join ${user}`);
      setTimeout(() => {
        LOG2("Running /p leave")
        bot2.chat(`/p leave`);
      }, 5000);
    }
  }
});

bot2.on("login", () => {
  LOG2("Bot 2 logged in");
  LOG2("Bot 2 running §")
  bot2.chat("§");
  LOG2 ("Bot 2 running /p leave")
  bot2.chat("/p leave");
});

bot2.on("kicked", console.log);
bot2.on("error", console.log);

client.on("ready", () => {
  LOGDISCORD("Bot logged in as " + client.user.tag);
});

client.login(TOKEN);
