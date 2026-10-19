/**
 * Settings Modal & Algorithm Explanation Popup Component
 * 100% Bebas Emoji: Zero unicode emojis anywhere in code, SVG, or markup.
 * 100% Dwibahasa Penuh: Complete Turkish & Indonesian bilingual reactivity.
 */

import { dictionary } from '../data/dictionary.js';
import { booksMetadata } from '../data/books.js';
import { getIconSvg } from './icons.js';
import { loadSettings, saveSettings, resetUserProgress } from '../state/storage.js';
import { playPureSfx } from '../services/audio.js';

/**
 * Returns detailed explanation, mathematical logic, and step-by-step workflow
 * for the selected learning algorithm in Turkish or Indonesian.
 *
 * @param {string} algoType - 'original' | 'random' | 'sequential' | 'spaced'
 * @param {string} [lang='tr'] - 'tr' | 'id'
 * @returns {{ title: string, description: string, mathLogic: string, workflow: string[] }}
 */
export function getAlgorithmExplanation(algoType, lang = 'tr') {
  const currentLang = lang === 'id' ? 'id' : 'tr';
  const normAlgo = algoType === 'original' || algoType === 'random' ? 'random' : algoType;

  const explanations = {
    random: {
      tr: {
        title: "Orijinal Rastgele (Döngüsel) Algoritması",
        description: "Tüm soruları karıştırarak sunar. Bir döngüde mevcut bütün sorular bitmeden hiçbir soru ikinci kez karşınıza çıkmaz.",
        mathLogic: "Soru kümesi N elemanlı ise, Fisher-Yates karıştırma yöntemiyle [0, N-1] arası rastgele permütasyon oluşturulur. Karıştırılmış kuyruk sırayla tüketilir. Kuyruk boşaldığında döngü tamamlanır ve yeni bir döngü başlar.",
        workflow: [
          "Tüm soruların indeks listesi oluşturulur.",
          "İndeksler rastgele ve eşit olasılıkla karıştırılır.",
          "Kullanıcı her soru cevapladığında sıradaki indeks sunulur.",
          "Tüm liste bittiğinde döngü sıfırlanıp yeniden karıştırılır."
        ]
      },
      id: {
        title: "Algoritma Acak Asli (Siklik)",
        description: "Mengocok soal secara acak. Seluruh soal dijamin keluar satu kali sebelum ada soal yang berulang.",
        mathLogic: "Untuk himpunan soal berukuran N, permutasi acak [0, N-1] dihasilkan menggunakan pengocokan Fisher-Yates. Antrean teracak diambil satu per satu. Saat antrean habis, satu siklus selesai dan siklus baru dimulai.",
        workflow: [
          "Daftar indeks seluruh butir soal dibuat.",
          "Indeks dikocok secara acak merata.",
          "Setiap kali pengguna menjawab, indeks berikutnya ditampilkan.",
          "Setelah semua soal muncul satu kali, antrean direset dan dikocok ulang."
        ]
      }
    },
    sequential: {
      tr: {
        title: "Sıralı Tertip Modu",
        description: "Kitabın kendi asıl konu ve soru numarasına göre 1'den son soruya kadar sırayla ilerler.",
        mathLogic: "Matematiksel olarak i = (i + 1) mod N bağıntısıyla çalışır. Sorular eserin orijinal telif sırasına ve bab tertibine göre ardışık olarak gösterilir.",
        workflow: [
          "Sorular kitap ve bab indeksine göre sıralanır.",
          "İlk sorudan başlanarak ardışık ilerlenir.",
          "Kitabın veya babın sonuna ulaşıldığında başa döner."
        ]
      },
      id: {
        title: "Mode Urut Terstruktur",
        description: "Menampilkan soal berurutan dari nomor 1 sampai akhir sesuai urutan bab naskah aslinya.",
        mathLogic: "Beroperasi secara matematis dengan rumus i = (i + 1) mod N. Soal ditampilkan secara linier berurutan sesuai naskah asli kitab.",
        workflow: [
          "Soal diurutkan berdasarkan bab dan nomor urut aslinya.",
          "Belajar dimulai dari butir pertama secara beruntun.",
          "Ketika mencapai akhir bab atau kitab, urutan akan kembali ke awal."
        ]
      }
    },
    spaced: {
      tr: {
        title: "Akıllı Tekrar (Ağırlıklı Tekrar) Algoritması",
        description: "Tekrar Et olarak işaretlenen veya zorlanılan sorulara 3 kat daha fazla çıkma ihtimali tanır.",
        mathLogic: "Ağırlıklı olasılık dağılımı: 'Tekrar Et' listesindeki sorulara ağırlık w=3, normal veya 'Hatırladım' listesindeki sorulara w=1 atanır. P(soru_i) = w_i / Σ(w_j) formülüyle zorlanılan soruların seçilme olasılığı 3 kat artırılır.",
        workflow: [
          "Her sorunun değerlendirme durumu kontrol edilir.",
          "Tekrar edilmesi gereken sorulara 3 kat ağırlık verilir.",
          "Ağırlıklı rastgele seçimle soru ekrana getirilir.",
          "Kavranan soruların ağırlığı normale döner."
        ]
      },
      id: {
        title: "Algoritma Pengulangan Cerdas (Berbobot)",
        description: "Memberikan peluang kemunculan 3 kali lipat lebih tinggi untuk soal-soal yang ditandai 'Ulangi Lagi'.",
        mathLogic: "Distribusi probabilitas berbobot: Soal pada daftar 'Ulangi' diberi bobot w=3, sedangkan soal normal/hafal diberi bobot w=1. P(soal_i) = w_i / Σ(w_j), sehingga soal sulit berpeluang muncul 300% lebih sering.",
        workflow: [
          "Status evaluasi masing-masing butir soal dipantau.",
          "Soal yang perlu diulang diberi bobot 3 kali lipat.",
          "Soal dipilih berdasarkan penarikan acak berbobot.",
          "Setelah berhasil dihafal, bobot soal kembali normal."
        ]
      }
    }
  };

  const algoData = explanations[normAlgo] || explanations.random;
  return algoData[currentLang] || algoData.tr;
}

/**
 * Traps keyboard focus within an element.
 *
 * @param {HTMLElement} element - Container modal element
 * @returns {Function} Cleanup function
 */
function trapFocus(element) {
  function handleFocus(e) {
    if (e.key !== 'Tab') return;

    const focusables = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  element.addEventListener('keydown', handleFocus);
  return () => {
    element.removeEventListener('keydown', handleFocus);
  };
}

/**
 * Opens an informative pop-up modal explaining an algorithm's mathematical logic and workflow.
 *
 * @param {string} algoType - 'original' | 'random' | 'sequential' | 'spaced'
 * @param {string} [lang='tr'] - 'tr' | 'id'
 * @returns {() => void} Close function
 */
export function openAlgorithmInfoModal(algoType, lang = 'tr') {
  playPureSfx('click');
  const info = getAlgorithmExplanation(algoType, lang);
  const isTr = lang === 'tr';

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop algo-info-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal-dialog algo-info-modal neu-card p-0';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', info.title);

  modal.innerHTML = `
    <div class="modal-header">
      <div class="flex items-center gap-2">
        <span class="neu-badge neu-badge-accent font-bold">${isTr ? 'ALGORİTMA REHBERİ' : 'PANDUAN ALGORITMA'}</span>
        <h3 class="font-bold text-base md:text-lg">${info.title}</h3>
      </div>
      <button class="modal-close-btn neu-button" aria-label="${isTr ? 'Kapat' : 'Tutup'}" title="${isTr ? 'Kapat' : 'Tutup'}">
        ${getIconSvg('close', 18)}
      </button>
    </div>

    <div class="modal-body flex flex-col gap-4">
      <div class="neu-card p-4">
        <h4 class="font-semibold text-sm mb-1 text-secondary">${isTr ? 'Açıklama' : 'Deskripsi'}</h4>
        <p class="text-sm leading-relaxed">${info.description}</p>
      </div>

      <div class="neu-card p-4">
        <h4 class="font-semibold text-sm mb-1 text-secondary">${isTr ? 'Matematiksel Mantık' : 'Logika Matematis'}</h4>
        <p class="text-sm leading-relaxed font-mono text-xs bg-surface p-2 rounded">${info.mathLogic}</p>
      </div>

      <div class="neu-card p-4">
        <h4 class="font-semibold text-sm mb-2 text-secondary">${isTr ? 'İş Akışı Adımları' : 'Tahapan Alur Kerja'}</h4>
        <ol class="text-sm flex flex-col gap-1.5 pl-4 list-decimal">
          ${info.workflow.map(step => `<li class="leading-relaxed">${step}</li>`).join('')}
        </ol>
      </div>
    </div>

    <div class="modal-footer">
      <button class="modal-close-action-btn neu-button neu-button-primary">
        ${isTr ? 'Anladım ve Kapat' : 'Mengerti & Tutup'}
      </button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const cleanupFocus = trapFocus(modal);

  function closeModal() {
    cleanupFocus();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
    if (backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  const closeBtn = modal.querySelector('.modal-close-btn');
  closeBtn?.addEventListener('click', () => {
    playPureSfx('click');
    closeModal();
  });

  const closeActionBtn = modal.querySelector('.modal-close-action-btn');
  closeActionBtn?.addEventListener('click', () => {
    playPureSfx('click');
    closeModal();
  });

  // Autofocus the close button
  closeBtn?.focus();

  return closeModal;
}

/**
 * Opens the application settings modal with theme, language, font size, sound,
 * algorithm selection with info popups, and user data reset.
 *
 * @param {import('../state/store.js').AppStore} store - Reactive application store
 * @returns {() => void} Close function
 */
export function openSettingsModal(store) {
  playPureSfx('click');
  const state = store.getState();
  const currentLang = state.activeLang || 'tr';
  const dict = dictionary[currentLang] || dictionary.tr;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop settings-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal-dialog settings-modal neu-card p-0';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', dict.settingsTitle);

  function getSettingsHtml() {
    const s = store.getState();
    const l = s.activeLang || 'tr';
    const d = dictionary[l] || dictionary.tr;
    const isDark = Boolean(s.isDarkMode);
    const isMuted = Boolean(s.isAudioMuted);
    const fontSize = s.fontSize || 'medium';
    const activeAlgo = s.activeAlgorithm || 'random';

    return `
      <div class="modal-header">
        <div class="flex items-center gap-2">
          ${getIconSvg('settings', 20)}
          <h3 class="font-bold text-lg">${d.settingsTitle}</h3>
        </div>
        <button class="modal-close-btn neu-button" aria-label="${d.close}" title="${d.close}">
          ${getIconSvg('close', 18)}
        </button>
      </div>

      <div class="modal-body flex flex-col gap-5">
        <!-- 1. Theme Selection -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-secondary">${d.themeToggle}</label>
          <div class="flex items-center gap-3">
            <button id="setting-theme-light" class="neu-button flex-1${!isDark ? ' active font-bold' : ''}">
              ${getIconSvg('sun', 16)}
              <span>${d.themeLight}</span>
            </button>
            <button id="setting-theme-dark" class="neu-button flex-1${isDark ? ' active font-bold' : ''}">
              ${getIconSvg('moon', 16)}
              <span>${d.themeDark}</span>
            </button>
          </div>
        </div>

        <!-- 2. Language Selection -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-secondary">${d.langToggle}</label>
          <div class="flex items-center gap-3">
            <button id="setting-lang-tr" class="neu-button flex-1${l === 'tr' ? ' active font-bold' : ''}">
              <span>${d.langTr}</span>
            </button>
            <button id="setting-lang-id" class="neu-button flex-1${l === 'id' ? ' active font-bold' : ''}">
              <span>${d.langId}</span>
            </button>
          </div>
        </div>

        <!-- 3. Font Size Stepper -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-secondary">${d.fontSizeLabel}</label>
          <div class="flex items-center gap-2">
            <button id="setting-font-small" class="neu-button flex-1${fontSize === 'small' ? ' active font-bold' : ''}">
              <span class="text-xs">${d.fontSmall}</span>
            </button>
            <button id="setting-font-medium" class="neu-button flex-1${fontSize === 'medium' || fontSize === 'normal' ? ' active font-bold' : ''}">
              <span class="text-sm">${d.fontMedium}</span>
            </button>
            <button id="setting-font-large" class="neu-button flex-1${fontSize === 'large' ? ' active font-bold' : ''}">
              <span class="text-base font-semibold">${d.fontLarge}</span>
            </button>
          </div>
        </div>

        <!-- 4. Sound Toggle -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-secondary">${d.soundEffectToggle}</label>
          <button id="setting-sound-toggle" class="neu-button w-full justify-between">
            <div class="flex items-center gap-2">
              ${getIconSvg(isMuted ? 'volumeOff' : 'volumeOn', 18)}
              <span>${isMuted ? d.soundOff : d.soundOn}</span>
            </div>
            <span class="neu-badge${isMuted ? ' neu-badge-warning' : ' neu-badge-success'}">${isMuted ? (l === 'tr' ? 'KAPALI' : 'MATI') : (l === 'tr' ? 'AÇIK' : 'AKTIF')}</span>
          </button>
        </div>

        <!-- 5. Question Ordering Algorithm Selection -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold text-sm text-secondary">${d.shuffleAlgorithm}</label>
          <div class="flex flex-col gap-2">
            <!-- Random / Original -->
            <div class="neu-card p-3 flex items-center justify-between gap-3">
              <label class="flex items-center gap-2.5 cursor-pointer flex-1">
                <input type="radio" name="setting-algorithm" value="random"${activeAlgo === 'random' || activeAlgo === 'original' ? ' checked' : ''} />
                <span class="font-medium text-sm">${d.algoOriginal}</span>
              </label>
              <button class="algo-info-btn neu-button p-2" data-algo="random" aria-label="Bilgi" title="${d.algoExplanationTitle}">
                ${getIconSvg('help', 16)}
              </button>
            </div>

            <!-- Sequential -->
            <div class="neu-card p-3 flex items-center justify-between gap-3">
              <label class="flex items-center gap-2.5 cursor-pointer flex-1">
                <input type="radio" name="setting-algorithm" value="sequential"${activeAlgo === 'sequential' ? ' checked' : ''} />
                <span class="font-medium text-sm">${d.algoSequential}</span>
              </label>
              <button class="algo-info-btn neu-button p-2" data-algo="sequential" aria-label="Bilgi" title="${d.algoExplanationTitle}">
                ${getIconSvg('help', 16)}
              </button>
            </div>

            <!-- Spaced Repetition -->
            <div class="neu-card p-3 flex items-center justify-between gap-3">
              <label class="flex items-center gap-2.5 cursor-pointer flex-1">
                <input type="radio" name="setting-algorithm" value="spaced"${activeAlgo === 'spaced' ? ' checked' : ''} />
                <span class="font-medium text-sm">${d.algoSpaced}</span>
              </label>
              <button class="algo-info-btn neu-button p-2" data-algo="spaced" aria-label="Bilgi" title="${d.algoExplanationTitle}">
                ${getIconSvg('help', 16)}
              </button>
            </div>
          </div>
        </div>

        <!-- 6. Reset Data -->
        <div class="flex flex-col gap-2 pt-2 border-t border-subtle">
          <label class="font-semibold text-sm text-secondary">${d.resetData}</label>
          <button id="btn-reset-data" class="neu-button neu-badge-danger justify-center gap-2 w-full">
            ${getIconSvg('refresh', 16)}
            <span>${d.resetData}</span>
          </button>
          <div id="reset-status" class="text-xs text-center text-secondary"></div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modal-close-footer-btn neu-button neu-button-primary">
          ${d.close}
        </button>
      </div>
    `;
  }

  function renderModalContent() {
    modal.innerHTML = getSettingsHtml();
    attachListeners();
  }

  function attachListeners() {
    const s = store.getState();
    const l = s.activeLang || 'tr';
    const d = dictionary[l] || dictionary.tr;

    // Theme triggers
    const lightBtn = modal.querySelector('#setting-theme-light');
    const darkBtn = modal.querySelector('#setting-theme-dark');

    lightBtn?.addEventListener('click', () => {
      playPureSfx('click');
      store.setState({ isDarkMode: false });
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      saveSettings({ ...loadSettings(), isDarkMode: false });
      renderModalContent();
    });

    darkBtn?.addEventListener('click', () => {
      playPureSfx('click');
      store.setState({ isDarkMode: true });
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      saveSettings({ ...loadSettings(), isDarkMode: true });
      renderModalContent();
    });

    // Language triggers
    const langTrBtn = modal.querySelector('#setting-lang-tr');
    const langIdBtn = modal.querySelector('#setting-lang-id');

    langTrBtn?.addEventListener('click', () => {
      playPureSfx('click');
      store.setState({ activeLang: 'tr' });
      saveSettings({ ...loadSettings(), activeLang: 'tr' });
      renderModalContent();
    });

    langIdBtn?.addEventListener('click', () => {
      playPureSfx('click');
      store.setState({ activeLang: 'id' });
      saveSettings({ ...loadSettings(), activeLang: 'id' });
      renderModalContent();
    });

    // Font size triggers
    const fontSmallBtn = modal.querySelector('#setting-font-small');
    const fontMedBtn = modal.querySelector('#setting-font-medium');
    const fontLargeBtn = modal.querySelector('#setting-font-large');

    function applyFontSize(size) {
      playPureSfx('click');
      store.setState({ fontSize: size });
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-font-size', size);
        document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
      }
      saveSettings({ ...loadSettings(), fontSize: size });
      renderModalContent();
    }

    fontSmallBtn?.addEventListener('click', () => applyFontSize('small'));
    fontMedBtn?.addEventListener('click', () => applyFontSize('medium'));
    fontLargeBtn?.addEventListener('click', () => applyFontSize('large'));

    // Sound toggle
    const soundBtn = modal.querySelector('#setting-sound-toggle');
    soundBtn?.addEventListener('click', () => {
      const nextMuted = !store.getState().isAudioMuted;
      if (!nextMuted) {
        playPureSfx('click');
      }
      store.setState({ isAudioMuted: nextMuted });
      saveSettings({ ...loadSettings(), isAudioMuted: nextMuted });
      renderModalContent();
    });

    // Algorithm radio selection
    const algoRadios = modal.querySelectorAll('input[name="setting-algorithm"]');
    algoRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        playPureSfx('click');
        const selectedAlgo = e.target.value;
        store.setState({ activeAlgorithm: selectedAlgo });
        saveSettings({ ...loadSettings(), activeAlgorithm: selectedAlgo });
        renderModalContent();
      });
    });

    // Info buttons
    const infoBtns = modal.querySelectorAll('.algo-info-btn');
    infoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const algo = btn.getAttribute('data-algo');
        openAlgorithmInfoModal(algo, store.getState().activeLang || 'tr');
      });
    });

    // Reset data
    const resetBtn = modal.querySelector('#btn-reset-data');
    resetBtn?.addEventListener('click', () => {
      const confirmMsg = d.resetConfirm;
      const isConfirmed = typeof window !== 'undefined' ? window.confirm(confirmMsg) : true;
      if (isConfirmed) {
        playPureSfx('toggle');
        // Reset all books
        Object.keys(booksMetadata).forEach(bookKey => {
          resetUserProgress(bookKey);
        });
        store.setState({ lastProgressUpdate: Date.now() });
        const statusEl = modal.querySelector('#reset-status');
        if (statusEl) {
          statusEl.textContent = d.resetSuccess;
          statusEl.className = 'text-xs text-center text-success font-semibold';
        }
      }
    });

    // Close buttons
    modal.querySelector('.modal-close-btn')?.addEventListener('click', () => {
      playPureSfx('click');
      closeModal();
    });
    modal.querySelector('.modal-close-footer-btn')?.addEventListener('click', () => {
      playPureSfx('click');
      closeModal();
    });
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  renderModalContent();

  const cleanupFocus = trapFocus(modal);

  function closeModal() {
    cleanupFocus();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
    if (backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  return closeModal;
}
