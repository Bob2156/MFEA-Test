const express = require('express');
const bodyParser = require('body-parser');
const nacl = require('tweetnacl');

const app = express();
app.use(bodyParser.json());

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

function verifyRequest(signature, timestamp, body) {
    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature, 'hex'),
        Buffer.from(DISCORD_PUBLIC_KEY, 'hex')
    );
    return isVerified;
}

app.post('/interactions', (req, res) => {
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = JSON.stringify(req.body);

    // Verify Discord request
    if (!verifyRequest(signature, timestamp, rawBody)) {
        return res.status(401).send('Invalid request signature');
    }

    const interaction = req.body;

    if (interaction.type === 1) {
        // Respond to the Ping
        return res.status(200).json({ type: 1 });
    }

    if (interaction.type === 2) {
        // Handle slash command
        const commandName = interaction.data.name;

        if (commandName === 'hello') {
            return res.status(200).json({
                type: 4,
                data: {
                    content: 'Hello from Render!',
                },
            });
        }

        return res.status(200).json({
            type: 4,
            data: {
                content: `Unknown command: ${commandName}`,
            },
        });
    }

    res.status(400).send('Bad Request');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
