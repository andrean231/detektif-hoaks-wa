require('dotenv').config(); // Membaca file .env
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint untuk menerima request dari HTML
app.post('/api/analisis', async (req, res) => {
    const { pesan } = req.body;

    try {
        const payload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Kamu adalah analis forensik digital. Klasifikasikan pesan ke salah satu kategori berikut: [HOAKS] Informasi palsu, berita bohong, rumor, atau klaim yang tidak memiliki dasar fakta yang jelas. [PENIPUAN] Pesan yang bertujuan menipu, mencuri data, meminta uang, mengarahkan ke link phishing, undian palsu, investasi bodong, atau modus scam lainnya. [AMAN] Pesan yang terlihat normal dan tidak menunjukkan indikasi hoaks maupun penipuan. WAJIB: - Pilih hanya satu label. - Tulis label pada baris pertama. - Setelah label, jelaskan alasan secara singkat."
                },
                { role: "user", content: pesan }
            ]
        };

        // Mengambil API KEY dari file .env secara AMAN
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}` 
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));