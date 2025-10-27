document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById('loginModal');

    const loginForm =  document.getElementById('login-form');
    const namaInput = document.getElementById('nama');
    const jabatanInput = document.getElementById('jabatan');

    const welcomeNamaDisplay = document.getElementById('welcomeNamaDisplay');
    const userJabatanDisplay = document.getElementById('userJabatanDisplay');


    // Proses Login
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

    // Tampilkan tanggal
    const tampilTanggal = document.getElementById('tampilTanggal');
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];
    const formatIndDate = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const IndoDateString = today.toLocaleDateString('id-ID', formatIndDate);
    tampilTanggal.textContent = `${IndoDateString}`;


    const prioritySelectors = document.querySelectorAll('.task-priority-select');
    const allPriorityClasses = ['high-priority', 'medium-priority', 'low-priority'];

    prioritySelectors.forEach((selector) => {
        // Hapus semua kelas prioritas sebelumnya
        selector.classList.add(selector.value);

        selector.addEventListener('change', () => {
            const selectedPriority = selector.value;
            selector.classList.remove(...allPriorityClasses);
            selector.classList.add(selectedPriority);
            console.log(`Prioritas terpilih: ${selectedPriority}`);
        });
            

    });



});

