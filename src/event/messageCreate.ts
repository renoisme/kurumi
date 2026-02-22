import { Events, Guild, GuildMember, Message, TextChannel } from 'discord.js';

const renoisme = Bun.env.RENOISME || '';
const ruleChannelId = Bun.env.RULE_CHANNEL_ID || '';

export default {
	name: Events.MessageCreate,
	once: false,
	run: async (message: Message) => {
		if (!message.inGuild()) return;

		const member = message.member as GuildMember;
		const guild = message.guild as Guild;

		if (message.content.startsWith('.')) {
			const channel = member.voice.channel;
			if (!channel) return;

			const arg = message.content.split(' ')[1] || '';
			let number = parseInt(arg, 10);

			if (isNaN(number) || number < 0 || number > 99) return;

			await channel.setUserLimit(number).catch(() => {
				message.react('❌');
			});
		}

		if (!renoisme) return;

		if (message.content === '!verify') {
			const channel = (await guild.channels.fetch(ruleChannelId).catch(null)) as TextChannel;
			if (!channel) {
				message.react('❌');
				return;
			}

			const rule = (await channel.messages.fetchPins()).items[0];

			if (!rule) {
				message.react('❌');
				return;
			}

			await (message.channel as TextChannel).send(rule.message.content).catch(() => {
				message.react('❌');
			});
		}
	},
};
