const ChannelModel = require(`./../schemas/channels`);

module.exports = async function left(newState, oldState, client) {
  const { guild, channel, member } = oldState;
  if (channel) {
    const data = await ChannelModel.findOne({ channelId: channel.id });
    if (data) {
      if (channel.members.size < 1) {
        const allData = await ChannelModel.find({ type: data.type });
        for (const channelData of allData) {
          if (channelData.index > data.index) {
            // Decrease the index of channels with an index higher than the current channel's index
            await ChannelModel.updateOne(
              { _id: channelData._id },
              { $inc: { index: -1 } } // Decrement index by 1
            );
            let name1; // Declare the variable outside of if-else to be accessible later
            if (data.type === "civ") {
              name1 = "Civilian"; // Assign value based on condition
            } else if (data.type === "ts") {
              name1 = "Traffic Stop"; // Assign value based on condition
            } else if (data.type === "scene") {
              name1 = "Scene"; // Assign value based on condition
            } else if (data.type === 'mod') {
                name1 = "Mod Scene"; // Assign value based on condition
            }
            // Update the name of the associated Discord channel
            const associatedChannel = guild.channels.cache.get(channelData.channelId);
            if (associatedChannel) {
              await associatedChannel.setName(`${name1} ${channelData.index - 1}`);
            }
          }
        }

        // Delete the old data
        await ChannelModel.deleteOne({ _id: data._id });

        // Delete the associated Discord channel
        const associatedChannelToDelete = guild.channels.cache.get(data.channelId);
        if (associatedChannelToDelete) {
          await associatedChannelToDelete.delete();
        }
      }
    }
  }
};
