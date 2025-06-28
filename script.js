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

    // --- Validasi Formulir Pendaftaran Talent & PDF Generation ---
    const talentRegistrationForm = document.getElementById('talentRegistrationForm');
    const formMessage = document.getElementById('formMessage');

    if (talentRegistrationForm) {
        // Set tanggal submit otomatis
        const submissionDateInput = document.getElementById('submissionDate');
        if (submissionDateInput) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            submissionDateInput.value = today.toLocaleDateString('id-ID', options);
        }

        talentRegistrationForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Mencegah form submit default

            formMessage.className = 'form-message'; // Reset class
            formMessage.textContent = ''; // Clear previous message
            formMessage.style.display = 'none'; // Hide message initially

            let isValid = true;
            const errors = [];

            // 1. Validasi Informasi Diri
            const fullName = document.getElementById('fullName').value.trim();
            const platformName = document.getElementById('platformName').value.trim();
            const age = parseInt(document.getElementById('age').value);
            const email = document.getElementById('email').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const domicile = document.getElementById('domicile').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            const digitalSignature = document.getElementById('digitalSignature').value.trim();

            if (!fullName) {
                errors.push('Nama Asli Lengkap wajib diisi.');
                isValid = false;
            }
            if (!platformName) {
                errors.push('Nama Panggilan di Platform wajib diisi.');
                isValid = false;
            }
            if (isNaN(age) || age < 1) {
                errors.push('Usia harus diisi dengan angka yang valid.');
                isValid = false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Format Email tidak valid.');
                isValid = false;
            }
            const whatsappRegex = /^[0-9]{9,15}$/;
            if (!whatsappRegex.test(whatsapp)) {
                errors.push('Nomor WhatsApp tidak valid. Gunakan format angka saja (contoh: 6281234567890) tanpa spasi/strip.');
                isValid = false;
            }

            // 2. Validasi Checklist Layanan
            const selectedServicesCheckboxes = document.querySelectorAll('input[name="services"]:checked');
            const servicesError = document.getElementById('servicesError');
            if (selectedServicesCheckboxes.length === 0) {
                errors.push('Harap pilih minimal satu jenis layanan yang bersedia Anda berikan.');
                servicesError.style.display = 'block';
                isValid = false;
            } else {
                servicesError.style.display = 'none';
            }

            // 3. Validasi Pernyataan & Persetujuan
            if (!agreeTerms) {
                errors.push('Anda harus menyetujui Syarat & Ketentuan Layanan serta Kebijakan Privasi.');
                isValid = false;
            }

            // 4. Validasi Tanda Tangan Digital
            if (!digitalSignature) {
                errors.push('Tanda Tangan Digital (Nama Asli Lengkap) wajib diisi.');
                isValid = false;
            } else if (digitalSignature.toLowerCase() !== fullName.toLowerCase()) {
                errors.push('Tanda Tangan Digital harus sama dengan Nama Asli Lengkap.');
                isValid = false;
            }

            // Tampilkan pesan error atau sukses
            if (!isValid) {
                formMessage.innerHTML = `<ul style="list-style: none; padding: 0;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
            } else {
                formMessage.textContent = 'Terima kasih! Pendaftaran Anda telah kami terima. Kami sedang menyiapkan dokumen Anda.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';

                // --- Isi Template PDF dengan Data Formulir ---
                const pdfTemplate = document.getElementById('pdf-template');

                // Informasi Diri
                document.getElementById('pdf-fullName').textContent = fullName;
                document.getElementById('pdf-platformName').textContent = platformName;
                document.getElementById('pdf-age').textContent = age;
                document.getElementById('pdf-domicile').textContent = domicile || '-';
                document.getElementById('pdf-email').textContent = email;
                document.getElementById('pdf-whatsapp').textContent = whatsapp;
                document.getElementById('pdf-submission-date').textContent = `Tanggal Pengajuan: ${submissionDateInput.value}`;

                // Layanan yang Dipilih
                const pdfServicesList = document.getElementById('pdf-services-list');
                pdfServicesList.innerHTML = ''; // Clear previous items
                selectedServicesCheckboxes.forEach(checkbox => {
                    const li = document.createElement('li');
                    li.textContent = checkbox.value;
                    pdfServicesList.appendChild(li);
                });

                // Tanda Tangan Digital
                document.getElementById('pdf-digitalSignature').textContent = digitalSignature;

                // --- Generate PDF ---
                try {
                    // Temporarily make the template visible but off-screen for html2canvas
                    pdfTemplate.style.display = 'block';
                    pdfTemplate.style.position = 'absolute';
                    pdfTemplate.style.left = '-9999px'; // Move it off-screen

                    // Set a fixed width to simulate PDF page width
                    // This is crucial for html2canvas to render consistent layout
                    pdfTemplate.style.width = '800px'; // Approx. A4 width in pixels (adjust if needed)

                    const canvas = await html2canvas(pdfTemplate, {
                        scale: 2, // Higher scale for better quality PDF
                        useCORS: true, // If your logo is from a different origin
                        logging: true, // Enable logging for debugging
                        windowWidth: 800 // Ensure html2canvas uses this width for calculation
                    });

                    // Hide the template again
                    pdfTemplate.style.display = 'none';
                    pdfTemplate.style.position = 'static'; // Reset position
                    pdfTemplate.style.width = ''; // Reset width

                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

                    // Calculate dimensions to fit image on page, handling aspect ratio
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const imgHeight = canvas.height * imgWidth / canvas.width;

                    let heightLeft = imgHeight;
                    let position = 0;

                    // Add the image to the PDF, breaking into pages if necessary
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight; // Calculate position for the next page segment
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    pdf.save(`Formulir_Talent_HikayyaraKizuna_${fullName.replace(/\s/g, '_')}.pdf`);

                    formMessage.textContent = 'Pendaftaran Anda sukses! Dokumen PDF Anda sedang diunduh.';
                    formMessage.classList.remove('error');
                    formMessage.classList.add('success');

                    talentRegistrationForm.reset(); // Kosongkan form setelah sukses
                    document.getElementById('agreeTerms').checked = false; // Reset checkbox
                    if (submissionDateInput) {
                        const today = new Date();
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        submissionDateInput.value = today.toLocaleDateString('id-ID', options); // Set ulang tanggal
                    }

                } catch (error) {
                    console.error('Error generating PDF:', error);
                    formMessage.textContent = 'Pendaftaran sukses, namun gagal mengunduh PDF. Silakan coba lagi atau hubungi admin.';
                    formMessage.classList.remove('success');
                    formMessage.classList.add('error');
                }
            }
        });
    }
});
