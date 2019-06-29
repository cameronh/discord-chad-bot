import fs from 'fs';
import Discord from 'discord.js';
import { prefix } from './config.json';
import 'dotenv/config';

const client = new Discord.Client();
client.commands = new Discord.Collection();

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

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
  }
});
