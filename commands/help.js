import Discord from 'discord.js';
import { prefix } from '../config';

export const name = 'help';
export const description = 'Displays a help embed with all of the commands available.';
export function execute(message) {
  const commands = message.client.commands;

  const helpEmbed = new Discord.RichEmbed();
  helpEmbed.setColor('#0099ff');
  helpEmbed.setAuthor('Chad Bot Help');
  commands.forEach(cmd => {
    if (cmd.name != 'help') helpEmbed.addField(`**${prefix}${cmd.name}**`, `${cmd.description}\n${cmd.usage ? `Usage: ${cmd.usage}` : ''}`);
  });

  return message.channel.send(helpEmbed);
}