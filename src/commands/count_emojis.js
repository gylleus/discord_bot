const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji_count')
        .setDescription('Counts the usage of emojis in the last n messages.')
        .addIntegerOption(option =>
            option.setName('message_count')
                .setDescription('The amount of messages to count.')
                .setRequired(true)),
    async execute(msg) {
        const messageCount = msg.options.getInteger('message_count');

        var emojiCounter = new Map();
        emojiList = await msg.guild.emojis.fetch();
        console.log("Counting emojis: " + emojiList);
        emojiList.forEach(emoji => {
            emojiCounter.set(emoji.name, 0);
        });

        await msg.deferReply();
        await parseMessages(msg, messageCount, 0, emojiCounter, null);
    },

    // count_emojis: function (msg, messageCount) {
    //     var emojiCounter = new Map();
    //     emojiList = msg.guild.emojis.array();
    //     for (var e in emojiList) {
    //         emojiCounter.set(emojiList[e].name, 0);
    //     }
    //     parseMessages(msg, messageCount, 0, emojiCounter, null);
    // }
}

async function parseMessages(msg, maxMessages, processedMessages, emojiCounter, lastID) {
    if (processedMessages >= maxMessages) {
        console.log("Returning!");
        var result = await makeResults(emojiCounter, maxMessages, msg);

        const chunkSize = 20;

        for (let i = 0; i < result.length; i += chunkSize) {
            messages = result.slice(i, i + chunkSize);

            var message = messages.join("  ");
            msg.channel.send(message);
        }

        // print how many messages in last n messages
        await msg.editReply("Emoji usage last " + maxMessages + " messages:");
        return
    }
    var fetchCount = maxMessages - processedMessages;
    // The API only lets us process 100 messages at a time, so do recursively
    if (fetchCount > 100) {
        fetchCount = 100;
    }
    console.log("Fetching messages. " + maxMessages + " . " + processedMessages);
    if (lastID != null) {
        var opts = { limit: fetchCount, before: lastID }
    } else {
        var opts = { limit: fetchCount }
    }


    var messages = await msg.channel.messages.fetch(opts);



    messages = Array.from(messages.values());
    console.log(messages.size + " messages fetched");

    console.log("messages: " + messages.length);
    messages.forEach(m => {
        if (m.author.username != "Menki Bot") {
            analyzeMessage(m.content, emojiCounter);
        }
    });

    // If less messages left than we requested we have reached the end of the log
    if (messages.length < fetchCount) {
        parseMessages(msg, maxMessages, maxMessages, emojiCounter, messages[messages.length - 1].id);
    } else {
        parseMessages(msg, maxMessages, processedMessages + fetchCount, emojiCounter, messages[messages.length - 1].id);
    }

}

// Prints the usage of each emoji
async function makeResults(emojiCounter, messageCount, ogMessage) {
    console.log("Printing!");
    // ogMessage.reply();
    var entries = emojiCounter.entries();
    // var message = "Emoji usage last " + messageCount + " messages:\n";
    emojiList = await ogMessage.guild.emojis.fetch();

    // list of messages that can be pushed to
    var messageList = [];

    [...entries]
        .sort((a, b) => b[1] - a[1]) // Sort by the value in descending order
        .forEach(([name, count]) => {
            // if (count > 0) {
            var emote = emojiList.find(e => e.name === name);
            console.log(emote.id);
            //ogMessage.channel.sendMessage(emote.toString() + " = " + item[1]);
            // message += emote.toString() + " = " + item[1] + "\t";

            // push to messages
            messageList.push(emote.toString() + " = " + count + "\t");

            // }
        });
    // console.log(message);
    return messageList;
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
        incrementUse(msgEmojis[i].substring(1, msgEmojis[i].length - 1), emojiCounter);
    }
}

function incrementUse(emoji, emojiCounter) {
    if (emojiCounter.has(emoji)) {
        console.log("Incrementing " + emoji + ". Current value " + emojiCounter.get(emoji))
        emojiCounter.set(emoji, emojiCounter.get(emoji) + 1);
    }
    return emojiCounter;
}