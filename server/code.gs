function doGet() {
    try {
        return HtmlService.createHtmlOutputFromFile('index.html')
            .setTitle('Dashboard Sekolah');
    } catch (e) {
        Logger.log('Error doGet: ' + e);
        return ContentService.createTextOutput('Error: Gagal memuat halaman');
    }
}

function verifyPin(pin) {
    try {
        if (!pin || pin === 'undefined') {
            Logger.log('PIN tidak valid: ' + pin);
            throw new Error('PIN tidak valid');
        }
        const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Ganti dengan ID spreadsheet lu
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Users');
        if (!sheet) {
            Logger.log('Sheet "Users" tidak ditemukan');
            throw new Error('Sheet "Users" tidak ditemukan');
        }
        const data = sheet.getDataRange().getValues();
        Logger.log('Data Users: ' + JSON.stringify(data));
        for (let i = 1; i < data.length; i++) {
            const sheetPin = String(data[i][0]);
            Logger.log('Membandingkan PIN: ' + sheetPin + ' dengan input: ' + pin);
            if (sheetPin === String(pin)) {
                const response = {
                    role: data[i][1] || 'unknown',
                    user: {
                        name: data[i][2] || 'Unknown',
                        photo: data[i][3] || ''
                    }
                };
                Logger.log('PIN cocok, response: ' + JSON.stringify(response));
                return response;
            }
        }
        Logger.log('PIN tidak ditemukan: ' + pin);
        return { role: 'invalid' };
    } catch (e) {
        Logger.log('Error verifyPin: ' + e);
        throw new Error('Gagal verifikasi PIN: ' + e.message);
    }
}

function getGrades() {
    try {
        const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Nilai');
        if (!sheet) throw new Error('Sheet "Nilai" tidak ditemukan');
        const data = sheet.getDataRange().getValues();
        const grades = data.slice(1).map(row => ({
            student: row[0] || '',
            subject: row[1] || '',
            score: row[2] || 0
        }));
        Logger.log('Data nilai dikirim: ' + JSON.stringify(grades));
        return grades;
    } catch (e) {
        Logger.log('Error getGrades: ' + e);
        throw new Error('Gagal mengambil data nilai: ' + e.message);
    }
}

function uploadProfilePic(profileFile) {
    try {
        const folder = DriveApp.getFolderById('YOUR_FOLDER_ID');
        const blob = Utilities.newBlob(profileFile.data, profileFile.mimeType, profileFile.fileName);
        const uploadedFile = folder.createFile(blob);
        return uploadedFile.getUrl();
    } catch (e) {
        Logger.log('Error uploadProfilePic: ' + e);
        throw new Error('Gagal upload foto profil: ' + e.message);
    }
}

function uploadGrades(gradesFile) {
    try {
        const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Nilai');
        sheet.clear();
        const blob = Utilities.newBlob(gradesFile.data, gradesFile.mimeType, gradesFile.fileName);
        const csv = Utilities.parseCsv(blob.getDataAsString());
        sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
    } catch (e) {
        Logger.log('Error uploadGrades: ' + e);
        throw new Error('Gagal upload nilai: ' + e.message);
    }
}

function updateGrade(index, score) {
    try {
        const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Nilai');
        sheet.getRange(index + 2, 3).setValue(score);
    } catch (e) {
        Logger.log('Error updateGrade: ' + e);
        throw new Error('Gagal update nilai: ' + e.message);
    }
}
