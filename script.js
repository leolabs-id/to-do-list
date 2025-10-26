const tanggalSaatIni = new Date();

// Opsi untuk menentukan format yang diinginkan
const opsiFormat = {
    weekday: 'long', 
    day: 'numeric',  
    month: 'long',   
    year: 'numeric'  
};

// Menggunakan 'id-ID' untuk lokalisasi bahasa Indonesia
const formatIndonesia = tanggalSaatIni.toLocaleDateString('id-ID', opsiFormat);

// Menampilkan hasilnya ke elemen HTML
document.getElementById("tampilkanTanggal").innerHTML = formatIndonesia;