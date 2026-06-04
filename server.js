require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Menyajikan file statis (HTML, CSS, JS)
app.use(express.static(__dirname));

// Halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint AI
app.post('/api/analisis', async (req, res) => {
    const { pesan } = req.body;

    try {
        const payload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Kamu adalah ahli forensik digital. Tugasmu adalah menganalisis pesan yang diberikan user. Mulai jawabanmu pada baris pertama dengan tag [HOAKS], [PENIPUAN], atau [AMAN] baru berikan alasan."
                },
                { role: "user", content: pesan }
            ]
        };

        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Server berjalan di http://localhost:${PORT}`)
);