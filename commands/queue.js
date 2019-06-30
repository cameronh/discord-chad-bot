import Discord from 'discord.js';

export const name = 'queue';
export const description = 'Returns the current queue of songs.';
export function execute(message) {
  const musicQueue = message.client.musicQueue;
  if (!musicQueue.songs || musicQueue.songs.length === 0) return message.channel.send('There is nothing playing.');

  const queueEmbed = new Discord.RichEmbed();
  queueEmbed.setColor('#0099ff');
  queueEmbed.setAuthor('Song Queue');
  musicQueue.songs.map((song, id) => {
    if (id !== 0) queueEmbed.addField(`**(${id}):** ${song.title}`, `Added by ${song.added_by}`);
  });
  queueEmbed.addBlankField();
  queueEmbed.addField(`**🎶 Now playing:** ${musicQueue.songs[0].title}`, `Added by ${musicQueue.songs[0].added_by}`);
  return message.channel.send(queueEmbed);
}