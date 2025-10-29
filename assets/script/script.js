document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById('loginModal');

    const loginForm =  document.getElementById('login-form');
    const namaInput = document.getElementById('nama');
    const jabatanInput = document.getElementById('jabatan');

    const welcomeNamaDisplay = document.getElementById('welcomeNamaDisplay');
    const userJabatanDisplay = document.getElementById('userJabatanDisplay');

    // PROSES MASUK LOGIN
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



    // TAMPILAN TANGGAL SAAT INI PADA HEADER
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


    // PERUBAHAN PILIHAN TANGGAL PADA FOOTER TASK CARD
    const dateDisplayElement = document.getElementById('taskDateDisplay');
    const dateInputElement = document.getElementById('taskDateInput');

    const formatDateDisplay = (isoDate) => {
        if (!isoDate) return '';
        const dateObj = new Date(isoDate);

        return dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };
        
    if (dateInputElement && dateDisplayElement) {
        const InitialIsoDate = dateInputElement.value;
        const InitialDisplayDate = formatDateDisplay(InitialIsoDate);

        dateDisplayElement.textContent = InitialDisplayDate;

        dateDisplayElement.addEventListener('click', () => {
            dateInputElement.showPicker();
        });

        dateInputElement.addEventListener('change', () => {
            const newIsoDate = event.target.value;
            const newDisplayDate = formatDateDisplay(newIsoDate);
            dateDisplayElement.textContent = newDisplayDate;

            console.log('Data Tanggal Baru:', newIsoDate);
        });

    };

    // MODAL TAMBAH TUGAS BARU
    // 1. Pilih Elemen yang Diperlukan
    const addTaskButton = document.getElementById('addTaskBtn'); // Tombol "Add new task +"
    const newTaskModal = document.getElementById('newTaskModal');
    const cancelNewTaskBtn = document.getElementById('cancelNewTaskBtn');

    // 2. Event Listener untuk MENAMPILKAN Modal
    if (addTaskButton) {
        addTaskButton.addEventListener('click', () => {
            // Hapus class 'hidden' untuk menampilkan modal
            newTaskModal.classList.remove('hidden'); 
            
            // Opsional: Fokuskan langsung ke input judul
            document.getElementById('newTaskTitleInput').focus();
        });
    }

    // 3. Event Listener untuk MENYEMBUNYIKAN Modal (Tombol Batal)
    if (cancelNewTaskBtn) {
        cancelNewTaskBtn.addEventListener('click', () => {
            // Tambahkan class 'hidden' untuk menyembunyikan modal
            newTaskModal.classList.add('hidden');
            
            // Opsional: Reset form saat batal
            document.getElementById('newTaskForm').reset();
        });
    }



});

