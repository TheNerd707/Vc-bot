// start.js

const ChannelModel = require('./../schemas/channels');

module.exports = async function start(client) {
  const channelsData = [
    { type: "civ", channelId: "1222980432950202510" },
    { type: "ts", channelId: "1223445584774434936" },
    { type: "scene", channelId: "1223445624247029860" }
    // Add more channels if needed
  ];

  // Fetch channels from cache
  const channels = client.channels.cache;

  // Create or update channel data in the database
  try {
    for (const channelData of channelsData) {
      const channel = channels.get(channelData.channelId);
      if (!channel) {
        console.error(`${channelData.type} channel not found!`);
        continue;
      }

      await ChannelModel.findOneAndUpdate(
        { type: channelData.type },
        { channelId: channel.id },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
