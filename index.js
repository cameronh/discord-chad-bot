import fs from 'fs';
import Discord from 'discord.js';
import { prefix, info_channel } from './config';
import 'dotenv/config';

const client = new Discord.Client();
client.commands = new Discord.Collection();

const musicQueue = new Array();
client.musicQueue = musicQueue;

async function loadCommands() {
  fs.readdir('./commands', (err, files) => {
    if (err) console.error(err);
    files.filter(file => file.endsWith('.js')).forEach(async file => {
      const command = await import(`./commands/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        console.info(`[Command] Loaded: ${command.name}`);
      }
    });
  });
}

(async () => {
  try {
    await loadCommands();
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error(error.message);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === info_channel);
  if (!channel) return;

  channel.send(`Welcome to the server, ${member}!`);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) ||
  message.content.length <= 1 || message.content.endsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return message.channel.send(`Unknown command. Type **${prefix}help** for a list of commands.`);
  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
  }
});

