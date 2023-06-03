const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Bot successful loaded! Logged as ${client.user.tag}`);
    client.user.setActivity("Blitz - All in one", { type: ActivityType.Playing })
  },
};