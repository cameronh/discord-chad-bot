export const name = 'roll';
export const description = 'Returns a random number between A and B. Defaults to 1-100 if no arguments provided';
export function execute(message, args) {
  let min = 1;
  let max = 100;

  if (args[0]) {
    if (args[1]) {
      min = parseInt(args[0]);
      if (isNaN(min) || min < 0) min = 1;

      max = parseInt(args[1]);
      if (isNaN(max) || max <= min) max = 100;
    } else {
      max = parseInt(args[0]);
      if (isNaN(max) || max <= 1) max = 100;
    }
  }

  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  return message.channel.send(`Result: **${result}** _(${min}-${max})_`);
}