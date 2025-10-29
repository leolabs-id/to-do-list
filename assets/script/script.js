// UTILITY FUNCTIONS UNTUK MANAJEMEN DATA TUGAS
console.log(`Todo App Script Loaded Successfully.`);

const toDoData =[];
const inProgressData =[];
const doneData =[];

const taskBoardData = {
    todo: toDoData,
    inprogress: inProgressData,
    done: doneData
}


let globalTaskIdCounter = 0;
// MENGHASILKAN TASK-ID UNIK
const generateUniqueId = () => {
    globalTaskIdCounter++;
    return `TASK-${globalTaskIdCounter.toString().padStart(3, '0')}`;
};

// MENAMBAH TUGAS BARU
const addNewTask = (title, desc, dueDate, priority) => {
    const taskId = generateUniqueId(); // ID unik otomatis
    
    // Buat objek tugas baru dengan struktur lengkap
    const newTask = {
        id: taskId,
        title: title,
        description: desc,
        dueDate: dueDate,
        priority: priority,
        status: 'todo',        // Status awal adalah 'todo'
        isCompleted: false
    };
    
    toDoData.push(newTask); // Tambahkan tugas baru ke array To Do
    
    // Konfirmasi di console log
    console.log(`✅ Tugas baru ditambahkan: ${title} (ID: ${taskId})`);
    console.log(`Array To Do memiliki ${toDoData.length} tugas.`);
};

// Menghapus semua tugas dari semua kolom
const clearAllTasks = () => {
    // Kunci: Mengatur properti length dari array menjadi 0
    toDoData.length = 0; 
    inProgressData.length = 0;
    doneData.length = 0;
    
    console.log("🔥 Semua data tugas berhasil dihapus dari semua kolom.");
    console.log(`To Do: ${toDoData.length}, In Progress: ${inProgressData.length}, Done: ${doneData.length}`);
};


// MENGHAPUS TUGAS BERDASARKAN ID
const deleteTaskById = (taskId) => {
    let taskFoundAndDeleted = false; // Penanda apakah tugas ditemukan dan dihapus
    const allTaskArrays = [toDoData, inProgressData, doneData]; // Array dari semua array tugas

    // Iterasi melalui setiap array status
    for (const dataArray of allTaskArrays) {

        const initialLength = dataArray.length;
        
        // Temukan indeks tugas yang akan dihapus
        const indexToDelete = dataArray.findIndex(task => task.id === taskId);

        if (indexToDelete !== -1) {
            // Jika tugas ditemukan, gunakan splice untuk menghapusnya
            // splice(posisi, jumlah yang dihapus)
            dataArray.splice(indexToDelete, 1); 
            taskFoundAndDeleted = true;
            
            console.log(`✅ Tugas dengan ID ${taskId} berhasil dihapus dari kolom.`);
            // Karena ID unik, kita bisa berhenti setelah ditemukan
            break; 
        }
    }

    if (!taskFoundAndDeleted) {
        console.warn(`❌ Gagal menghapus: Tugas dengan ID ${taskId} tidak ditemukan di task board.`);
    }
};



// MENGUBAH STATUS TUGAS BERDASARKAN ID
const changeTaskStatus = (taskId, newStatus) => {
    let taskObject = null;
    let sourceArrayKey = null;

    // mencari tugas berdasarkan ID di semua array status
    for (const statusKey in taskBoardData) {
        const currentArray = taskBoardData[statusKey];
        
        // Cari indeks tugas berdasarkan ID
        const index = currentArray.findIndex(task => task.id === taskId);
        
        if (index !== -1) {
            // Jika ditemukan, hapus dari array sumber dan simpan objek tugas
            taskObject = currentArray.splice(index, 1)[0]; 
            sourceArrayKey = statusKey;
            break; // Tugas ditemukan, keluar dari perulangan
        }
    }

    if (!taskObject) {
        console.warn(`❌ Tugas dengan ID ${taskId} tidak ditemukan di Task Board.`);
        return;
    }
    
    // perbarui status tugas dan isCompleted
    taskObject.status = newStatus;
    // Otomatis tandai sebagai selesai (isCompleted = true) jika dipindahkan ke 'done'
    taskObject.isCompleted = (newStatus === 'done'); 

    // tambahkan tugas ke array tujuan
    const destinationArray = taskBoardData[newStatus];
    destinationArray.push(taskObject);

    console.log(`✅ Tugas ${taskId} dipindahkan dari ${sourceArrayKey} ke ${newStatus}.`);
};


// MEMPERBARUI PROPERTI TUGAS BERDASARKAN ID
const updateTaskPropertyById = (taskId, propertyName, newValue) => {
    let taskFound = false;

    // Iterasi melalui setiap array status (todo, inprogress, done)
    for (const statusKey in taskBoardData) {
        const currentArray = taskBoardData[statusKey];
        
        // Gunakan findIndex untuk mencari objek yang tepat
        const index = currentArray.findIndex(task => task.id === taskId);

        if (index !== -1) {
            // Tugas ditemukan pada currentArray[index]
            
            // Perbarui properti secara langsung pada objek
            currentArray[index][propertyName] = newValue;
            taskFound = true;

            console.log(`✅ Update berhasil: Tugas ${taskId} - Properti '${propertyName}' diubah menjadi: ${newValue}`);
            break; // Tugas ditemukan, hentikan pencarian
        }
    }

    if (!taskFound) {
        console.warn(`❌ Update Gagal: Tugas dengan ID ${taskId} tidak ditemukan.`);
    }
};


// MENGAMBIL DAFTAR TUGAS BERDASARKAN STATUS
const getTasksByStatus = (status) => {
    // Menggunakan taskBoardData untuk mengakses array secara langsung
    const tasks = taskBoardData[status];
    
    if (!tasks) {
        console.error(`❌ Status kolom '${status}' tidak valid.`);
        return [];
    }
    
    return tasks;
};




// // SIMULASI 1: Input tugas pertama
// addNewTask(
//     "Implementasi Login Modal", 
//     "Selesaikan JS dan CSS untuk modal login dan validasi.", 
//     "2025-10-30", 
//     "high-priority"
// );

// // SIMULASI 2: Input tugas kedua
// addNewTask(
//     "Desain Task Card Footer", 
//     "Tambahkan style untuk date picker dan priority select.", 
//     "2025-10-29", 
//     "low-priority"
// );

// // Cek hasil akhir di console:
// console.log("\n--- HASIL AKHIR BLUEPRINT ---");
// console.log(toDoData);
// changeTaskStatus("TASK-001", "inprogress");

// console.log(inProgressData);
// console.log(toDoData);


// ======================================
// FUNGSI UTILITY (Pindahkan ke luar DOMContentLoaded)
// ======================================

// Format tampilan tanggal dari ISO ke format lokal (ID)
const formatDateDisplay = (isoDate) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);

    // Format ID/Short Month (Misalnya: 17 Feb 2025)
    return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};


// Auto Resize Textarea berdasarkan konten
const autoResizeTextarea = (textarea) => {
    // Fungsi auto resize (sebelumnya sudah kita buat)
    textarea.style.height = 'auto'; 
    textarea.style.height = (textarea.scrollHeight) + 'px'; 
};



// INISIALISASI KARTU TUGAS YANG ADA
const initializeExistingTaskCards = (allPriorityClasses) => {
    document.querySelectorAll('.task-priority-select').forEach(selector => {
        // Ini memastikan elemen awal yang ada memiliki warna default yang benar
        selector.classList.add(selector.value);
    });
};


// ======================================
// FUNGSI UTILITY: MEMBUAT TEMPLATE HTML UNTUK KARTU TUGAS
// ======================================
const createTaskCardHTML = (task, currentStatus) => {
    // 1. Persiapan Variabel Tampilan
    const isChecked = task.isCompleted ? 'checked' : '';
    const priorityClass = task.priority; 
    
    // Format tanggal untuk tampilan (Misal: 17 Feb 2025)
    // Pastikan fungsi formatDateDisplay sudah didefinisikan di atas
    const displayDate = formatDateDisplay(task.dueDate || ''); 
    
    // Tentukan apakah input harus dinonaktifkan (karena sudah di kolom Done)
    const isDisabled = task.status === 'done' ? 'disabled' : '';

    // 2. Logika Menu Opsi (Hanya tampilkan opsi yang relevan)
    let menuOptionsHTML = '';

    // Opsi Pindahkan/Move (Muncul jika status BUKAN 'done')
    if (currentStatus !== 'done') {
        if (currentStatus !== 'inprogress') {
            // Jika di To Do, bisa pindah ke In Progress
            menuOptionsHTML += `<button type="button" class="menu-item action-move" data-move-to="inprogress">Pindah ke In Progress</button>`;
        }
        if (currentStatus !== 'todo') {
            // Jika di In Progress, bisa pindah ke To Do
            menuOptionsHTML += `<button type="button" class="menu-item action-move" data-move-to="todo">Pindah ke To Do</button>`;
        }
        // Selalu bisa pindah ke Done
        menuOptionsHTML += `<button type="button" class="menu-item action-move" data-move-to="done">Tandai Selesai & Pindah ke Done</button>`;
    }
    
    // Opsi Hapus (Selalu ada)
    menuOptionsHTML += `<button type="button" class="menu-item action-delete">Hapus Tugas</button>`;


    // 3. Template Literal (String HTML)
    return `
        <form class="task-card" id="${task.id}">
            <div class="card-header">
                <input 
                    type="text" 
                    class="task-title" 
                    id="title-${task.id}" 
                    value="${task.title}" 
                    maxlength="50" spellcheck="false" required ${isDisabled}
                />
                <div class="header-actions">
                    <div class="task-options-menu-container">
                        <button type="button" class="options-btn" data-toggle-menu="${task.id}-menu">⋮</button>
                        
                        <div id="${task.id}-menu" class="task-options-menu hidden" data-status="${task.status}">
                            ${menuOptionsHTML}
                        </div>
                    </div>
                    <input type="checkbox" class="task-checkbox" ${isChecked} ${isDisabled}>
                </div>
            </div>
            
            <textarea 
                class="task-desc" 
                id="desc-${task.id}" 
                placeholder="Tambahkan deskripsi..." 
                rows="3" 
                spellcheck="false"
                required ${isDisabled}
            >${task.description}</textarea>

            <div class="card-footer">
                <div class="task-date-picker-container">
                    <span class="task-date" id="date-display-${task.id}">${displayDate}</span>
                    <input type="date" class="task-date-input visually-hidden" id="date-input-${task.id}" value="${task.dueDate}" ${isDisabled}/>
                </div>
                <select class="task-priority-select ${priorityClass}" data-task-id="${task.id}" ${isDisabled}>
                    <option value="high-priority" ${task.priority === 'high-priority' ? 'selected' : ''}>High-Priority</option>
                    <option value="medium-priority" ${task.priority === 'medium-priority' ? 'selected' : ''}>Medium-Priority</option>
                    <option value="low-priority" ${task.priority === 'low-priority' ? 'selected' : ''}>Low-Priority</option>
                </select>
            </div>
        </form>
    `;
};

// =================================================================================




/**
 * Fungsi untuk menghapus DOM lama dan merender ulang seluruh task board
 * berdasarkan data yang ada di taskBoardData.
 */
const renderTaskBoard = () => {
    console.log("🔄 Merender ulang Task Board...");

    // 1. Definisikan wadah kolom (IDs di HTML Anda)
    // Asumsi: Anda memiliki wadah <div id="todo-tasks">, <div id="inprogress-tasks">, dst.
    const todoContainer = document.getElementById('todo-tasks-container');
    const inProgressContainer = document.getElementById('inprogress-tasks-container');
    const doneContainer = document.getElementById('done-tasks-container');

    // Buat peta wadah untuk iterasi yang mudah
    const containersMap = {
        todo: todoContainer,
        inprogress: inProgressContainer,
        done: doneContainer
    };

    // 2. Iterasi melalui setiap status di taskBoardData
    for (const statusKey in taskBoardData) {
        const tasksArray = taskBoardData[statusKey]; // Array of tasks
        const container = containersMap[statusKey];  // Wadah HTML (DOM)

        // Verifikasi keamanan
        if (!container) {
            console.error(`Wadah DOM untuk status '${statusKey}' tidak ditemukan. Mohon cek ID di HTML.`);
            continue;
        }

        // A. Hapus Konten Lama (Pembersihan)
        container.innerHTML = ''; 

        // B. Buat HTML baru dan sisipkan (Rendering)
        let tasksHTML = '';
        
        tasksArray.forEach(task => {
            // Memanggil fungsi rendering task card untuk setiap tugas
            tasksHTML += createTaskCardHTML(task, statusKey); 
        });

        // Sisipkan semua HTML baru ke DOM
        container.innerHTML = tasksHTML;
        
        // C. Aktifkan kembali auto-resize untuk task cards yang baru
        container.querySelectorAll('.task-desc').forEach(autoResizeTextarea);
        
        console.log(`Kolom ${statusKey} dirender dengan ${tasksArray.length} tugas.`);
    }
};







// ======================================
// EVENT LISTENERS DAN INISIALISASI
// ======================================
document.addEventListener("DOMContentLoaded", () => {


    // --- VARIABEL TETAP ---
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('login-form');
    const namaInput = document.getElementById('nama');
    const jabatanInput = document.getElementById('jabatan');
    const welcomeNamaDisplay = document.getElementById('welcomeNamaDisplay');
    const userJabatanDisplay = document.getElementById('userJabatanDisplay');
    const allPriorityClasses = ['high-priority', 'medium-priority', 'low-priority'];

    // 1. PROSES MASUK LOGIN
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

// ======================================

    // 2. TAMPILAN TANGGAL SAAT INI PADA HEADER
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

// =====================================

    // 3. INISIALISASI WARNA PRIORITAS AWAL
    initializeExistingTaskCards(allPriorityClasses); 

// =====================================

     // 4. MODAL TAMBAH TUGAS BARU
    const newTaskForm = document.getElementById('newTaskForm');
    const addTaskButton = document.getElementById('addTaskBtn');
    const newTaskModal = document.getElementById('newTaskModal');
    const cancelNewTaskBtn = document.getElementById('cancelNewTaskBtn');
    const newTaskDateInput = document.getElementById('newTaskDateInput'); 
    const newTaskDateDisplay = document.getElementById('newTaskDateDisplay');

    // Tombol Membuka Modal form tambah tugas baru
    if (addTaskButton) {
        addTaskButton.addEventListener('click', () => {
            // Hapus class 'hidden' untuk menampilkan modal
            newTaskModal.classList.remove('hidden'); 

            if (newTaskDateInput && newTaskDateDisplay) {
                // 1. Atur nilai input tersembunyi ke tanggal hari ini (ISO Format)
                newTaskDateInput.value = isoDate; 
                
                // 2. Format dan atur span tampilan ke tanggal hari ini (Format Tampilan)
                const defaultDisplayDate = formatDateDisplay(isoDate);
                newTaskDateDisplay.textContent = defaultDisplayDate;
            }
            
            document.getElementById('newTaskTitleInput').focus();
        });
    }

    // Tombol Tutup Modal form tambah tugas baru
    if (cancelNewTaskBtn) {
        cancelNewTaskBtn.addEventListener('click', () => {
            // Tambahkan class 'hidden' untuk menyembunyikan modal
            newTaskModal.classList.add('hidden');
            
            document.getElementById('newTaskForm').reset();
        });
    }


    if (newTaskForm) {
        newTaskForm.addEventListener('submit', (event) => {
            
            // PENTING: Periksa validitas form bawaan HTML
            if (!newTaskForm.checkValidity()) {
                return; // Biarkan browser menampilkan peringatan 'required'
            }
            
            // Hanya jika valid, baru cegah default dan proses
            event.preventDefault(); 

            // Dapatkan nilai input dari MODAL
            const title = document.getElementById('newTaskTitleInput').value.trim();
            const desc = document.getElementById('newTaskDescInput').value.trim();
            const dueDate = document.getElementById('newTaskDateInput').value;
            const priority = document.getElementById('newTaskPrioritySelect').value;

            // 1. Panggil fungsi inti untuk menyimpan data
            addNewTask(title, desc, dueDate, priority);

            // 2. Kosongkan dan Tutup Modal
            newTaskForm.reset();
            newTaskModal.classList.add('hidden');
            
            // 3. PANGGIL FUNGSI RENDERING GLOBAL
            renderTaskBoard(); 
            
            console.log("Task Saved. Board rendered.");
        });
    }

// ======================================

    // ------------------------------------------------------------------
    // 5. DELEGASI EVENT GLOBAL (Semua interaksi Task Card)
    // ------------------------------------------------------------------

    // Listener TUNGGAL untuk semua interaksi 'change' (Prioritas & Tanggal Input)
    document.body.addEventListener('change', (event) => {
        const target = event.target;

        // A. Perubahan Prioritas (Delegasi)
        if (target.classList.contains('task-priority-select')) {
            const selectedPriority = target.value;
            target.classList.remove(...allPriorityClasses);
            target.classList.add(selectedPriority);
            console.log(`Prioritas terpilih (Delegasi): ${selectedPriority}`);
            // TODO: Panggil fungsi updateTaskPropertyById() di sini
        }

        // B. Perubahan Tanggal Input (Delegasi)
        if (target.classList.contains('task-date-input')) {
            const newIsoDate = target.value;
            const displaySpan = target.previousElementSibling; // Span tampilan
            
            if (displaySpan) {
                const newDisplayDate = formatDateDisplay(newIsoDate);
                displaySpan.textContent = newDisplayDate;
            }
            console.log('Data Tanggal Baru (Delegasi):', newIsoDate);
            // TODO: Panggil fungsi updateTaskPropertyById() di sini
        }
    });

    // ================================================================

    // Listener TUNGGAL untuk semua interaksi click (Date Picker Trigger & Modal)
    document.body.addEventListener('click', (event) => {
        
        // A. Date Picker Trigger (Delegasi)
        if (event.target.classList.contains('task-date')) {
            const displaySpan = event.target;
            const dateInput = displaySpan.nextElementSibling; 

            if (dateInput && dateInput.classList.contains('visually-hidden')) {
                dateInput.showPicker();
            }
        }


        // B. Toggle Menu Opsi Tugas (⋮) (Delegasi)
        const target = event.target;
        
        // Cek apakah yang diklik adalah tombol titik tiga (⋮) atau di dalamnya
        const optionsBtn = target.closest('.options-btn');

        if (optionsBtn) {
            // 1. Mencegah aksi default (jika tombol berada dalam form)
            event.preventDefault(); 
            
            // 2. Cari menu popover terdekat (berada di sibling atau di dalam container)
            // Kita cari container terdekat, lalu cari menu di dalamnya.
            const menuContainer = optionsBtn.closest('.task-options-menu-container');
            const menu = menuContainer ? menuContainer.querySelector('.task-options-menu') : null;
            
            if (menu) {
                // KUNCI: Toggle class 'hidden' untuk menampilkan/menyembunyikan
                menu.classList.toggle('hidden');
            }
        }
        
        // --- LOGIKA PENUTUPAN MENU GLOBAL ---
        // Jika klik terjadi di luar tombol (⋮) dan di luar menu itu sendiri, tutup semua menu.
        if (!optionsBtn && !target.closest('.task-options-menu')) {
            document.querySelectorAll('.task-options-menu').forEach(openMenu => {
                openMenu.classList.add('hidden');
            });
        }
        
        
    });

    // ================================================================

    // Listener TUNGGAL untuk semua interaksi input (Auto Resize Textarea)
    document.body.addEventListener('input', (event) => {
        const targetElement = event.target;
        
        if (targetElement.classList.contains('task-desc')) {
        
            autoResizeTextarea(targetElement); 
        }
    });

    // ================================================================

    // Listener TUNGGAL untuk semua interaksi focusin focusout (Edit Deskripsi)
    document.body.addEventListener('focusin', (event) => {

        
        if (event.target.classList.contains('task-desc')) {
            console.log('Deskripsi sedang diedit.');
        }
    }, true);

    document.body.addEventListener('focusout', (event) => {
        if (event.target.classList.contains('task-desc')) {
            console.log('Deskripsi selesai diedit.');
        }
    }, true);


});

