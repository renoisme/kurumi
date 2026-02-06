import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import path from 'path';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember],
});

const eventsPath = path.join(__dirname, 'event');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

eventFiles.forEach((file) => {
	const filePath = path.join(eventsPath, file);
	console.log(`loading ${file}`);
	import(filePath).then((event) => {
		const eventInstance = event.default;

		if (eventInstance.once) {
			client.once(eventInstance.name, (...args) => eventInstance.run(...args));
		} else {
			client.on(eventInstance.name, (...args) => eventInstance.run(...args));
		}
	});
});

client.login(Bun.env.TOKEN);
