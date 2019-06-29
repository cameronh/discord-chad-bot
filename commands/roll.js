export const name = 'roll';
export const description = 'Returns a random number between 1 and X. Defaults to 1-100 if no arguments provided';
export function execute(message, args) {
  let min = 1;
  let max = 100;
  
  if (args[0]) {
    max = parseInt(args[0]);
    if (isNaN(max) || max <= 1) max = 100;
  }

  const result = Math.floor(Math.random() * max) + min;

  return message.channel.send(`Result: **${result}** _(${min}-${max})_`);
}