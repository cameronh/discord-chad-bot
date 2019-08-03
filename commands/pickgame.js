export const name = 'pickgame';
export const description = 'Randomly selects a game to be played.';
export async function execute(message) {
  const db = message.client.db;
  try {
    const gamesList = await db.get('game-list');
    const numGames = gamesList.titles ? gamesList.titles.length : 0;
    if (numGames > 0) {
      const result = Math.floor(Math.random() * Math.floor(numGames));
      return message.channel.send(`You are playing: ${gamesList.titles[result]}`);
    }
  } catch (error) {
    console.error(error.message);
  }
}