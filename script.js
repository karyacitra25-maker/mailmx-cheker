const API_KEY = "471f366e99ce405abdd06cdbd1db2149";

async function checkEmail() {
    const emailInput = document.getElementById("emailInput").value.trim();
    const resultBox = document.getElementById("resultBox");
    const resultStatus = document.getElementById("resultStatus");
    const resultDetail = document.getElementById("resultDetail");
    const loading = document.getElementById("loading");
    const checkBtn = document.getElementById("checkBtn");

    if (emailInput === "") {
        alert("Harap masukkan alamat email terlebih dahulu!");
        return;
    }

    resultBox.className = "result-box hidden";
    loading.classList.remove("hidden");
    checkBtn.disabled = true;

    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${emailInput}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loading.classList.add("hidden");
        resultBox.classList.remove("hidden");

        if (data.error) {
            resultBox.className = "result-box error";
            resultStatus.innerText = "Terjadi Kesalahan Sistem";
            resultDetail.innerText = "Pesan: " + data.error.message;
            checkBtn.disabled = false;
            return;
        }

        if (data.deliverability === "DELIVERABLE") {
            resultBox.className = "result-box success";
            resultStatus.innerText = "✅ Email Aktif & Valid!";
            resultDetail.innerHTML = `Alamat <b>${data.email}</b> terdaftar dan bisa menerima pesan.`;
        } else if (data.deliverability === "UNDELIVERABLE") {
            resultBox.className = "result-box error";
            resultStatus.innerText = "❌ Email Tidak Ditemukan!";
            resultDetail.innerHTML = `Alamat <b>${data.email}</b> tidak aktif atau sudah dihapus.`;
        } else {
            resultBox.className = "result-box warning";
            resultStatus.innerText = "⚠️ Status Tidak Pasti (Risky)";
            resultDetail.innerHTML = `Alamat <b>${data.email}</b> mungkin valid, tetapi servernya penuh atau menolak pengecekan otomatis.`;
        }

    } catch (error) {
        loading.classList.add("hidden");
        resultBox.className = "result-box error";
        resultStatus.innerText = "Koneksi Gagal";
        resultDetail.innerText = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    }

    checkBtn.disabled = false;
}
