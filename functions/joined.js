const { ChannelType } = require("discord.js");
const ChannelModel = require(`./../schemas/channels`); // Import the ChannelModel schema
const { default: mongoose } = require("mongoose");

module.exports = async function joined(newState, oldState, client) {
  const { channel, guild } = newState;
  if (channel) {
    try {
      // Retrieve channel data from the database
      const data = await ChannelModel.findOne({ channelId: channel.id });
      if (data) {
        // Fetch all data with the same type
        const allData = await ChannelModel.find({ type: data.type });

        // Find the highest index
        const highData = allData.reduce((max, current) => {
          return max.index > current.index ? max : current;
        });

        // Compare specific properties of highData and data
        if (
          highData.index === data.index &&
          highData.type === data.type &&
          highData.channelId === data.channelId
        ) {
          let name1; // Declare the variable outside of if-else to be accessible later
          if (data.type === "civ") {
            name1 = "Civilian"; // Assign value based on condition
          } else if (data.type === "ts") {
            name1 = "Traffic Stop"; // Assign value based on condition
          } else if (data.type === "scene") {
            name1 = "Scene"; // Assign value based on condition
          }

          const i = data.index + 1;
          // Create the new channel with the determined name
          const newChannel = await guild.channels.create({
            name: name1 + " " + i,
            type: ChannelType.GuildVoice,
            parent: client.channels.cache.get("1091518774953377895"),
            position: client.channels.cache.get(data.channelId).rawPosition,
          });

          // Store the newly created channel in the database
          await ChannelModel.create({
            _id: new mongoose.Types.ObjectId,
            channelId: newChannel.id,
            type: data.type,
            index: data.index + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
