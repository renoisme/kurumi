import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
	NoSubscriberBehavior,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { ChannelType, Client, Events } from 'discord.js';
import { join } from 'node:path';

export default {
	name: Events.ClientReady,
	once: true,
	run: async (client: Client) => {
		console.log(`${client.user!.tag}`);

		const guild = await client.guilds.fetch('1243932968150634538').catch(null);
		const vc = await guild.channels.fetch('1489573504729743431').catch(null);

		if (vc && vc.type === ChannelType.GuildVoice) {
			const connection = joinVoiceChannel({
				channelId: vc.id,
				guildId: guild.id,
				adapterCreator: vc.guild.voiceAdapterCreator,
			});

			try {
				await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Pause,
					},
				});

				const resource = createAudioResource(join(__dirname, '../../mata.opus'));

				player.play(resource);
				connection.subscribe(player);

				console.log('VC接続成功');

				player.on(AudioPlayerStatus.Idle, () => {
					const newResource = createAudioResource(join(__dirname, '../../mata.opus'));
					player.play(newResource);
				});
			} catch (_e) {
				console.error(_e);
				connection.destroy();
				console.log('VC接続失敗');
			}
		}
	},
};
