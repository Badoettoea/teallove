function showPage(pageId) {
    document.querySelectorAll('div[id$="-page"], div[id$="-dashboard"]').forEach(div => div.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pin = document.getElementById('pin').value;
    try {
        const response = await google.script.run.withSuccessHandler(result => result).verifyPin(pin);
        if (response.role === 'user') {
            showPage('user-dashboard');
            loadUserData(response.user);
        } else if (response.role === 'admin') {
            showPage('admin-dashboard');
            loadAdminData();
        } else {
            alert('PIN salah!');
        }
    } catch (error) {
        alert('Gagal login!');
    }
});

async function loadUserData(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('profile-pic').src = user.photo || '/assets/images/placeholder.png';
    const grades = await google.script.run.withSuccessHandler(result => result).getGrades();
    const container = document.getElementById('grades-container');
    container.innerHTML = grades.map(grade => `
        <div class="neumorphic p-4">
            <h4 class="text-teal-800 font-medium">${grade.subject}</h4>
            <p class="text-teal-600">Nilai: ${grade.score}</p>
        </div>
    `).join('');
}

document.getElementById('profile-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const newUrl = await google.script.run.withSuccessHandler(result => result).uploadProfilePic(formData);
            document.getElementById('profile-pic').src = newUrl;
        } catch (error) {
            alert('Gagal upload foto!');
        }
    }
});

async function loadAdminData() {
    const grades = await google.script.run.withSuccessHandler(result => result).getGrades();
    const table = document.getElementById('grades-table');
    table.innerHTML = `
        <table class="w-full text-teal-800">
            <thead>
                <tr>
                    <th class="p-2">Siswa</th>
                    <th class="p-2">Mapel</th>
                    <th class="p-2">Nilai</th>
                </tr>
            </thead>
            <tbody>
                ${grades.map((grade, i) => `
                    <tr>
                        <td class="p-2">${grade.student}</td>
                        <td class="p-2">${grade.subject}</td>
                        <td class="p-2">
                            <input type="number" value="${grade.score}" onchange="updateGrade(${i}, this.value)" class="neumorphic-input p-1 w-full">
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function updateGrade(index, score) {
    try {
        await google.script.run.updateGrade(index, parseInt(score));
    } catch (error) {
        alert('Gagal update nilai!');
    }
}

async function uploadGrades() {
    const file = document.getElementById('grades-upload').files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            await google.script.run.withSuccessHandler(() => loadAdminData()).uploadGrades(formData);
            alert('Nilai berhasil diupload!');
        } catch (error) {
            alert('Gagal upload nilai!');
        }
    }
}

function logout() {
    showPage('login-page');
    document.getElementById('login-form').reset();
}
