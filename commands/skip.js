export const name = 'skip';
export const description = 'Skips the current song in the queue.';
export function execute(message) {
  const musicQueue = message.client.musicQueue;
  if (musicQueue && musicQueue.songs.length === 0) return message.channel.send('There is nothing playing.');
  musicQueue.connection.dispatcher.end('Stopped by input.');
}