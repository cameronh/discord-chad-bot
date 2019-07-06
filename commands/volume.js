export const name = 'volume';
export const description = 'Adjusts the volume of the music being played.';
export const usage = '<amount> (0-1)';
export function execute(message, args) {
  const musicQueue = message.client.musicQueue;
  if (!musicQueue.songs || musicQueue.songs.length === 0) return message.channel.send('There is nothing playing.');
  if (!args[0]) return message.channel.send(`Current Volume: **${musicQueue.volume}**`);
  const volume = parseFloat(args[0]);
  if (volume <= 1) {
    musicQueue.volume = volume;
    musicQueue.connection.dispatcher.setVolume(volume);
    return message.channel.send(`Volume has been set to: **${volume}**`);
  }
}