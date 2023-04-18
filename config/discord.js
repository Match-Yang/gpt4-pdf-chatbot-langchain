
if (!process.env.DISCORD_APP_ID) {
    throw new Error('Missing Discord app ID in .env file');
}
if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('Missing Discord bot token in .env file');
}

const clientId = process.env.DISCORD_APP_ID ?? '';
const guildId = process.env.DISCORD_TEST_SERVER_ID ?? '';
const token = process.env.DISCORD_BOT_TOKEN ?? '';

export {
    token,
    clientId,
    guildId
};
