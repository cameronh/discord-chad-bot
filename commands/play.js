import ytdl from 'ytdl-core';

export const name = 'play';
export const description = 'Adds a YouTube URL to the Music Queue.';
export async function execute(message, args) {
  if (args[0]) {
    if (message.member.voiceChannel) {
      try {
        const stream = ytdl(args[0], { filter: 'audioonly' });
        if (stream) {
          /* const voiceConnection = await message.member.voiceChannel.join();
          const dispatcher = voiceConnection.playStream(stream);
          dispatcher.on('end', () => {
            message.member.voiceChannel.leave();
          }); */
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}