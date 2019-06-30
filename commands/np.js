export const name = 'np';
export const description = 'Shows the current song playing in the server queue.';
export async function execute(message) {
  const musicQueue = message.client.musicQueue;
  if (!musicQueue.songs) return message.channel.send('There is nothing playing.');
  else message.channel.send(`🎶 Now playing: **${musicQueue.songs[0].title}**`);
}