const { Client } = require('discord.js');
const config = require('dotenv').config();
const client = new Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
});

