document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById('loginModal');

    const loginForm =  document.getElementById('login-form');
    const namaInput = document.getElementById('nama');
    const jabatanInput = document.getElementById('jabatan');

    const welcomeNamaDisplay = document.getElementById('welcomeNamaDisplay');
    const userJabatanDisplay = document.getElementById('userJabatanDisplay');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nama = namaInput.value.trim();
            const jabatan = jabatanInput.value.trim();

            console.log('Nama:', nama);
            console.log('Jabatan:', jabatan);

            welcomeNamaDisplay.textContent = `Welcome back, ${nama}`;
            userJabatanDisplay.textContent = jabatan;

            if (loginModal) {
                loginModal.classList.add('hidden');
            }

        });
    } else {
        console.error('Form login tidak ditemukan.');
    }
});