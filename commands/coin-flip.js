export const name = 'coinflip';
export const description = 'Flips a coin. Heads or Tails.';
export function execute(message) {
  const result = Math.floor(Math.random() * 2);
  return message.channel.send(`${result ? '**(Heads)**' : '**(Tails)**'}`);
}