function handleLogin(event) {
    event.preventDefault();
    const pin = document.getElementById('pin').value;
    console.log('Memproses login dengan PIN:', pin);

    // Cek apakah Google API tersedia
    if (typeof google === 'undefined') {
        console.warn('Google API tidak tersedia. Pastikan script Google Sign-In dimuat.');
        alert('Google API gagal dimuat. Cek koneksi internet.');
    }

    // Panggil fungsi response untuk validasi PIN
    response(pin)
        .then(result => {
            if (result.success) {
                window.location.href = 'welcome.html';
            } else {
                alert(result.message || 'PIN salah!');
            }
        })
        .catch(error => {
            console.error('Error saat login:', error);
            alert('Gagal login: ' + error.message);
        });
}

function response(pin) {
    return new Promise((resolve, reject) => {
        fetch('https://script.google.com/macros/s/AKfycbxmvqx9JXVYtGQw0kyvvw0wsV3MtgpCb3ZiywKVSOIxvoYlrO0GA5IsFPghMu10-g1S/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: pin }),
            mode: 'cors',
            redirect: 'follow'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Gagal terhubung ke server: ' + res.status);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    resolve({ success: true });
                } else {
                    reject(new Error(data.message || 'PIN salah'));
                }
            })
            .catch(error => {
                console.error('Error saat menghubungi Apps Script:', error);
                reject(error);
            });
    });
}

function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);

    fetch('https://script.google.com/macros/s/AKfycbxmvqx9JXVYtGQw0kyvvw0wsV3MtgpCb3ZiywKVSOIxvoYlrO0GA5IsFPghMu10-g1S/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
        mode: 'cors',
        redirect: 'follow'
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Gagal terhubung ke server: ' + res.status);
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                window.location.href = 'welcome.html';
            } else {
                alert('Gagal login dengan Google: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error verifikasi Google:', error);
            alert('Gagal login: ' + error.message);
        });
}
