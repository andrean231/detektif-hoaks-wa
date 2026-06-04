async function analisisPesan() {
    const pesan = document.getElementById('pesanInput').value.trim();
    const btnAnalisis = document.getElementById('btnAnalisis');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const resultStatusTitle = document.getElementById('resultStatusTitle');

    if (!pesan) {
        alert('Silakan masukkan teks pesan terlebih dahulu!');
        return;
    }

    btnAnalisis.disabled = true;
    loadingIndicator.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        // MENGHUBUNGI SERVER BACKEND SENDIRI (API Key tersembunyi di sana)
        const response = await fetch('http://localhost:3000/api/analisis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesan: pesan })
        });

        if (!response.ok) throw new Error('Gagal memproses data di server.');

        const data = await response.json();
        let aiResponse = data.choices[0].message.content.trim();

        let cleanResponse = aiResponse.replace('[HOAKS]', '').replace('[PENIPUAN]', '').replace('[AMAN]', '').trim();
        resultText.textContent = cleanResponse;
        
        const upperResponse = aiResponse.toUpperCase();
        if (upperResponse.startsWith('[HOAKS]')) {
            resultBox.className = "mt-6 p-6 rounded-xl border-2 bg-red-50 border-red-200 text-red-900";
            resultStatusTitle.innerHTML = "⚠️ Terindikasi Bahaya / Hoaks";
        } else if (upperResponse.startsWith('[PENIPUAN]')) {
            resultBox.className = "mt-6 p-6 rounded-xl border-2 bg-amber-50 border-amber-200 text-amber-900";
            resultStatusTitle.innerHTML = "🛑 Terindikasi Penipuan";
        } else {
            resultBox.className = "mt-6 p-6 rounded-xl border-2 bg-green-50 border-green-200 text-green-900";
            resultStatusTitle.innerHTML = "✅ Terindikasi Aman / Fakta";
        }

        resultBox.classList.remove('hidden');
    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    } finally {
        btnAnalisis.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
}