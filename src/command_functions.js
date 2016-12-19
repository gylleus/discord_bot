var raffle = require("./raffle.js");

module.exports = {

	serve : function(msg) {
		var members = msg.channel.members;
		var serverer = msg.author.username;

		var serveTargets = [];
		var cannotBeServed = ["znigeln", "Menki Bot"];

		members.forEach(function(key, entry, lel) {
			if (cannotBeServed.indexOf(key.user.username) == -1) {
				serveTargets.push(key.user.username);
			}
	    })
	    var served = serveTargets[Math.floor(Math.random() * serveTargets.length)];
	    served = served == serverer ? "himself" : served;
	    msg.channel.sendMessage(serverer + " served " + served + "!");	
	},

	print_skeleton : function(msg) {
		msg.channel.sendMessage("—————————— \n \
▒▒▒░░░░░░░░░░▄▐░░░░ 	\n \
▒░░░░░░▄▄▄░░▄██▄░░░ 	\n \
░░░░░░▐▀█▀▌░░░░▀█▄░ 	\n \
░░░░░░▐█▄█▌░░░░░░▀█▄ 	\n \
░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀ 	\n \
░░░░░▄▄▄██▀▀▀▀░░░░░ 	\n \
░░░░█▀▄▄▄█░▀▀░░░░░░ 	\n \
░░░░▌░▄▄▄▐▌▀▀▀░░░░░ 	\n \
░▄░▐░░░▄▄░█░▀▀░░░░░ 	\n \
░▀█▌░░░▄░▀█▀░▀░░░░░ 	\n \
░░░░░░░░▄▄▐▌▄▄░░░░░ 	\n \
░░░░░░░░▀███▀█░▄░░░	 	\n \
░░░░░░░▐▌▀▄▀▄▀▐▄░░░ 	\n \
░░░░░░░▐▀░░░░░░▐▌░░ 	\n \
░░░░░░░█░░░░░░░░█░░ 	\n \
░░░░░░▐▌░░░░░░░░░█░ 	\
	");
	},
	start_raffle : function(msg, time, cookies) {
		raffle.start_raffle(msg,time,cookies);
	},
	enter_raffle : function(msg) {
		raffle.add_to_raffle(msg);
	},
	cookies : function(msg) {
		raffle.check_cookies(msg);
	}
};
