import { ButtonInteraction, Events, GuildMember, MessageFlags } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	once: false,
	run: async (interaction: ButtonInteraction) => {
		const verifyedRoleId = Bun.env.VERIFIED_ROLE_ID;

		if (
			!interaction.isButton() ||
			!interaction.guild ||
			!verifyedRoleId ||
			interaction.customId !== 'verify'
		) {
			return;
		}

		const role = await interaction.guild.roles.fetch(verifyedRoleId).catch(null);
		const member = interaction.member as GuildMember;

		if (!role) {
			interaction.reply({
				content: 'ロールが見つかりませんでした、サーバー管理者にお問い合わせください',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const verifyed = member.roles.cache.has(role.id);

		if (verifyed) {
			interaction.reply({
				content: 'すでにルールに同意しています',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		try {
			await member.roles.add(role);
			interaction.reply({
				content: 'ルールに同意しました',
				flags: MessageFlags.Ephemeral,
			});
		} catch (error: any) {
			console.error(error);
			interaction.reply({
				content: 'エラーが発生しました、サーバー管理者にお問い合わせください',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};
