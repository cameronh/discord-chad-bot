import ytdl from 'ytdl-core';
import { Util } from 'discord.js';
import Youtube from 'simple-youtube-api';
import scdl from 'soundcloud-downloader';
const youtube = new Youtube(process.env.GOOGLE_API_KEY);

export const name = 'play';
export const description = 'Adds a YouTube or SoundCloud URL to the Music Queue.';
export const usage = '<youtube url> | <soundcloud url>';
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
        } else if (url.match(/^https?:\/\/(soundcloud\.com)\/(.*)$/)) {
          const songInfo = await scdl.getInfo(url, process.env.SC_CLIENT_ID);
          const song = await scdl.download(url, process.env.SC_CLIENT_ID);
          await handleSC(song, songInfo, message);
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

async function handleSC(song, songInfo, msg, playlist = false) {
  const musicQueue = msg.client.musicQueue;
  const songMeta = {
    id: songInfo.id,
    title: `${songInfo.title} - ${songInfo.user.username}`,
    url: song,
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

    queue.songs.push(songMeta);

    msg.client.musicQueue = queue;

    try {
      const voiceConnection = await msg.member.voiceChannel.join();
      queue.connection = voiceConnection;
      playSC(msg, queue.songs[0]);
    } catch (error) {
      console.error(error.message);
      delete msg.client.musicQueue;
    }
  } else {
    musicQueue.songs.push(songMeta);
    if (playlist) return;
    msg.channel.send(`✅ **${songMeta.title}** has been added to the queue!`);
    return await msg.delete();
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

async function playSC(msg, song) {
  const musicQueue = msg.client.musicQueue;
  if (!song) {
    musicQueue.voiceChannel.leave();
    return;
  }

  try {
    const dispatcher = await musicQueue.connection.playStream(song.url);
    dispatcher.setVolumeLogarithmic(musicQueue.volume / 25);
    dispatcher.on('end', () => {
      musicQueue.songs.shift();
      playSC(msg, musicQueue.songs[0]);
    });

    musicQueue.textChannel.send(`🎶 Started playing: **${song.title}**`);
    await msg.delete();
  } catch (error) {
    console.error(error);
  }
}

async function play(msg, song) {
  const musicQueue = msg.client.musicQueue;
  if (!song) {
    musicQueue.voiceChannel.leave();
    return;
  }

  try {
    const dispatcher = await musicQueue.connection.playStream(ytdl(song.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }), { highWaterMark: 1 });
    dispatcher.setVolumeLogarithmic(musicQueue.volume / 25);
    dispatcher.on('end', () => {
      musicQueue.songs.shift();
      play(msg, musicQueue.songs[0]);
    });

    musicQueue.textChannel.send(`🎶 Started playing: **${song.title}**`);
    await msg.delete();
  } catch (error) {
    console.error(error);
  }
}