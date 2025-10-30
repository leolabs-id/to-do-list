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



/**
 * Menyimpan seluruh task board data ke LocalStorage.
 * Dipanggil SETELAH setiap operasi CRUD (Create, Update, Delete).
 */
const saveTaskBoard = () => {
    try {
        // Kunci: JSON.stringify() mengubah objek JavaScript menjadi string JSON
        const dataString = JSON.stringify(taskBoardData);
        localStorage.setItem('kanbanData', dataString);
        
        console.log("💾 Data Task Board berhasil disimpan ke LocalStorage.");
    } catch (error) {
        console.error("Gagal menyimpan data ke LocalStorage:", error);
    }
};


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
    // Panggil fungsi saveTaskBoard setelah menambah tugas
    saveTaskBoard();
};

// Menghapus semua tugas dari semua kolom
const clearAllTasks = () => {
    // Kunci: Mengatur properti length dari array menjadi 0
    toDoData.length = 0; 
    inProgressData.length = 0;
    doneData.length = 0;
    
    console.log("🔥 Semua data tugas berhasil dihapus dari semua kolom.");
    console.log(`To Do: ${toDoData.length}, In Progress: ${inProgressData.length}, Done: ${doneData.length}`);
    // Panggil fungsi saveTaskBoard setelah menghapus tugas
    saveTaskBoard();
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

    // Panggil fungsi saveTaskBoard setelah menghapus tugas
    saveTaskBoard();
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

    // Panggil fungsi saveTaskBoard setelah mengubah status tugas
    saveTaskBoard();
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

    // Panggil fungsi saveTaskBoard setelah memperbarui tugas
    saveTaskBoard();
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
            menuOptionsHTML += `<button type="button" class="menu-item action-move" data-task-id="${task.id}" data-move-to="inprogress">Pindah ke In Progress</button>`;
        }
        if (currentStatus !== 'todo') {
            // Jika di In Progress, bisa pindah ke To Do
            menuOptionsHTML += `<button type="button" class="menu-item action-move" data-task-id="${task.id}" data-move-to="todo">Pindah ke To Do</button>`;
        }
        // Selalu bisa pindah ke Done
        menuOptionsHTML += `<button type="button" class="menu-item action-move" data-task-id="${task.id}" data-move-to="done">Tandai Selesai & Pindah ke Done</button>`;
    }
    
    // Opsi Hapus (Selalu ada)
    menuOptionsHTML += `<button type="button" class="menu-item action-delete" data-task-id="${task.id}">Hapus Tugas</button>`;


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



/**
 * Memuat data dari LocalStorage dan mengisi array data utama.
 * Dipanggil sekali saat aplikasi dimulai (di dalam DOMContentLoaded).
 */
const loadTaskBoard = () => {
    const dataString = localStorage.getItem('kanbanData');
    
    if (dataString) {
        // Kunci: JSON.parse() mengubah string JSON kembali menjadi objek JavaScript
        const loadedData = JSON.parse(dataString);
        
        // 1. Mengisi array kosong (Mutasi Array)
        // Kita gunakan splice() agar referensi array (toDoData, dll.) tetap sama
        
        toDoData.splice(0, toDoData.length, ...loadedData.todo);
        inProgressData.splice(0, inProgressData.length, ...loadedData.inprogress);
        doneData.splice(0, doneData.length, ...loadedData.done);
        
        console.log(`✅ Data Task Board berhasil dimuat. Total tugas: ${toDoData.length + inProgressData.length + doneData.length}`);
        
        // 2. Mengatur kembali Global Counter
        // Mencari ID tertinggi di semua tugas untuk mencegah duplikasi saat tugas baru dibuat
        updateGlobalCounter();
        
    } else {
        console.log("ℹ️ LocalStorage kosong. Memulai dengan Task Board baru.");
    }
};


/**
 * Memperbarui globalTaskIdCounter berdasarkan ID tertinggi yang ditemukan dalam data.
 * Penting setelah data dimuat dari LocalStorage.
 */
const updateGlobalCounter = () => {
    // Kumpulkan semua ID tugas dari semua kolom
    const allTasks = [...toDoData, ...inProgressData, ...doneData];
    
    if (allTasks.length === 0) {
        globalTaskIdCounter = 0;
        return;
    }

    // Ekstrak angka dari ID (misalnya dari "TASK-015" ambil 15)
    const maxIdNumber = allTasks.reduce((max, task) => {
        const idNumber = parseInt(task.id.replace('TASK-', ''), 10);
        return idNumber > max ? idNumber : max;
    }, 0); // Nilai awal max adalah 0

    globalTaskIdCounter = maxIdNumber;
    console.log(`Counter ID global diatur ulang ke: ${globalTaskIdCounter}`);
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


    // PANGGIL LOAD DATA DARI LOCALSTORAGE
    loadTaskBoard();
    // PANGGIL RENDERING TASK BOARD AWAL
    renderTaskBoard();
    // Inisialisasi warna prioritas untuk kartu tugas yang ada
    initializeExistingTaskCards(allPriorityClasses);

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

            // Dapatkan elemen select priority
            const prioritySelect = document.getElementById('newTaskPrioritySelect');

            // LANGKAH PEMBERSIHAN BARU:
            const allPriorityClasses = ['high-priority', 'medium-priority', 'low-priority'];
            if (prioritySelect) {
            // LANGKAH PEMBERSIHAN BARU:
            
            // 1. Hapus semua class warna yang tersisa
            prioritySelect.classList.remove(...allPriorityClasses);
            
            // 2. Tambahkan kembali class DEFAULT yang benar
            prioritySelect.classList.add('high-priority'); 
            }

            // Tambahkan class 'hidden' untuk menyembunyikan modal
            newTaskModal.classList.add('hidden');
            document.getElementById('newTaskForm').reset();
        });
    }

    // Proses Submit Form Tambah Tugas Baru
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
            // Dapatkan elemen select priority
            const prioritySelect = document.getElementById('newTaskPrioritySelect');


            // 1. Panggil fungsi inti untuk menyimpan data
            addNewTask(title, desc, dueDate, priority);

            // 2. Kosongkan dan Tutup Modal
            const allPriorityClasses = ['high-priority', 'medium-priority', 'low-priority'];
            if (prioritySelect) {
                prioritySelect.classList.remove(...allPriorityClasses);
                prioritySelect.classList.add('high-priority'); // Reset warna ke default (high)
            }
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

    // Listener TUNGGAL untuk semua interaksi 'change'
    document.body.addEventListener('change', (event) => {
        const target = event.target;

        // Abaikan jika elemen berada di dalam Modal Form Tugas Baru
        if (target.closest('#newTaskForm')) {
            return; 
        }

        // A. Pemindahan Berurutan (Checkbox)
        if (target.classList.contains('task-checkbox') && target.checked) {
            
            const taskId = target.closest('.task-card').id; 
            const taskCard = target.closest('.task-card');
            const currentStatus = taskCard.closest('.task-column').dataset.status; 
            
            let newStatus;
            
            if (currentStatus === 'todo') {
                newStatus = 'inprogress';
            } else if (currentStatus === 'inprogress') {
                newStatus = 'done';
            } else {
                return;
            }

            changeTaskStatus(taskId, newStatus); 
            renderTaskBoard(); 
            console.log(`➡️ Pindah Checkbox: ${taskId} ke ${newStatus}`);
            return;
        }

        // B. Update Prioritas Select (Konsolidasi UI & Data)
        if (target.classList.contains('task-priority-select')) {
            const taskId = target.closest('.task-card').id;
            const newValue = target.value;
            
            // 1. Logika UI (Ganti Warna)
            target.classList.remove(...allPriorityClasses);
            target.classList.add(newValue); // Misal newValue adalah 'high-priority'
            
            // 2. Logika Data (Panggil Update)
            updateTaskPropertyById(taskId, 'priority', newValue);
            console.log(`✏️ Prioritas Update: ${newValue} pada ID ${taskId}`);
        }

        // C. Update Tanggal Input (Konsolidasi UI & Data)
        if (target.classList.contains('task-date-input')) {
            const taskId = target.closest('.task-card').id;
            const newIsoDate = target.value; 
            const displaySpan = target.previousElementSibling;
            
            // 1. Logika UI (Ganti Teks Tampilan)
            if (displaySpan) {
                const newDisplayDate = formatDateDisplay(newIsoDate); // Asumsi fungsi ini ada
                displaySpan.textContent = newDisplayDate;
            }

            // 2. Logika Data (Panggil Update)
            updateTaskPropertyById(taskId, 'dueDate', newIsoDate);
            console.log(`✏️ Tanggal Update: ${newIsoDate} pada ID ${taskId}`);
        }

    });


    // ================================================================


    document.body.addEventListener('blur', (event) => {
        const targetElement = event.target;
        
        // KUNCI: Abaikan jika elemen berada di dalam Modal Form Tugas Baru
        if (targetElement.closest('#newTaskForm')) {
            return; 
        }

        // Cek apakah elemen target adalah input Judul atau Deskripsi
        if (targetElement.classList.contains('task-title') || targetElement.classList.contains('task-desc')) {
            
            // 1. Ambil Nilai dan ID
            const taskId = targetElement.closest('.task-card').id; // Ambil ID dari form/card terluar
            const newValue = targetElement.value.trim();
            
            // Tentukan properti yang akan diperbarui
            const propertyName = targetElement.classList.contains('task-title') ? 'title' : 'description';

            // Validasi: Judul tidak boleh kosong
            if (propertyName === 'title' && newValue === "") {
                alert("Judul tugas tidak boleh kosong. Perubahan dibatalkan.");
                return; 
            }

            // 2. Panggil fungsi data inti
            updateTaskPropertyById(taskId, propertyName, newValue);
            
            console.log(`✏️ Update sukses: ${propertyName} pada ID ${taskId}`);


        }
    }, true); // Gunakan capture phase untuk blur


    //=================================================================

    // Listener TUNGGAL untuk semua interaksi click
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        
        // --- 1. Aksi Data (Hapus/Pindah) ---
        const menuItem = target.closest('.menu-item');
        
        if (menuItem) {
            event.preventDefault(); 
   
            // Dapatkan TASK ID (Sudah disematkan di tombol aksi)
            const taskId = menuItem.dataset.taskId;

            // Logika Hapus (Delete)
            if (menuItem.classList.contains('action-delete')) {
                
                // Konfirmasi Pengguna
                if (confirm(`Apakah Anda yakin ingin menghapus tugas ${taskId} secara permanen?`)) {
                    deleteTaskById(taskId); 
                    renderTaskBoard(); 
                    console.log(`🗑️ Tugas ID ${taskId} dihapus dan Task Board dirender ulang.`);
                }
                
                // Tutup menu popover setelah aksi (baik dihapus atau dibatalkan)
                menuItem.closest('.task-options-menu').classList.add('hidden');
                return; // Penting: Hentikan eksekusi setelah aksi menu item
            }

            // Logika Pindah (Move)
            else if (menuItem.classList.contains('action-move')) {
                // KOREKSI: Ambil data-move-to dengan pengecekan keamanan
                const newStatus = menuItem.dataset.moveTo; 
                
                if (!newStatus) {
                    console.error("Kesalahan: Atribut data-move-to tidak ditemukan pada tombol pindah.");
                    return; 
                }
                
                // 1. Panggil fungsi data inti
                changeTaskStatus(taskId, newStatus); 
                
                // 2. Render ulang seluruh dashboard
                renderTaskBoard(); 
                
                console.log(`➡️ Tugas ID ${taskId} berhasil dipindahkan ke: ${newStatus}`);

                // Tutup menu popover setelah aksi
                menuItem.closest('.task-options-menu').classList.add('hidden');
                return; // Hentikan eksekusi
            }

        }


        // A. Date Picker Trigger (Delegasi)
        if (event.target.classList.contains('task-date')) {
            const dateInput = target.nextElementSibling; 
            if (dateInput && dateInput.classList.contains('visually-hidden')) {
                dateInput.showPicker();
            }
        }

        // B. LOGIKA MENU POPUP OPSI TUGAS (TOGGLE & GLOBAL CLOSURE)

        const optionsBtn = target.closest('.options-btn');
        const clickedMenu = target.closest('.task-options-menu'); // Menu yang baru diklik

        let menuToToggle = null;
        if (optionsBtn) {
            const menuContainer = optionsBtn.closest('.task-options-menu-container');
            menuToToggle = menuContainer ? menuContainer.querySelector('.task-options-menu') : null;
        }

        // --- LOGIKA PENUTUPAN SEMUA MENU (Kecuali yang Baru Dibuka) ---
        document.querySelectorAll('.task-options-menu').forEach(openMenu => {
            // Tutup semua menu yang terbuka kecuali yang sedang ditoggle
            if (openMenu !== menuToToggle) {
                openMenu.classList.add('hidden');
            }
        });

        // 3. LOGIKA PEMBUKAAN/TOGGLE
        if (menuToToggle) {
            event.preventDefault(); 
            
            // Sekarang kita aman untuk toggle menu yang ditargetkan.
            // Jika menu lain sudah terbuka, mereka ditutup di langkah 2.
            menuToToggle.classList.toggle('hidden');
        }
        
        // 4. LOGIKA PENUTUPAN SAAT KLIK DI LUAR (GLOBAL CLOSURE)
        // Jika klik tidak mengenai tombol manapun DAN tidak di dalam menu manapun, tutup sisa menu.
        if (!optionsBtn && !clickedMenu) { 
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

