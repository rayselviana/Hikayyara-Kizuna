document.addEventListener('DOMContentLoaded', () => {
    // --- Navigasi Hamburger Mobile ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Tutup menu jika link diklik (untuk smooth scroll/navigasi)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Hanya tutup jika menu sedang terbuka di mode mobile
                if (window.innerWidth <= 992 && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    navToggle.classList.remove('active');
                }
            });
        });
    }

    // --- Validasi Formulir Pendaftaran Talent ---
    const talentRegistrationForm = document.getElementById('talentRegistrationForm');
    if (talentRegistrationForm) {
        talentRegistrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form submit default

            const fullName = document.getElementById('fullName').value.trim();
            const age = parseInt(document.getElementById('age').value);
            const email = document.getElementById('email').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const domicile = document.getElementById('domicile').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            const formMessage = document.getElementById('formMessage');

            formMessage.className = 'form-message'; // Reset class

            // Validasi sederhana
            if (!fullName || !email || !whatsapp || !domicile) {
                formMessage.textContent = 'Semua kolom bertanda * wajib diisi.';
                formMessage.classList.add('error');
                return;
            }

            if (isNaN(age) || age < 18) {
                formMessage.textContent = 'Usia harus angka dan minimal 18 tahun.';
                formMessage.classList.add('error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Format email tidak valid.';
                formMessage.classList.add('error');
                return;
            }

            // Simple WhatsApp number validation (just checks if it's mostly digits and reasonable length)
            const whatsappRegex = /^\+?[0-9]{10,15}$/;
            if (!whatsappRegex.test(whatsapp)) {
                formMessage.textContent = 'Nomor WhatsApp tidak valid. Gunakan format angka saja (misal: 6281234567890).';
                formMessage.classList.add('error');
                return;
            }

            if (!agreeTerms) {
                formMessage.textContent = 'Anda harus menyetujui Syarat & Ketentuan Layanan.';
                formMessage.classList.add('error');
                return;
            }

            // Jika semua validasi sukses (simulasi pengiriman data)
            formMessage.textContent = 'Terima kasih! Pendaftaran Anda telah kami terima. Kami akan segera menghubungi Anda.';
            formMessage.classList.add('success');
            talentRegistrationForm.reset(); // Kosongkan form setelah sukses
            document.getElementById('agreeTerms').checked = false; // Reset checkbox
            
            // Di sini Anda akan mengintegrasikan pengiriman data ke backend (misalnya, Vercel Serverless Function)
            // Contoh: fetch('/api/register-talent', { method: 'POST', body: JSON.stringify({ fullName, age, email, whatsapp, domicile, reason }), headers: { 'Content-Type': 'application/json' }})
            // .then(response => response.json())
            // .then(data => { console.log(data); /* Handle success/error from API */ })
            // .catch(error => { console.error('Error:', error); });
        });
    }
});


