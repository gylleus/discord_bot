FROM ubuntu

RUN apt update && \
    apt install -y npm

RUN npm install discord.js

RUN mkdir -p /bot
ADD discord_bot /bot/discord_bot
WORKDIR /bot/discord_bot

ENTRYPOINT node src/bot.js