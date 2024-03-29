// Dependencies
const { Client, Collection } = require("discord.js");
require("dotenv").config();

// Ready message
const client = new Client();
client.once("ready", (ready) => {
  const ready_msg = `[READY] \<MamaSlimes@${new Date().toUTCString()}\>`;
  console.log(ready_msg);
  // Slimes copy the channelID here, right click the channel name in the server
  client.channels
    .fetch(process.env.SERVER_ID_MAIN)
    .then((e) => e.send(ready_msg));

  client.user.setActivity("mama -commands ?args", { type: "LISTENING" });
});

// Get commands dynamically
client.commands = new Collection();
const fs = require("fs");
fs.readdirSync("./src/js/commands")
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  });

// Activate on message event
client.on("message", async (userInput) => {
  const { prefix } = require("../../config/prefix.json");

  let message = userInput.content.toLowerCase();

  try {
    if (userInput.author.bot) {
      return;
    } else {
      if (message.startsWith(prefix)) {
        // This regex removes symbols and numbers
        // Will break hentai and archive commands
        // let regex = message.replace(/[^a-zA-Z ]/g, "");
        let args = message.slice(prefix.length).trim().split(" ");
        let cmnd = args.shift();
        client.commands.get(cmnd).execute(userInput, args);
      }
    }
  } catch (error) {
    require("./tools").message_tools.catchError(userInput, error);
  }
});

client.login(process.env.TOKEN);
