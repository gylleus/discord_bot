module.exports = {
    count_emojis : function (msg, messageCount) {
        var emojiCounter = new Map();
        emojiList = msg.guild.emojis.array();
        for (var e in emojiList) {
            emojiCounter.set(emojiList[e].name, 0);
        }
        parseMessages(msg, messageCount, 0, emojiCounter, null);
    }
}

function parseMessages(msg, maxMessages, processedMessages, emojiCounter,lastID) {
    if (processedMessages >= maxMessages) {
        console.log("Returning!");
        printResults(emojiCounter, maxMessages, msg);
        return
    }
    var fetchCount = maxMessages - processedMessages;
    // The API only lets us process 100 messages at a time, so do recursively
    if (fetchCount > 100) {
        fetchCount = 100;
    }
    console.log("Fetching messages. "+ maxMessages + " . " + processedMessages);
    if (lastID != null) {
        var opts = { limit: fetchCount, before: lastID }
    } else {
        var opts = { limit: fetchCount }
    }
    msg.channel.fetchMessages(opts)
    .then(function(messages){ 
        var arr = messages.array();
        console.log("messages: " + arr.length);
        for (var m in arr) {
            if (arr[m].author.username != "Menki Bot") {
                analyzeMessage(arr[m].content, emojiCounter);
            }
        }
        // If less messages left than we requested we have reached the end of the log
        if (arr.length < fetchCount) {
            parseMessages(msg, maxMessages, maxMessages, emojiCounter, arr[arr.length-1].id);
        } else {
            parseMessages(msg, maxMessages, processedMessages+fetchCount, emojiCounter, arr[arr.length-1].id);
        }
    })
    .catch(console.error);
}

// Prints the usage of each emoji
function printResults(emojiCounter, messageCount, ogMessage) {
    console.log("Printing!");
    ogMessage.reply("Emoji usage last " + messageCount + " messages:\n");
    var entries = emojiCounter.entries();
    var message = "";
    for (let item of entries) {
        var emote = ogMessage.guild.emojis.find("name", item[0]);
        console.log(emote.id);
        //ogMessage.channel.sendMessage(emote.toString() + " = " + item[1]);
        message += emote.toString() + " = " + item[1] + "\t";
    }
    ogMessage.channel.sendMessage(message);
}

function analyzeMessage(msg, emojiCounter) {
    var emojiRegex = /:[A-Za-z1-9_-]*:/g;
    var msgEmojis = msg.match(emojiRegex);
    if (msgEmojis == null) {
        return null;
    }
    for (var i = 0; i < msgEmojis.length; i++) {
        console.log(msgEmojis[i]); 
        // Substring to remove colons
        incrementUse(msgEmojis[i].substring(1,msgEmojis[i].length-1), emojiCounter);   
    }
}

function incrementUse(emoji, emojiCounter) {
    if (emojiCounter.has(emoji)) {
        console.log("Incrementing " + emoji + ". Current value " + emojiCounter.get(emoji))
        emojiCounter.set(emoji, emojiCounter.get(emoji)+1);    
    }
    return emojiCounter;
}