require("dotenv").config();
const mineflayer = require("mineflayer");
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const csv = require("csvtojson");

const TOKEN = process.env.TOKEN;
const LOGS = process.env.LOGS;
const PUB1 = process.env.BOT1;
const PUB2 = process.env.BOT2;
const ACCOUNT_NAME1 = process.env.ACCOUNT_NAME1;
const ACCOUNT_NAME2 = process.env.ACCOUNT_NAME2;
const OWNER_ID = process.env.OWNER_ID;
const TIME = process.env.TIME;

const usernames = [];

setInterval(() => {
  (async () => {
    const jsonArray = await csv().fromFile("./src/storage/usernames.csv");
    jsonArray.forEach((item) => usernames.push(item.username));
  })();
}, 1000);



function LOG(message, type, bot, player) {
  bot_name = null;
  if (bot == "bot1") {
    bot_name = ACCOUNT_NAME1;
  } else if (bot == "bot2") {
    bot_name = ACCOUNT_NAME2;
  } else if (bot == "discord") {
    bot_name = "Discord";
  }
  if (type == "chat") {
    if (message.toString() != "") {
      console.log(`Chat message: ${message.toString()} to ${bot}`);
      const channel = client.channels.cache.get(LOGS);
      channel.send({
        embeds: [
          {
            title: "Chat message",
            description: message.toString(),
            color: 0x55ff55,
            footer: {
              text: `${bot_name} logs`,
            },
          },
        ],
      });
    }
  }
  if (type == "command") {
    console.log(`Command run: ${message.toString()} by ${bot}`);
    const channel = client.channels.cache.get(LOGS);
    channel.send({
      embeds: [
        {
          title: "Command run",
          description: message.toString(),
          color: 0x7fffd4,
          footer: {
            text: `${bot_name} logs`,
          },
        },
      ],
    });
  }
  if (type == "error") {
    console.log(`Error: ${message.toString()}`);
    const channel = client.channels.cache.get(LOGS);
    channel.send({
      embeds: [
        {
          title: "Error",
          description: message.toString(),
          color: 0xf04a47,
          footer: {
            text: `${bot_name} logs`,
          },
        },
      ],
    });
  }
  if (type == "info") {
    console.log(`Info: ${message.toString()}`);
    const channel = client.channels.cache.get(LOGS);
    channel.send({
      embeds: [
        {
          title: "Info",
          description: message.toString(),
          color: 0xff1493,
          footer: {
            text: `${bot_name} logs`,
          },
        },
      ],
    });
  }
  if (type == "public") {
    if (bot == "bot1") {
      const channel = client.channels.cache.get(PUB1);
      channel.send({
        embeds: [
          {
            title: `${ACCOUNT_NAME1} logs`,
            description: `${message.toString()} just partied ${ACCOUNT_NAME1}!`,
            color: 0x00ffff,
            thumbnail: {
              url: `https://mc-heads.net/avatar/${player}`,
            },
            footer: {
              text: `Made by Labbie#0743`,
              icon_url: "https://labbie.co.uk/assets/icons/dog.png",
            },
          },
        ],
      });
    } else if (bot == "bot2") {
      const channel = client.channels.cache.get(PUB2);
      channel.send({
        embeds: [
          {
            title: `${ACCOUNT_NAME2} logs`,
            description: `${message.toString()} just partied ${ACCOUNT_NAME2}!`,
            color: 0x00ffff,
            thumbnail: {
              url: `https://mc-heads.net/avatar/${player}`,
            },
            footer: {
              text: `Made by Labbie#0743`,
              icon_url: "https://labbie.co.uk/assets/icons/dog.png",
            },
          },
        ],
      });
    } else {
      console.log("No bot specified");
    }
    if (type == "publicErr") {
      if (bot == "bot1") {
        const channel = client.channels.cache.get(PUB1);
        channel.send({
          embeds: [
            {
              title: `${ACCOUNT_NAME1} disconnected!`,
              description: `${ACCOUNT_NAME1} just disconnected! Please contact a member of staff to fix this!`,
              color: 0xf04a47,
              footer: {
                text: `Made by Labbie#0743`,
                icon_url: "https://labbie.co.uk/assets/icons/dog.png",
              },
            },
          ],
        });
      } else if (bot == "bot2") {
        const channel = client.channels.cache.get(PUB2);
        channel.send({
          embeds: [
            {
              title: `${ACCOUNT_NAME2} disconnected!`,
              description: `${ACCOUNT_NAME2} just disconnected! Please contact a member of staff to fix this!`,
              color: 0xf04a47,
              footer: {
                text: `Made by Labbie#0743`,
                icon_url: "https://labbie.co.uk/assets/icons/dog.png",
              },
            },
          ],
        });
      } else {
        console.log("No bot specified");
      }
    }
  }
}

function createBot(botno) {
  if (botno == "bot1") {
    var bot1 = mineflayer.createBot({
      viewDistance: "tiny",
      version: "1.17.1",
      defaultChatPatterns: false,
      host: "mc.hypixel.net",
      username: "email",
      auth: process.env.AUTH1,
      profilesFolder: "./src/storage/.bot1",
    });

    const queue1 = [];

    const commandStack = [];

    setInterval(() => {
      const commmand = commandStack.shift();
      if (commmand) {
        LOG(commmand, "command", "bot1");
        bot1.chat(commmand);
      }
    }, 500);

    inParty = false;

    function onPartyJoin() {
      setTimeout(() => {
        bot1.chat("/p leave");
        inParty = false;
      }, TIME);
    }

    setInterval(() => {
      if (queue1.length > 0) {
        if (!inParty) {
          const user = queue1.shift();
          if (user) {
            console.log(user);
            commandStack.push("/p join " + user);
            inParty = true;
          }
        }
      }
    }, 500);

    bot1.on("message", (message) => {
      LOG(message, "chat", "bot1");
      if (
        message.toString().includes(` has invited you to join their party!`)
      ) {
        (async () => {
          const jsonArray = await csv().fromFile("./src/storage/usernames.csv");
          jsonArray.forEach((item) => usernames.push(item.username));
        })();
        if (usernames.includes(message.toString().split(" ")[1])) {
          const usernum = usernames.indexOf(message.toString().split(" ")[1]);
          const user = usernames[usernum];
          queue1.push(user);
          LOG(user + " invited", "public", "bot1", user);
        }
      } else if (message.toString().includes(`You have joined`)) {
        onPartyJoin();
      }
    });

    bot1.once("login", () => {
      LOG("Logged in", "info", "bot1");
      commandStack.push("/p leave");
    });

    bot1.on("login", () => {
      commandStack.push("§");
    });

    bot1.on("kicked", () => {
      LOG("Kicked", "error", "bot1");
      setTimeout(() => {
        createBot("bot1");
      }, 5000);
    });
  } else if (botno == "bot2") {
    var bot2 = mineflayer.createBot({
      viewDistance: "tiny",
      version: "1.17.1",
      defaultChatPatterns: false,
      host: "mc.hypixel.net",
      username: "email",
      auth: process.env.AUTH1,
      profilesFolder: "./src/storage/.bot2",
    });

    const queue2 = [];

    const commandStack = [];

    setInterval(() => {
      const commmand = commandStack.shift();
      if (commmand) {
        LOG(commmand, "command", "bot2");
        bot2.chat(commmand);
      }
    }, 500);

    inParty = false;

    function onPartyJoin() {
      setTimeout(() => {
        bot2.chat("/p leave");
        inParty = false;
      }, TIME);
    }

    setInterval(() => {
      if (queue2.length > 0) {
        if (!inParty) {
          const user = queue2.shift();
          if (user) {
            console.log(user);
            commandStack.push("/p join " + user);
            inParty = true;
          }
        }
      }
    }, 500);

    bot2.on("message", (message) => {
      LOG(message, "chat", "bot2");
      if (
        message.toString().includes(` has invited you to join their party!`)
      ) {
        (async () => {
          const jsonArray = await csv().fromFile("./src/storage/usernames.csv");
          jsonArray.forEach((item) => usernames.push(item.username));
        })();
        if (usernames.includes(message.toString().split(" ")[1])) {
          const usernum = usernames.indexOf(message.toString().split(" ")[1]);
          const user = usernames[usernum];
          queue2.push(user);
          LOG(user + " invited", "public", "bot2", user);
        }
      } else if (message.toString().includes(`You have joined`)) {
        onPartyJoin();
      }
    });

    bot2.once("login", () => {
      LOG("Logged in", "info", "bot2");
      commandStack.push("/p leave");
    });

    bot2.on("login", () => {
      commandStack.push("§");
    });

    bot2.on("kicked", () => {
      LOG("Kicked", "error", "bot2");
      setTimeout(() => {
        createBot("bot2");
      }, 5000);
    });
  } else {
    console.log("No bot specified");
  }
}

createBot("bot1");
createBot("bot2");

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});

client.slashcommands = new Discord.Collection();

const LOAD_SLASH = process.argv[2] == "load";
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

let commands = [];

const slashFiles = fs
  .readdirSync("./src/slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

if (LOAD_SLASH) {
  const rest = new REST({ version: "9" }).setToken(TOKEN);
  console.log("Deploying slash commands");
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Successfully loaded");
      process.exit(0);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
}

client.on("interactionCreate", (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return;

    const slashcmd = client.slashcommands.get(interaction.commandName);
    if (!slashcmd) interaction.reply("Not a valid slash command");

    await interaction.deferReply();
    await slashcmd.run({ client, interaction });
  }
  handleCommand();
});

client.on("ready", () => {
  LOG(`Discord bot logged in as ${client.user.tag}`, "info", "discord");
});

process.on("sigint", () => {
  LOG("Shutting down", "info", "bot1");
  LOG("Shutting down", "info", "bot2");
  LOG("Shutting down", "info", "discord");
  bot1.quit();
  bot2.quit();
  client.destroy();
  process.exit(0);
});

client.login(TOKEN);
