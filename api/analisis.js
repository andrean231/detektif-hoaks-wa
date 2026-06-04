export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const { pesan } = req.body;

    try {
        const payload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "Kamu adalah ahli forensik digital. Tugasmu adalah menganalisis pesan yang diberikan user. Mulai jawabanmu pada baris pertama dengan tag [HOAKS], [PENIPUAN], atau [AMAN] baru berikan alasan."
                },
                {
                    role: "user",
                    content: pesan
                }
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

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}