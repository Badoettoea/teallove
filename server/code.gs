function doGet() {
    return HtmlService.createHtmlOutputFromFile('index.html')
        .setTitle('Dashboard Sekolah');
}

function verifyPin(pin) {
    try {
        const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Users');
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === pin) {
                return {
                    role: data[i][1],
                    user: { name: data[i][2], photo: data[i][3] }
                };
            }
        }
        return { role: 'invalid' };
    } catch (e) {
        Logger.log('Error verifyPin: ' + e);
        throw new Error('Gagal verifikasi PIN');
    }
}

function getGrades() {
    try {
        const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
        const data = sheet.getDataRange().getValues();
        return data.slice(1).map(row => ({
            student: row[0],
            subject: row[1],
            score: row[2]
        }));
    } catch (e) {
        Logger.log('Error getGrades: ' + e);
        throw new Error('Gagal mengambil data nilai');
    }
}

function uploadProfilePic(profileFile) {
    try {
        const folder = DriveApp.getFolderById('1dqeG7I3JZ15QyXdaPeavWFdt8joMdfaG');
        const blob = Utilities.newBlob(profileFile.data, profileFile.mimeType, profileFile.fileName);
        const uploadedFile = folder.createFile(blob);
        return uploadedFile.getUrl();
    } catch (e) {
        Logger.log('Error uploadProfilePic: ' + e);
        throw new Error('Gagal upload foto profil');
    }
}

function uploadGrades(gradesFile) {
    try {
        const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
        sheet.clear();
        const blob = Utilities.newBlob(gradesFile.data, gradesFile.mimeType, gradesFile.fileName);
        const csv = Utilities.parseCsv(blob.getDataAsString());
        sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
    } catch (e) {
        Logger.log('Error uploadGrades: ' + e);
        throw new Error('Gagal upload nilai');
    }
}

function updateGrade(index, score) {
    try {
        const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
        sheet.getRange(index + 2, 3).setValue(score);
    } catch (e) {
        Logger.log('Error updateGrade: ' + e);
        throw new Error('Gagal update nilai');
    }
}
