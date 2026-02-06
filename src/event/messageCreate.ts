import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Events,
	Message,
	TextChannel,
} from 'discord.js';

export default {
	name: Events.MessageCreate,
	once: false,
	run: async (message: Message) => {
		const renoisme = Bun.env.RENOSIME;
		const ruleMessageChannelId = Bun.env.RULE_MESSAGE_CHANNEL_ID;

		if (!message.guild || !renoisme || !ruleMessageChannelId) return;

		if (message.content === '!verify') {
			const ruleChannel = (await message.guild.channels
				.fetch(ruleMessageChannelId)
				.catch(null)) as TextChannel;

			if (!ruleChannel || !ruleChannel.lastMessageId) {
				message.react('❌');
				return;
			}

			const ruleMessage = await ruleChannel.messages
				.fetch(ruleChannel.lastMessageId)
				.catch(null);

			if (!ruleMessage || ruleMessage.content.length === 0) {
				message.react('❌');
				return;
			}

			(message.channel as TextChannel).send({
				content: ruleMessage.content,
				components: [
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setCustomId('verify')
							.setLabel('上記のルールに同意する')
							.setStyle(ButtonStyle.Success)
					),
				],
			});
		}
	},
};
