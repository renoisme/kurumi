import { Events, Guild, GuildMember } from 'discord.js';

export default {
	name: Events.GuildMemberAdd,
	once: false,
	run: async (member: GuildMember) => {
		const guild = member.guild as Guild;

		const roleId = Bun.env.MEMBER_ROLE_ID;
		const systemChannel = guild.systemChannel;

		if (!roleId) return;

		const role = await guild.roles.fetch(roleId).catch(null);
		if (!role) {
			if (systemChannel) {
				await systemChannel.send(
					'新しいメンバーが参加しましたが、ロールの設定に問題があります！'
				);
			}
			return;
		}

		const added = member.roles.cache.has(role.id);

		if (!added) {
			try {
				await member.roles.add(role);
			} catch (_e: any) {
				console.error(_e);
			}
		}
	},
};
