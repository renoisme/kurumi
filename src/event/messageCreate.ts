import { Mistral } from '@mistralai/mistralai';
import { Events, Guild, GuildMember, Message, TextChannel } from 'discord.js';

const renoisme = Bun.env.RENOISME || '';
const ruleChannelId = Bun.env.RULE_CHANNEL_ID || '';

const ai = new Mistral({ apiKey: Bun.env.MISTRAL_API_KEY });

let chat = await ai.beta.conversations.start({
	agentId: 'ag_019cfff4305176f28d92162ddfa81b7a',
	inputs: 'こんにちは',
});

function getServerMemberCount(guild: Guild): string {
	return 'サーバー人数は' + guild.memberCount + '人です！';
}

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
