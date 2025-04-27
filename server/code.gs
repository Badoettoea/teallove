/**
 * Menangani permintaan GET untuk menampilkan halaman utama
 */
function doGet() {
  try {
    Logger.log('Memuat index.html');
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('Dashboard Sekolah')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    Logger.log('Error doGet: ' + e.toString());
    return ContentService.createTextOutput('Error: Gagal memuat halaman')
        .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Memverifikasi PIN pengguna
 * @param {string} pin - PIN yang akan diverifikasi
 * @return {Object} Objek response berisi role dan data user jika valid
 */
function verifyPin(pin) {
  const responseTemplate = {
    success: false,
    message: '',
    role: '',
    user: {
      name: '',
      photo: ''
    }
  };

  try {
    // Validasi input
    if (typeof pin !== 'string' || pin.trim() === '') {
      responseTemplate.message = 'PIN tidak valid';
      return responseTemplate;
    }

    pin = pin.trim();
    Logger.log('Memverifikasi PIN: ' + pin);

    // Akses spreadsheet
    const spreadsheetId = '1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    if (!spreadsheet) {
      responseTemplate.message = 'Database tidak tersedia';
      return responseTemplate;
    }

    const sheet = spreadsheet.getSheetByName('Users');
    if (!sheet) {
      responseTemplate.message = 'Data pengguna tidak ditemukan';
      return responseTemplate;
    }

    // Baca data
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      responseTemplate.message = 'Data pengguna kosong';
      return responseTemplate;
    }

    // Cari PIN yang cocok
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sheetPin = String(row[0]).trim();

      if (sheetPin === pin) {
        return {
          success: true,
          message: 'Login berhasil',
          role: row[1] ? String(row[1]).trim().toLowerCase() : 'user',
          user: {
            name: row[2] ? String(row[2]).trim() : 'Pengguna',
            photo: row[3] ? String(row[3]).trim() : 'https://via.placeholder.com/80'
          }
        };
      }
    }

    responseTemplate.message = 'PIN tidak ditemukan';
    return responseTemplate;

  } catch (e) {
    Logger.log('Error verifyPin: ' + e.toString());
    responseTemplate.message = 'Terjadi kesalahan server';
    return responseTemplate;
  }
}

/**
 * Mengambil data nilai dari spreadsheet
 * @return {Array} Array berisi data nilai
 */
function getGrades() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA');
    const sheet = spreadsheet.getSheetByName('Nilai');
    
    if (!sheet) {
      throw new Error('Sheet "Nilai" tidak ditemukan');
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];

    return data.slice(1).map(row => ({
      student: row[0] || 'Siswa',
      subject: row[1] || 'Mata Pelajaran',
      score: row[2] || 0,
      gradeId: row[3] || '' // ID unik untuk setiap nilai
    }));

  } catch (e) {
    Logger.log('Error getGrades: ' + e.toString());
    throw new Error('Gagal mengambil data nilai');
  }
}

/**
 * Mengupdate nilai siswa
 * @param {string} gradeId - ID nilai yang akan diupdate
 * @param {number} score - Nilai baru
 */
function updateGrade(gradeId, score) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA');
    const sheet = spreadsheet.getSheetByName('Nilai');
    const data = sheet.getDataRange().getValues();
    
    // Cari baris yang sesuai dengan gradeId
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][3]) === gradeId) {
        sheet.getRange(i + 1, 3).setValue(parseInt(score));
        return;
      }
    }
    
    throw new Error('Data nilai tidak ditemukan');
    
  } catch (e) {
    Logger.log('Error updateGrade: ' + e.toString());
    throw new Error('Gagal mengupdate nilai');
  }
}

/**
 * Mengupload file nilai
 * @param {Object} fileData - Data file yang diupload
 */
function uploadGrades(fileData) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1gf4XpJAP_GsBoHIrTzpDH8vZRZXB6Kfwg_TYsimSEeA');
    let sheet = spreadsheet.getSheetByName('Nilai');
    
    // Jika sheet tidak ada, buat baru
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Nilai');
    } else {
      sheet.clear();
    }

    // Set header
    sheet.getRange(1, 1, 1, 4).setValues([['Siswa', 'Mata Pelajaran', 'Nilai', 'ID']]);
    
    // Generate unique ID untuk setiap baris
    const csvData = Utilities.parseCsv(fileData.contents);
    const rowsWithId = csvData.map((row, index) => {
      return [...row, Utilities.getUuid()];
    });
    
    sheet.getRange(2, 1, rowsWithId.length, 4).setValues(rowsWithId);
    
  } catch (e) {
    Logger.log('Error uploadGrades: ' + e.toString());
    throw new Error('Gagal mengupload nilai');
  }
}

/**
 * Mengupload foto profil
 * @param {Object} fileData - Data file foto
 * @return {string} URL foto yang diupload
 */
function uploadProfilePic(fileData) {
  try {
    const folder = DriveApp.getFolderById('1dqeG7I3JZ15QyXdaPeavWFdt8joMdfaG');
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData.contents.split(',')[1]),
      fileData.mimeType,
      fileData.filename
    );
    
    const file = folder.createFile(blob);
    return file.getUrl();
    
  } catch (e) {
    Logger.log('Error uploadProfilePic: ' + e.toString());
    throw new Error('Gagal mengupload foto profil');
  }
}
