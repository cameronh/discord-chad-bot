export const name = 'queue';
export const description = 'Returns the current queue of songs.';
export function execute(message) {
  const musicQueue = message.client.musicQueue;
  if (musicQueue && musicQueue.songs.length === 0) return message.channel.send('There is nothing playing.');
  return message.channel.send(`
  __**Song Queue:**__
  ${musicQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

  **🎶 Now playing:** ${musicQueue.songs[0].title}
  `);
}