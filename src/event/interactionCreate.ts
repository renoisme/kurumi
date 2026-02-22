import { ButtonInteraction, Events } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	once: false,
	run: async (interaction: ButtonInteraction) => {},
};
