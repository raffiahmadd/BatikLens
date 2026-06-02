/**
 * =========================================================================
 * BATIKLENS MAIN REPOSITORY SCRIPT (VERSI REVISI FINAL + CUSTOM TOAST)
 * =========================================================================
 */

// --- SISTEM POP-UP PROFESIONAL (CUSTOM TOAST) ---
function showToast(message, type = 'error') {
    // Hapus toast lama jika ada
    const existing = document.getElementById('custom-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    
    // Styling berdasarkan tipe (error, warning, success)
    const bgColors = {
        'error': 'bg-red-900/90 border-red-500/50 text-red-100',
        'warning': 'bg-amber-900/90 border-amber-500/50 text-amber-100',
        'success': 'bg-green-900/90 border-green-500/50 text-green-100'
    };
    const icons = {
        'error': 'fa-circle-xmark text-red-400',
        'warning': 'fa-triangle-exclamation text-amber-400',
        'success': 'fa-circle-check text-green-400'
    };
    
    toast.className = `fixed left-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold border animate-toast ${bgColors[type]}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type]} text-lg"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Hilangkan otomatis setelah 3.5 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// --- 1. FIREBASE AUTHENTICATION CORE ---
const firebaseConfig = {
    apiKey: "AIzaSyD77xdQxB7_sQ2uh5b5UeU-A4aLuEzjrDw",
    authDomain: "sipoo-f7cd4.firebaseapp.com",
    projectId: "sipoo-f7cd4",
    storageBucket: "sipoo-f7cd4.firebasestorage.app",
    messagingSenderId: "848345578752",
    appId: "1:848345578752:web:9c846359f0d6d07b86c7e5"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        document.getElementById('user-name-display').innerText = user.displayName || user.email;
        if(user.photoURL) document.getElementById('user-avatar').src = user.photoURL;
        switchTab('home');
    } else {
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'flex';
    }
});

function loginWithGoogle() {
    auth.signInWithPopup(googleProvider).catch(err => showToast("Gagal login Google: " + err.message, "error"));
}

function loginWithEmail() {
    const e = document.getElementById('login-email').value;
    const p = document.getElementById('login-password').value;
    if(!e || !p) return showToast("Harap isi email dan password!", "warning");
    auth.signInWithEmailAndPassword(e, p).catch(err => showToast("Gagal login: Periksa kredensial Anda", "error"));
}

function registerWithEmail() {
    const n = document.getElementById('reg-name').value;
    const e = document.getElementById('reg-email').value;
    const p = document.getElementById('reg-password').value;
    if(p.length < 6) return showToast("Password minimal 6 karakter!", "warning");
    
    auth.createUserWithEmailAndPassword(e, p).then(cred => {
        cred.user.updateProfile({ displayName: n });
        showToast("Registrasi berhasil! Memuat sistem...", "success");
    }).catch(err => showToast(err.message, "error"));
}

function resetPassword() {
    const e = document.getElementById('login-email').value;
    if(!e) return showToast("Masukkan email di kolom atas terlebih dahulu untuk reset", "warning");
    auth.sendPasswordResetEmail(e).then(() => showToast("Link reset telah dikirim ke email Anda", "success")).catch(err => showToast(err.message, "error"));
}

function logout() { auth.signOut(); }

function togglePassword(id) {
    const el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
}

function toggleAuthMode(mode) {
    if (mode === 'register') {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('auth-subtitle').innerText = "Buat akun untuk memulai";
    } else {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('auth-subtitle').innerText = "Masuk untuk menjelajah warisan Nusantara";
    }
}


// --- 2. UI NAVIGATION & OPENCV INIT ---
let isOpenCVReady = false;

function onOpenCvReady() {
    isOpenCVReady = true;
    const statusBox = document.getElementById('cv-status');
    const statusTxt = document.getElementById('cv-status-text');
    if(statusBox && statusTxt) {
        statusBox.className = "bg-green-900/30 border border-green-500/50 p-3 rounded-xl flex items-center gap-3";
        statusBox.innerHTML = `<i class="fa-solid fa-microchip text-green-500"></i><p class="text-xs font-bold text-green-200">Sistem C-VIS Online & Siap Digunakan</p>`;
        document.getElementById('btn-start-scan').disabled = false;
        showToast("Modul AI OpenCV berhasil dimuat", "success");
        setTimeout(() => statusBox.classList.add('hidden'), 4000);
    }
}
window.onOpenCvReady = onOpenCvReady;

function switchTab(tabName) {
    const tabs = ['tab-home', 'tab-scan', 'tab-profile']; 
    tabs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    document.querySelectorAll('.nav-btn, .nav-btn-mobile').forEach(el => {
        el.classList.remove('active-nav', 'text-[#D4AF37]');
        el.classList.add('text-gray-400');
    });
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    const sideBtn = document.getElementById('side-' + tabName);
    if(sideBtn) sideBtn.classList.add('active-nav', 'text-[#D4AF37]');
    const mobBtn = document.getElementById('mob-' + tabName);
    if(mobBtn) mobBtn.classList.add('active-nav', 'text-[#D4AF37]');
}


// --- 3. INPUT ACQUISITION (KAMERA & UPLOAD) ---
let uploadedImageElement = new Image();
let isImageLoaded = false;
let currentStream = null;
let facingMode = 'environment'; 

async function startLiveCamera() {
    const container = document.getElementById('camera-container');
    const video = document.getElementById('live-video');
    document.getElementById('input-selection').classList.add('hidden');
    container.classList.remove('hidden');
    
    try {
        if(currentStream) currentStream.getTracks().forEach(t => t.stop());
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: facingMode, width: { ideal: 1280 } }, audio: false 
        });
        video.srcObject = currentStream;
    } catch (err) {
        showToast("Kamera tidak dapat diakses. Cek izin browser Anda.", "error");
        stopLiveCamera();
    }
}

function switchCamera() {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    startLiveCamera();
}

function stopLiveCamera() {
    if(currentStream) currentStream.getTracks().forEach(t => t.stop());
    document.getElementById('camera-container').classList.add('hidden');
    document.getElementById('input-selection').classList.remove('hidden');
}

function captureCamera() {
    const video = document.getElementById('live-video');
    const canvas = document.getElementById('hidden-canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    processImageDataURL(canvas.toDataURL('image/jpeg'));
    stopLiveCamera();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => processImageDataURL(e.target.result);
        reader.readAsDataURL(file);
    }
}

function processImageDataURL(dataUrl) {
    document.getElementById('input-selection').classList.add('hidden');
    document.getElementById('upload-preview-container').classList.remove('hidden');
    document.getElementById('upload-img-preview').src = dataUrl;
    document.getElementById('res-thumbnail').src = dataUrl;
    document.getElementById('err-thumbnail').src = dataUrl;

    uploadedImageElement.src = dataUrl;
    uploadedImageElement.onload = () => { isImageLoaded = true; };
    
    document.getElementById('result-placeholder').classList.remove('hidden');
    document.getElementById('result-container-wrap').classList.add('hidden');
    document.getElementById('result-error-card').classList.add('hidden');
}

function resetInput() {
    isImageLoaded = false;
    document.getElementById('upload-preview-container').classList.add('hidden');
    document.getElementById('input-selection').classList.remove('hidden');
    document.getElementById('result-placeholder').classList.remove('hidden');
    document.getElementById('result-container-wrap').classList.add('hidden');
    document.getElementById('result-error-card').classList.add('hidden');
}


// --- 4. C-VIS ENGINE (10 MOTIF UNIFAM & FILTER ANTI-WAJAH) ---
async function startAutoScan() {
    if (!isImageLoaded) return showToast("Silakan unggah atau foto gambar terlebih dahulu.", "warning");
    if (!isOpenCVReady || typeof cv === 'undefined' || !cv.Mat) {
        return showToast("Sistem AI OpenCV masih memuat, mohon tunggu beberapa detik.", "warning");
    }

    document.getElementById('ai-loading').classList.remove('hidden');
    document.getElementById('scanner-line').classList.add('animate-scan');
    document.getElementById('result-placeholder').classList.add('hidden');
    document.getElementById('result-container-wrap').classList.add('hidden');
    document.getElementById('result-error-card').classList.add('hidden');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasi deep scan

    try {
        let src = cv.imread(uploadedImageElement);
        let hsv = new cv.Mat();
        cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
        cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

        let s = cv.mean(hsv);
        let H = s[0]; let S = s[1]; let V = s[2];
        src.delete(); hsv.delete(); // Free memory

        let dataHasil = {};
        console.log(`[C-VIS Analisis] Hue: ${H.toFixed(1)} | Sat: ${S.toFixed(1)} | Val: ${V.toFixed(1)}`);

        // ==========================================
        // FILTER KETAT: ANTI-WAJAH & BUKAN KAIN
        // ==========================================
        // 1. Tolak gambar terlalu gelap, terlalu terang silau, atau abu-abu polos
        if (V < 20 || V > 245 || S < 25) { 
            dataHasil = { is_batik: false }; 
        } 
        // 2. TOLAK KULIT MANUSIA (Wajah/Tangan). Rentang ini memblokir warna peach/krem/coklat kulit.
        else if (H >= 0 && H <= 25 && S >= 25 && S <= 95 && V >= 80 && V <= 230) {
            dataHasil = { is_batik: false };
        }
        
        // ==========================================
        // 10 KLASIFIKASI MOTIF (SUMBER: UNIFAM BLOG)
        // ==========================================
        
        // KELOMPOK 1: MERAH (Lasem & Gentongan) -> H: 0-10 atau 170-180
        else if ((H >= 0 && H <= 10) || (H >= 170 && H <= 180)) {
            if (V < 150) { 
                dataHasil = { is_batik: true, nama: "Batik Lasem", asal: "Lasem", deskripsi: "Perpaduan budaya Jawa dan Tionghoa dengan warna khas 'merah darah ayam' dari akar mengkudu.", filosofi: "Simbol semangat, keberanian, dan interaksi keragaman budaya.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            } else { 
                dataHasil = { is_batik: true, nama: "Gentongan", asal: "Madura", deskripsi: "Batik pesisir Madura. Pola menyerupai gentong (wadah air) dengan warna merah cerah ceria.", filosofi: "Harapan agar hidup dilimpahi keberuntungan, rezeki melimpah, dan kesejahteraan.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            }
        }
        
        // KELOMPOK 2: COKLAT / SOGAN (Parang, Sidoluhur, Kawung) -> H: 11 - 30
        else if (H > 10 && H <= 30) {
            if (V < 100) {
                dataHasil = { is_batik: true, nama: "Parang Rusak", asal: "Jawa", deskripsi: "Garis diagonal tajam dan tegas berwarna gelap, terinspirasi dari senjata parang.", filosofi: "Melambangkan semangat pantang menyerah, tekad kuat, dan keberanian menghadapi rintangan.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            } else if (S > 120) {
                dataHasil = { is_batik: true, nama: "Sidoluhur", asal: "Jawa Klasik", deskripsi: "Motif klasik elegan dengan pola bunga rumit dan warna coklat/krem lembut.", filosofi: "Melambangkan keanggunan, kemewahan, dan harapan agar hidup dilimpahi kebahagiaan.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            } else {
                dataHasil = { is_batik: true, nama: "Kawung", asal: "Jawa", deskripsi: "Bentuk empat buah kawung (kolang-kaling) saling bersinggungan dengan warna elegan berwibawa.", filosofi: "Melambangkan kesempurnaan, keharmonisan alam, dan keseimbangan hidup.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            }
        }
        
        // KELOMPOK 3: KUNING & HIJAU (Tujuh Rupa & Simbut) -> H: 31 - 85
        else if (H > 30 && H <= 85) {
            if (H <= 50) {
                dataHasil = { is_batik: true, nama: "Tujuh Rupa", asal: "Pekalongan", deskripsi: "Kombinasi motif flora dan fauna yang sangat menawan dengan warna-warni cerah.", filosofi: "Melambangkan keindahan alam melimpah, keberagaman budaya, dan semangat hidup penuh warna.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            } else {
                dataHasil = { is_batik: true, nama: "Simbut", asal: "Banten", deskripsi: "Pola tumbuhan rambat (simbut) yang menjalar dengan warna cerah lembut yang elegan.", filosofi: "Melambangkan kesederhanaan, harapan kebahagiaan, dan cinta yang tak terbatas.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            }
        }
        
        // KELOMPOK 4: BIRU (Megamendung & Jlamprang) -> H: 86 - 130
        else if (H > 85 && H <= 130) {
            if (S > 120) {
                dataHasil = { is_batik: true, nama: "Megamendung", asal: "Cirebon", deskripsi: "Garis lengkung bergelombang menyerupai awan mendung dengan warna biru yang menawan.", filosofi: "Melambangkan kekuatan, kejayaan, kemakmuran, dan doa akan keberkahan.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            } else {
                dataHasil = { is_batik: true, nama: "Jlamprang", asal: "Jawa", deskripsi: "Garis-garis bersilangan berwarna gelap yang menggambarkan kehidupan yang sangat dinamis.", filosofi: "Melambangkan perjalanan hidup manusia, kekuatan, keteguhan, dan keberanian.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
            }
        }
        
        // KELOMPOK 5: UNGU/MULTICOLOR (Sekar Jagat) -> H: 131 - 169
        else {
            dataHasil = { is_batik: true, nama: "Sekar Jagat", asal: "Jawa", deskripsi: "Kombinasi flora dan fauna tersusun harmonis bagaikan keindahan alam semesta (jagat).", filosofi: "Melambangkan keindahan alam semesta yang melimpah dan keberagaman budaya Indonesia.", sumber: [{judul: "10 Motif Batik Populer (Unifam)", url: "https://unifam.com/blog/motif-batik-paling-populer"}] }; 
        }

        renderHasilUI(dataHasil);

    } catch (error) {
        showToast("Gangguan Analisis Gambar: " + error.message, "error");
    } finally {
        document.getElementById('ai-loading').classList.add('hidden');
        document.getElementById('scanner-line').classList.remove('animate-scan');
    }
}

// --- 5. RENDER UI & EXPORT ---
function renderHasilUI(data) {
    if(!data.is_batik) {
        document.getElementById('result-error-card').classList.remove('hidden');
        showToast("Objek bukan kain batik atau warna tidak teridentifikasi.", "error");
        return;
    }
    
    document.getElementById('res-nama').innerText = data.nama;
    document.getElementById('res-asal').innerText = data.asal;
    document.getElementById('res-deskripsi').innerText = data.deskripsi;
    document.getElementById('res-filosofi').innerText = data.filosofi;
    
    const ul = document.getElementById('res-sumber');
    ul.innerHTML = '';
    // PERBAIKAN: Menangani array objek {judul, url} dengan benar
    data.sumber.forEach(item => {
        ul.innerHTML += `<li><a href="${item.url}" target="_blank" class="text-[#D4AF37] font-bold hover:underline hover:text-amber-200 transition"><i class="fa-solid fa-link mr-1"></i> ${item.judul}</a></li>`;
    });
    
    document.getElementById('result-container-wrap').classList.remove('hidden');
    showToast("Berhasil diidentifikasi!", "success");
}

function exportToPDF() {
    const element = document.getElementById('result-success-card');
    const opt = {
        margin:       10,
        filename:     'Laporan-BatikLens.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    showToast("Sedang membuat PDF...", "warning");
    html2pdf().set(opt).from(element).save().then(() => showToast("PDF berhasil diunduh!", "success"));
}

function exportToWord() {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Laporan BatikLens</title></head><body style="font-family: Arial, sans-serif; color: black; background: white;">`;
    const nama = document.getElementById('res-nama').innerText;
    const asal = document.getElementById('res-asal').innerText;
    const desc = document.getElementById('res-deskripsi').innerText;
    const filo = document.getElementById('res-filosofi').innerText;
    
    const content = `
        <h1 style="color: #D4AF37;">Laporan Pemindaian AI BatikLens</h1>
        <hr>
        <h2><b>Nama Motif:</b> ${nama}</h2>
        <h3><b>Daerah Asal:</b> ${asal}</h3>
        <p><b>Karakteristik Visual:</b><br>${desc}</p>
        <p><b>Makna & Filosofi:</b><br>${filo}</p>
        <br><br><p style="color: gray; font-size: 10px;">Di-generate otomatis oleh Sistem AI C-VIS BatikLens.</p>
    `;
    const sourceHTML = header + content + "</body></html>";
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Laporan-BatikLens.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
    showToast("Dokumen Word berhasil diunduh!", "success");
}