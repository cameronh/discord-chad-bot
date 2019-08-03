export const name = 'addgame';
export const description = 'Adds a game to the list of games available to be played.';
export const usage = '<game title>';
export async function execute(message, args) {
  const db = message.client.db;
  let gameTitle = '';

  if (args.length >= 1) {
    gameTitle = args.join(',').replace(/,/g, ' ');

    try {
      await db.upsert('game-list', (game) => {
        !game.titles ? game.titles = [gameTitle] : game.titles.push(gameTitle);
        return game;
      });

      return message.channel.send(`Added **${gameTitle}** to list of available games.`);
    } catch (error) {
      console.error(error.message);
      return message.channel.send('Please enter a valid game title.');
    }
  }
}