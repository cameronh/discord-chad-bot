export const name = 'stop';
export const description = 'Stops the current song from playing and clears the queue.';
export function execute(message) {
  const musicQueue = message.client.musicQueue;
  if (!message.member.voiceChannel) return;
  if (!musicQueue.songs.length) return;
  musicQueue.songs = [];
  musicQueue.connection.dispatcher.end('Stopped by input.');
  return;
}