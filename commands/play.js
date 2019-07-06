import ytdl from 'ytdl-core';
import { Util } from 'discord.js';
import Youtube from 'simple-youtube-api';

const youtube = new Youtube(process.env.GOOGLE_API_KEY);

export const name = 'play';
export const description = 'Adds a YouTube URL to the Music Queue.';
export const usage = '<youtube url>';
export async function execute(message, args) {
  const url = args[0];
  if (url) {
    if (message.member.voiceChannel) {
      try {
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();
          for (const video of Object.values(videos)) {
            const videoId = await youtube.getVideoByID(video.id);
            await handleVideo(videoId, message, true);
          }
          return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
        } else {
          const video = await youtube.getVideo(url);
          return handleVideo(video, message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

async function handleVideo(video, msg, playlist = false) {
  const musicQueue = msg.client.musicQueue;
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`,
    added_by: msg.author,
  };
  if (!musicQueue.songs || musicQueue.songs.length === 0) {
    const queue = {
      textChannel: msg.channel,
      voiceChannel: msg.member.voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
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
    if (playlist) return;
    msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
    return await msg.delete();
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
    dispatcher.setVolumeLogarithmic(musicQueue.volume / 25);
    dispatcher.on('end', () => {
      musicQueue.songs.shift();
      play(msg, musicQueue.songs[0]);
    });

    musicQueue.textChannel.send(`🎶 Started playing: **${song.title}**`);
    await msg.delete();
  } catch (error) {
    console.error(error.message);
  }
}