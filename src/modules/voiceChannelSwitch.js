module.exports = {
    name: 'voiceChannelSwitch',
    events: {
        voiceChannelSwitch: 'onVoiceChannelSwitch'
    }, onVoiceChannelSwitch: (member, newChannel, oldChannel, jeanne) => {
        let vc = jeanne.voiceConnections.find((c) => c.id === oldChannel.guild.id);
        setTimeout(() => {
            if ((oldChannel.voiceMembers.size === 1) && (vc) && (oldChannel.voiceMembers.has(jeanne.user.id))) {
                jeanne.leaveVoiceChannel(oldChannel.id);
                jeanne.voiceConnections.remove(vc);
            }
        }, 10000);
    }
};
