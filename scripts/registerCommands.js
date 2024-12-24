const fetch = require('node-fetch');

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
    {
        name: 'hello',
        description: 'Says hello!',
    },
];

(async () => {
    const response = await fetch(`https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands),
    });

    const data = await response.json();
    console.log(data);
})();
