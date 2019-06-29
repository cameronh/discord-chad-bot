import ytdl from 'ytdl-core';

export const name = 'youtube';
export const description = 'Plays the audio from a specified YouTube URL through a voice connection stream.';
export async function execute(message, args) {
  if (args[0]) {
    if (message.member.voiceChannel) {
      try {
        const voiceConnection = await message.member.voiceChannel.join();
        const stream = ytdl(args[0], { filter: 'audioonly' });
        const dispatcher = voiceConnection.playStream(stream);
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}