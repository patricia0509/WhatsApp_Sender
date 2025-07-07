const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const app = express();
const port = 3000;

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    // Mulai konfigurasi Express setelah sock siap
    const upload = multer({ dest: 'uploads/' });
    app.use(express.json());

    app.post('/send', async (req, res) => {
        const { nomor, caption, nama_file } = req.body;

        if (!nomor || !caption || !nama_file) {
            return res.status(400).json({ status: 'error', message: 'Nomor, caption, dan nama_file wajib diisi.' });
        }

        const filePath = `./uploads/${nama_file}`;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: 'error', message: `File ${nama_file} tidak ditemukan di folder uploads` });
        }

        try {
            const jid = nomor + '@s.whatsapp.net';
            await sock.sendMessage(jid, {
                image: fs.readFileSync(filePath),
                caption
            });
            res.json({ status: 'success', nomor, caption });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: err.message });
        }
    });

    app.listen(port, () => {
        console.log(`✅ Baileys server running at http://localhost:${port}`);
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("🔄 Scan QR Code ini dengan WhatsApp:");
            require('qrcode-terminal').generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('❌ Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) startSock();
        } else if (connection === 'open') {
            console.log('✅ Connection opened! WhatsApp siap digunakan!');
        }
    });
}

startSock();
