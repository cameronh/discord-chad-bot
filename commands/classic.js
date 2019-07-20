import countdown from 'countdown';

export const name = 'classic';
export const description = 'Shows the remaining time until WoW classic releases(Not soon enough).';
export function execute(message) {
  const release = new Date(2019, 7, 27, 0, 0, 0);
  const nameRelease = new Date(2019, 7, 13, 0, 0, 0);
  const diffTime = countdown(Date.now().toString(), release, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS);
  const diffTimeName = countdown(Date.now().toString(), nameRelease, countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS);

  message.channel.send(`WoW: Classic Name Reserve in: **${diffTimeName.days}** Days **${diffTimeName.hours}** Hours **${diffTimeName.minutes}** Minutes **${diffTimeName.seconds}** Seconds.`);
  message.channel.send(`WoW: Classic Releases in: **${diffTime.days}** Days **${diffTime.hours}** Hours **${diffTime.minutes}** Minutes **${diffTime.seconds}** Seconds.`);
}