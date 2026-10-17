import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, onAuthStateChanged, signOut, reload,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);
const loginBtn = $("loginBtn");
const message = $("message");
const userCard = $("userCard");
const modal = $("welcomeModal");
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function showMessage(text, kind = "") {
  message.textContent = text;
  message.className = "message" + (kind ? " " + kind : "");
}
function configReady() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("GANTI_") &&
         firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("GANTI_") &&
         firebaseConfig.appId && !firebaseConfig.appId.startsWith("GANTI_");
}
function readableError(error) {
  const code = error?.code || "";
  if (code === "auth/popup-closed-by-user") return "Jendela login ditutup sebelum selesai.";
  if (code === "auth/popup-blocked") return "Popup diblokir browser. Izinkan popup atau coba lagi.";
  if (code === "auth/unauthorized-domain") return "Domain website belum diizinkan di Firebase Authentication.";
  if (code === "auth/network-request-failed") return "Koneksi jaringan gagal. Periksa internet lalu coba lagi.";
  if (code === "auth/operation-not-allowed") return "Penyedia Google belum diaktifkan di Firebase Console.";
  if (code === "auth/invalid-api-key") return "API key Firebase belum benar.";
  return "Login belum berhasil. Silakan coba lagi. Kode: " + (code || "unknown");
}
function updateUser(user) {
  if (!user) {
    userCard.classList.add("hidden");
    loginBtn.classList.remove("hidden");
    loginBtn.disabled = false;
    showMessage("Belum ada sesi login. Login satu kali untuk mengaktifkan sesi otomatis.");
    return;
  }
  $("userName").textContent = user.displayName || "Pengguna Google";
  $("userEmail").textContent = user.email || "Email tidak tersedia";
  $("avatar").src = user.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='100%25' height='100%25' fill='%2326334c'/%3E%3C/svg%3E";
  $("authStatus").textContent = user.emailVerified ? "Sesi aktif · email terverifikasi" : "Sesi aktif";
  $("checkedAt").textContent = new Date().toLocaleString("id-ID");
  userCard.classList.remove("hidden");
  loginBtn.classList.add("hidden");
  showMessage("Sesi dipulihkan atau login berhasil. Kamu tidak perlu login ulang setiap kunjungan selama sesi masih tersimpan.", "success");
}

function setupWelcomeAd() {
  // Tampilkan hanya sekali per browser, setelah pengguna pertama kali membuka situs.
  try {
    if (!localStorage.getItem("mailmxWelcomeAdSeen")) {
      modal.classList.remove("hidden");
    }
    const dismiss = () => {
      modal.classList.add("hidden");
      try { localStorage.setItem("mailmxWelcomeAdSeen", "1"); } catch {}
    };
    $("closeModal").addEventListener("click", dismiss);
    $("laterBtn").addEventListener("click", dismiss);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) dismiss();
    });
  } catch {
    // Jika storage browser dinonaktifkan, modal tetap bisa ditutup; iklan mungkin muncul lagi nanti.
    modal.classList.remove("hidden");
    $("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
    $("laterBtn").addEventListener("click", () => modal.classList.add("hidden"));
  }
}

setupWelcomeAd();

if (!configReady()) {
  loginBtn.disabled = true;
  showMessage("Konfigurasi belum diisi. Ikuti README.md untuk menghubungkan proyek Firebase.", "error");
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Persistensi LOCAL: sesi login disimpan oleh Firebase pada browser/perangkat ini.
  setPersistence(auth, browserLocalPersistence).then(() => {
    onAuthStateChanged(auth, updateUser);
  }).catch((error) => {
    showMessage("Tidak dapat memulihkan sesi otomatis: " + readableError(error), "error");
  });

  loginBtn.addEventListener("click", async () => {
    loginBtn.disabled = true;
    showMessage("Membuka login Google resmi…");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/operation-not-supported-in-this-environment") {
        try { await signInWithRedirect(auth, provider); return; }
        catch (redirectError) { showMessage(readableError(redirectError), "error"); }
      } else {
        showMessage(readableError(error), "error");
      }
      loginBtn.disabled = false;
    }
  });

  getRedirectResult(auth).catch(error => showMessage(readableError(error), "error"));

  $("refreshBtn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return showMessage("Tidak ada sesi aktif. Silakan login kembali.", "error");
    try {
      await reload(user);
      updateUser(auth.currentUser);
    } catch (error) {
      showMessage(readableError(error), "error");
    }
  });

  $("logoutBtn").addEventListener("click", async () => {
    try { await signOut(auth); }
    catch (error) { showMessage(readableError(error), "error"); }
  });
}
