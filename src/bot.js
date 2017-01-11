var Discord = require("discord.js");
var funcs = require("./command_functions.js");
var bot = new Discord.Client();

bot.on("message", msg => {
	if(msg.content.startsWith("!")) {
    	handleMessage(msg);	
	}
});

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.login("TOKEN");

function handleMessage(msg) {
	if (msg.content.toLowerCase() == "!serve") {
		funcs.serve(msg);
    }
    if (msg.content.toLowerCase() == "!spooky_skeleton") {
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
}
