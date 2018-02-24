module.exports = {
    name: 'voiceChannelLeave',
    events: {
        voiceChannelLeave: 'onVoiceChannelLeave'
    }, onVoiceChannelLeave: (member, oldChannel, jeanne) => {
        let vc = jeanne.voiceConnections.find((vc) => vc.id === oldChannel.guild.id);
        setTimeout(() => {
            if ((oldChannel.voiceMembers.size === 1) && (vc) && (oldChannel.voiceMembers.has(jeanne.user.id))) {
                jeanne.leaveVoiceChannel(oldChannel.id);
                jeanne.voiceConnections.remove(vc);
            }
        }, 10000);
    }
};
