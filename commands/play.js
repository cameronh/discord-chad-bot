import ytdl from 'ytdl-core';
import { Util } from 'discord.js';
import Youtube from 'simple-youtube-api';

const youtube = new Youtube(process.env.GOOGLE_API_KEY);

export const name = 'play';
export const description = 'Adds a YouTube URL to the Music Queue.';
export async function execute(message, args) {
  if (args[0]) {
    if (message.member.voiceChannel) {
      try {
        const video = await youtube.getVideo(args[0]);
        return handleVideo(video, message);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

async function handleVideo(video, msg) {
  const musicQueue = msg.client.musicQueue;
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`,
  };
  if (!musicQueue.songs || musicQueue.songs.length === 0) {
    const queue = {
      textChannel: msg.channel,
      voiceChannel: msg.member.voiceChannel,
      connection: null,
      songs: [],
      volume: 0.5,
      playing: true,
    };

    queue.songs.push(song);

    msg.client.musicQueue = queue;

    try {
      const voiceConnection = await msg.member.voiceChannel.join();
      queue.connection = voiceConnection;
      play(msg, queue.songs[0]);
    } catch (error) {
      console.error(error.message);
      delete msg.client.musicQueue;
    }
  } else {
    musicQueue.songs.push(song);
    return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
  }
}

async function play(msg, song) {
  const musicQueue = msg.client.musicQueue;
  if (!song) {
    musicQueue.voiceChannel.leave();
    return;
  }

  try {
    const dispatcher = await musicQueue.connection.playStream(ytdl(song.url, { filter: 'audioonly' }));
    dispatcher.setVolume(musicQueue.volume);
    dispatcher.on('end', () => {
      musicQueue.songs.shift();
      play(msg, musicQueue.songs[0]);
    });

    musicQueue.textChannel.send(`🎶 Started playing: **${song.title}**`);
  } catch (error) {
    console.error(error.message);
  }
}