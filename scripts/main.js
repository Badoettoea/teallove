// Fungsi untuk handle login dengan PIN
function handleLogin(event) {
    event.preventDefault();
    const pin = document.getElementById('pin').value;
    console.log('Memproses login dengan PIN:', pin);

    // Cek apakah google tersedia
    if (typeof google === 'undefined') {
        console.error('Google API tidak tersedia. Cek script di index.html.');
        alert('Gagal login: Google API tidak dimuat.');
        return;
    }

    // Contoh fungsi response (ganti sesuai kebutuhan)
    response(pin).then(result => {
        if (result.success) {
            window.location.href = 'welcome.html';
        } else {
            alert('PIN salah!');
        }
    }).catch(error => {
        console.error('Error saat login:', error);
        alert('Gagal login: ' + error.message);
    });
}

// Fungsi response (contoh, sesuaikan dengan backend atau Google API)
function response(pin) {
    return new Promise((resolve, reject) => {
        // Contoh: validasi PIN sederhana (ganti dengan logika asli)
        if (pin === '12345') {
            resolve({ success: true });
        } else {
            reject(new Error('PIN salah'));
        }
        // Kalo pake Google, contoh:
        // google.accounts.id.initialize({ client_id: 'YOUR_CLIENT_ID' });
        // google.accounts.id.prompt();
    });
}

// Fungsi untuk handle Google Sign-In
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Kirim token ke backend untuk verifikasi (contoh)
    fetch('/verify-google-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'welcome.html';
        } else {
            alert('Gagal login dengan Google');
        }
    })
    .catch(error => {
        console.error('Error verifikasi Google:', error);
        alert('Gagal login: ' + error.message);
    });
}
