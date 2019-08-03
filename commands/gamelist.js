import Discord from 'discord.js';

export const name = 'gamelist';
export const description = 'Displays the list of available games to play.';
export async function execute(message) {
  const db = message.client.db;

  try {
    const gamesList = await db.get('game-list');
    const games = gamesList.titles ? gamesList.titles : null;
    const gamesEmbed = new Discord.RichEmbed();

    gamesEmbed.setColor('#0099ff');
    gamesEmbed.setAuthor('Available Games');
    if (games) {
      games.forEach(game => {
        gamesEmbed.addField(`**${game}**`, '✔');
      });

      return message.channel.send(gamesEmbed);
    }
  } catch (error) {
    console.error(error.message);
  }
}