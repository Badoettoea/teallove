function doGet() {
    return HtmlService.createHtmlOutputFromFile('index.html')
        .setTitle('Dashboard Sekolah');
}

function verifyPin(pin) {
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
}

function getGrades() {
    const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
    const data = sheet.getDataRange().getValues();
    return data.slice(1).map(row => ({
        student: row[0],
        subject: row[1],
        score: row[2]
    }));
}

function uploadProfilePic(file) {
    const folder = DriveApp.getFolderById('1dqeG7I3JZ15QyXdaPeavWFdt8joMdfaG');
    const blob = Utilities.newBlob(file.data, file.mimeType, file.fileName);
    const file = folder.createFile(blob);
    return file.getUrl();
}

function uploadGrades(file) {
    const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
    sheet.clear();
    const blob = Utilities.newBlob(file.data, file.mimeType, file.fileName);
    const csv = Utilities.parseCsv(blob.getDataAsString());
    sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
}

function updateGrade(index, score) {
    const sheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA').getSheetByName('Nilai');
    sheet.getRange(index + 2, 3).setValue(score);
}
