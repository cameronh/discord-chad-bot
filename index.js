import Discord from 'discord.js';
import { prefix } from './config.json';
import 'dotenv/config';

import * as CommandCoinFlip from './commands/coin-flip';

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.commands.set(CommandCoinFlip.name, CommandCoinFlip);

(async () => {
  try {
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

