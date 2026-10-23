/**
 * Books Registry and Consolidated Datasets
 * 5 Classical Madrasah Textbooks:
 * 1. quduri - Mukhtasar al-Quduri (Fikih)
 * 2. talhis - Talkhis al-Miftah (Balaghah)
 * 3. kafiye - Al-Kafiyah (Nahwu)
 * 4. menar  - Manar al-Anwar (Ushul Fiqh)
 * 5. akaid  - Matn al-'Aqa'id (Akidah & Kalam)
 *
 * Zero emojis - 100% Bilingual
 */

import { quduriData } from './quduri.js';
import { talhisData } from './talhis.js';
import { kafiyeData } from './kafiye.js';
import { menarData } from './menar.js';
import { akaidData } from './akaid.js';

export const booksMetadata = {
  quduri: {
    id: "quduri",
    titleTr: "Muhtasarü'l-Kudûrî",
    titleId: "Mukhtashar al-Quduri",
    titleAr: "مختصر القدوري",
    categoryTr: "Fıkıh",
    categoryId: "Fikih",
    descTr: "Hanefî mezhebinin temel metinlerinden meşhur fıkıh muhtasarı.",
    descId: "Ringkasan fikih madzhab Hanafi yang sangat populer dan otoritatif.",
    totalChapters: 9,
    totalQuestions: quduriData.length,
    authorTr: "Ebû'l-Hasan el-Kudûrî",
    authorId: "Abul Hasan al-Quduri",
    themeColor: "#059669"
  },
  talhis: {
    id: "talhis",
    titleTr: "Telhîsu'l-Miftâh",
    titleId: "Talkhis al-Miftah",
    titleAr: "تلخيص المفتاح",
    categoryTr: "Belâgat",
    categoryId: "Balaghah",
    descTr: "Meânî, beyân ve bedî' ilimlerini cem eden belâgat şaheseri.",
    descId: "Karya agung balaghah yang merangkum ilmu ma'ani, bayan, dan badi'.",
    totalChapters: 10,
    totalQuestions: talhisData.length,
    authorTr: "Hatîb el-Kazvînî",
    authorId: "Khatib al-Qazwini",
    themeColor: "#4F46E5"
  },
  kafiye: {
    id: "kafiye",
    titleTr: "el-Kâfiye",
    titleId: "Al-Kafiyah",
    titleAr: "الكافية",
    categoryTr: "Nahiv",
    categoryId: "Nahwu",
    descTr: "İbnü'l-Hâcib'in Arapça gramer ve nahiv kaidelerini toplayan eseri.",
    descId: "Karya Ibnu al-Hajib tentang kaidah tata bahasa nahwu bahasa Arab.",
    totalChapters: 8,
    totalQuestions: kafiyeData.length,
    authorTr: "İbnü'l-Hâcib",
    authorId: "Ibnu al-Hajib",
    themeColor: "#D97706"
  },
  menar: {
    id: "menar",
    titleTr: "Menâru'l-Envâr",
    titleId: "Manar al-Anwar",
    titleAr: "منار الأنوار",
    categoryTr: "Fıkıh Usûlü",
    categoryId: "Ushul Fiqh",
    descTr: "İmam Nesefî'nin Hanefî fıkıh usûlüne dair muteber metni.",
    descId: "Karya Imam an-Nasafi tentang pokok-pokok ushul fiqh madzhab Hanafi.",
    totalChapters: 10,
    totalQuestions: menarData.length,
    authorTr: "Hâfızüddîn en-Nesefî",
    authorId: "Hafizhud Din an-Nasafi",
    themeColor: "#0284C7"
  },
  akaid: {
    id: "akaid",
    titleTr: "Metn-i Akāid",
    titleId: "Matn al-'Aqa'id",
    titleAr: "متن العقائد",
    categoryTr: "Akāid & Kelâm",
    categoryId: "Akidah & Kalam",
    descTr: "Necmeddîn en-Nesefî'nin Ehl-i Sünnet akîdesini özetleyen temel metni.",
    descId: "Matan akidah Ahlus Sunnah wal Jama'ah ringkas karya Najmuddin an-Nasafi.",
    totalChapters: 5,
    totalQuestions: akaidData.length,
    authorTr: "Necmeddîn Ömer en-Nesefî",
    authorId: "Najmuddin Umar an-Nasafi",
    themeColor: "#7C3AED"
  }
};

export const booksData = {
  quduri: quduriData,
  talhis: talhisData,
  kafiye: kafiyeData,
  menar: menarData,
  akaid: akaidData
};
