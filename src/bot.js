// var Discord = require("discord.js");
var funcs = require("./command_functions.js");
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { token } = require('./config.json');


const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });


bot.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		bot.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



bot.on('ready', () => {
	console.log('I am ready!');
});

bot.login(token);

function handleMessage(msg) {
	if (msg.content.toLowerCase() == "!serve") {
		console.log("Serving");
		funcs.serve(msg);
	}
	if (msg.content.toLowerCase() == "!spooky_skeleton") {
		console.log("Skeletoning");
		funcs.print_skeleton(msg);
	}
	if (msg.content.startsWith("!start_raffle")) {
		var args = msg.content.split(' ');
		if (args.length == 3) {
			var time = parseInt(args[1]) || 0;
			var cookies = parseInt(args[2]) || 0;
			funcs.start_raffle(msg, time, cookies);
		} else {
			msg.channel.sendMessage("Wrong amount of arguments");
		}
	}
	if (msg.content.toLowerCase() == "!raffle") {
		funcs.enter_raffle(msg);
	}
	if (msg.content.toLowerCase() == "!cookies") {
		funcs.cookies(msg, time, cookies);
	}
	if (msg.content.startsWith("!emoji_count")) {
		var args = msg.content.split(' ');
		var amount = 100;
		if (args.length == 2) {
			amount = parseInt(args[1]) || 100;
		}
		funcs.count_emojis(msg, amount);
	}
}
