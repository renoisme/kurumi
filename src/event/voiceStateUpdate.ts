import { ChannelType, Events, VoiceState, type VoiceBasedChannel } from 'discord.js';

const createChannel = async (state: VoiceState): Promise<void> => {
	if (!state.member || !state.channel) return;

	const channel = await state.guild.channels.create({
		name: `${state.member.user.username}'s Room`,
		parent: state.channel.parent,
		type: ChannelType.GuildVoice,
	});

	await state.member.voice.setChannel(channel);
};

const deleteChannel = async (channel: VoiceBasedChannel): Promise<void> => {
	if (channel.name.includes('Room') && channel.members.size === 0) {
		await channel.delete();
	}
};

export default {
	name: Events.VoiceStateUpdate,
	once: false,
	run: async (oldState: VoiceState, newState: VoiceState) => {
		const createVoiceChannelId = Bun.env.CREATE_VC_CHANNEL_ID;

		if (!createVoiceChannelId) return;

		if (newState.channel && !oldState.channel) {
			if (newState.channel.id === createVoiceChannelId) {
				await createChannel(newState);
			}
		} else if (newState.channel && oldState.channel) {
			await deleteChannel(oldState.channel);
			if (newState.channel.id === createVoiceChannelId) {
				await createChannel(newState);
			}
		} else if (!newState.channel && oldState.channel) {
			await deleteChannel(oldState.channel);
		}
	},
};
