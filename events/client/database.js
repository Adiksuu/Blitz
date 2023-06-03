const { Events } = require('discord.js');
const { mongoose } = require('mongoose');
require("dotenv").config();

const BOT_DATABASE_URL = process.env.BOT_DATABASE_URL

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      await mongoose.connect(BOT_DATABASE_URL);
      console.log(`✅ Bot database successful connected! Logged as ${client.user.tag}`);
    } catch (error) {
      console.error('💢 Error with database connection!:', error.message);
    }
  },
};
