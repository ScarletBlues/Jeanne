module.exports = {
    handler(client, member, newChannel, oldChannel) {
        let vc = client.voiceConnections.find((vc) => vc.id === oldChannel.guild.id);
        setTimeout(() => {
            if ((oldChannel.voiceMembers.size === 1) && (vc) && (oldChannel.voiceMembers.has(client.user.id))) {
                client.leaveVoiceChannel(oldChannel.id);
                client.voiceConnections.remove(vc);
            }
        }, 10000);
    }
};