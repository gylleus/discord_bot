var cookiesList = new Map();
var prize = 0;
var enteredUsers = [];
var initiatingMessage;

var raffleRunning = false;

module.exports = {

	start_raffle : function(msg, time, cookies) {
		if (raffleRunning) {
			msg.channel.sendMessage("Raffle already in progress.");
		} else {
			raffleRunning = true;
			msg.channel.sendMessage("Started a raffle for " + cookies + " cookies!\n\
Raffle will end in " + time/1000 + " seconds.");
			enteredUsers = [];
			prize = cookies;
			initiatingMessage = msg;
			setTimeout(finish_raffle, time);	
		}
	},

	add_to_raffle : function(msg) {
		if (raffleRunning) {
			var enteringName = msg.author.username;
			enteredUsers.push(enteringName);
			check_exists(enteringName);
			msg.channel.sendMessage("Entered " + enteringName + " to raffle.");	
		} else {
			msg.channel.sendMessage("No raffle currently running.");
		}
	},

	check_cookies : function(msg) {
		var asker = msg.author.username;
		check_exists(asker);
		msg.channel.sendMessage(asker + " has " + cookiesList.get(asker) + " cookies.");
	}
};


function finish_raffle() {
	if (enteredUsers.length == 0) {
		initiatingMessage.channel.sendMessage("No one entered raffle.");
	} else {
		var winner = enteredUsers[Math.floor(Math.random() * enteredUsers.length)];
		var currentCookies = cookiesList.get(winner);
		cookiesList.set(winner,currentCookies + prize);
		initiatingMessage.channel.sendMessage(winner + " won the raffle of " + prize + " cookies!");
	}
	raffleRunning = false;
}

function check_exists(name) {
	if (!cookiesList.has(name)) {
		cookiesList.set(name,0);
	}
}