import { Client, Events } from 'discord.js';

export default {
	name: Events.ClientReady,
	once: true,
	run: async (client: Client) => {
		console.log(`${client.user!.tag}`);
	},
};
