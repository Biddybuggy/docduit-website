import { IResep } from '@/app/[lang]/(chat)/consultation/_components/PrescriptionModal';
import { getRandomFromStringArray } from './utils';

export const templateIDList = ['A22A', 'A22B', 'A22C'];

export type TemplateConversations = {
  id: string;
  question?: string;
  questions?: string[];
  options?: string[];
};

export type TemplateTopic = {
  id: string;
  topics: string[];
  conversations: TemplateConversations[];
};

export const templateChatLibraries: TemplateTopic[] = [
  {
    id: 'A22A',
    topics: [
      'Bagaimana cara menabung yang baik?',
      'Tips apa yang bisa membantu saya menabung dengan lebih efektif?',
      'Bagaimana sih cara menabung yang bisa memberikan hasil terbaik?',
      'Apa langkah-langkah yang harus saya lakukan agar bisa menabung dengan baik?',
      'Bagaimana cara agar menabung jadi lebih mudah dan efektif?',
    ],
    conversations: [
      {
        id: 'A22A1',
        question: 'Apakah kamu sudah menikah?',
        options: ['Belum', 'Sudah']
      },
      {
        id: 'A22A2',
        question: 'Apakah pengeluaranmu lebih besar daripada pendapatanmu?',
        options: ['Ya', 'Tidak']
      },
      {
        id: 'A22A3',
        question: 'Berapakah pendapatmu dalam sebulan (IDR)?',
        options: ['Kurang dari 5 juta', '5-10 juta', '10-15 juta', 'Lebih dari 15 juta']
      },
      {
        id: 'A22A4',
        question: 'Apakah kamu sudah punya 2 rekening bank?',
        options: ['Ya', 'Tidak']
      },
      {
        id: 'A22A5',
        question: 'Berapakah total cicilan yang harus kamu bayar tiap bulan?',
        options: ['Kurang dari 1 juta', '1-3 juta', '3-5 juta', 'Lebih dari 5 juta']
      },
      {
        id: 'A22A6',
        question: 'Apakah kamu sudah pernah menabung emas?',
        options: ['Sudah', 'Belum']
      },
      {
        id: 'A22A7',
        question: 'Apakah kamu sudah pernah menabung mata uang asing (USD, SGD, JPY, dll)?',
        options: ['Sudah', 'Belum']
      },
    ],
  },
  {
    id: 'A22B',
    topics: [
      'Bagaimana strategi membagi gaji saya untuk kebutuhan dan tabungan?',
      'Bagaimana cara terbaik membagi gaji saya antara kebutuhan dan tabungan?',
      'Apa strategi yang tepat untuk membagi gaji antara kebutuhan dan tabungan?',
      'Bagaimana sebaiknya saya membagi gaji untuk keperluan sehari-hari dan tabungan?',
    ],
    conversations: [
      {
        id: 'A22B1',
        question: 'Apakah kamu sudah menikah?',
        options: ['Belum', 'Sudah']
      },
      {
        id: 'A22B2',
        question: 'Berapakah pendapatmu dalam sebulan?',
        options: ['Kurang dari 5 juta', '5-10 juta', '10-15 juta', 'Lebih dari 15 juta']
      },
      {
        id: 'A22B3',
        question: 'Apakah kamu sudah punya 2 rekening bank?',
        options: ['Ya', 'Tidak']
      },
      {
        id: 'A22B4',
        question: 'Berapakah total cicilan yang harus kamu bayar tiap bulan?',
        options: ['Kurang dari 1 juta', '1-3 juta', '3-5 juta', 'Lebih dari 5 juta']
      },
      {
        id: 'A22B5',
        question: 'Apakah kamu sudah pernah menabung emas?',
        options: ['Sudah', 'Belum']
      },
      {
        id: 'A22B6',
        question: 'Apakah kamu sudah pernah menabung mata uang asing (USD, SGD, JPY, dll)?',
        options: ['Sudah', 'Belum']
      },
    ],
  },
  {
    id: 'A22C',
    topics: [
      'Bagaimana memilih instrumen investasi yang tepat untuk saya?',
      'Bagaimana cara tahu investasi yang sesuai?',
    ],
    conversations: [
      {
        id: 'A22C1',
        questions: [
          "wah, sudah berpikir untuk berinvestasi, that's good! Apakah kamu bisa menyisihkan minimal 20% dari pendapatan bulananmu untuk menabung/berinvestasi?",
          'Wah, bagus sekali sudah mulai berpikir untuk berinvestasi! Apakah kamu mampu menyisihkan setidaknya 20% dari pendapatan bulananmu untuk tabungan atau investasi?',
          'Wah, keren sudah mulai berpikir investasi! Bisa kah kamu menyisihkan 20% dari pendapatan bulananmu untuk tabungan atau investasi?',
        ],
      },
      {
        id: 'A22C2',
        questions: ['Apakah kamu sudah punya  2 rekening bank?'],
      },
      {
        id: 'A22C3',
        questions: [
          'apa tujuanmu berinvestasi?',
          'Apa yang ingin kamu capai dengan berinvestasi?',
          'Apa target kamu dalam berinvestasi?',
          'Apa alasan kamu berinvestasi?',
        ],
      },
      {
        id: 'A22C4',
        questions: [
          'berapa lama waktu untuk mencapai tujuan tersebut?',
          'Berapa lama kamu perkirakan untuk mencapai tujuan tersebut?',
          'Seberapa lama waktu yang kamu butuhkan untuk mencapai tujuan itu?',
          'Seberapa cepat kamu targetkan untuk mencapai tujuan itu?',
        ],
      },
      {
        id: 'A22C5',
        questions: [
          'Manakah yang kamu merasa cocok untuk dirimu?',
          'Mana yang menurutmu paling cocok untuk dirimu?',
          'Yang mana yang kamu rasa paling sesuai untukmu?',
        ],
      },
    ],
  },
];

// English versions for open-ended quiz templates (A22A/A22B).
// Note: Prescription images may still be rendered in Bahasa Indonesia for now.
export const templateChatLibrariesEn: TemplateTopic[] = [
  {
    id: 'A22A',
    topics: [
      'What are the best saving practices?',
      'What tips can help me save more effectively?',
      'How do I save in a way that gives the best results?',
      'What steps should I take to save well?',
      'How can I make saving easier and more effective?',
    ],
    conversations: [
      {
        id: 'A22A1',
        question: 'Are you married or not?',
        options: ['Not married', 'Married']
      },
      {
        id: 'A22A2',
        question: 'Is your spending greater than your income?',
        options: ['Yes', 'No']
      },
      {
        id: 'A22A3',
        question: 'What is your monthly income (IDR)?',
        options: ['Less than 5 million', '5-10 million', '10-15 million', 'More than 15 million']
      },
      {
        id: 'A22A4',
        question: 'Do you already have 2 bank accounts?',
        options: ['Yes', 'No']
      },
      {
        id: 'A22A5',
        question: 'How much do you need to pay in total installments every month?',
        options: ['Less than 1 million', '1-3 million', '3-5 million', 'More than 5 million']
      },
      {
        id: 'A22A6',
        question: 'Have you ever saved money in gold?',
        options: ['Yes', 'No']
      },
      {
        id: 'A22A7',
        question: 'Have you ever saved in foreign currency (USD, SGD, JPY, etc.)?',
        options: ['Yes', 'No']
      },
    ],
  },
  {
    id: 'A22B',
    topics: [
      'How can I divide my salary between needs and savings?',
      'What is the best way to split my salary between needs and savings?',
      'What is the right strategy to split your salary between needs and savings?',
      'How should I divide my salary for daily expenses and savings?',
    ],
    conversations: [
      {
        id: 'A22B1',
        question: 'Are you married or not?',
        options: ['Not married', 'Married']
      },
      {
        id: 'A22B2',
        question: 'What is your monthly income?',
        options: ['Less than 5 million', '5-10 million', '10-15 million', 'More than 15 million']
      },
      {
        id: 'A22B3',
        question: 'Do you already have 2 bank accounts?',
        options: ['Yes', 'No']
      },
      {
        id: 'A22B4',
        question: 'How much do you need to pay in total installments every month?',
        options: ['Less than 1 million', '1-3 million', '3-5 million', 'More than 5 million']
      },
      {
        id: 'A22B5',
        question: 'Have you ever saved money in gold?',
        options: ['Yes', 'No']
      },
      {
        id: 'A22B6',
        question: 'Have you ever saved in foreign currency (USD, SGD, JPY, etc.)?',
        options: ['Yes', 'No']
      },
    ],
  },
];

export type SelectedConversations = {
  id: string;
  question: string;
};

export type SelectedTemplate = {
  id: string;
  topic: string;
  conversations: SelectedConversations[];
};

export const getTemplateQuestions = (id: string, lang: string = 'id'): string[] => {
  const libs = lang === 'en' ? templateChatLibrariesEn : templateChatLibraries;
  const templateChat = libs.find((item) => item.id === id);
  if (!templateChat) return [];
  return (
    templateChat?.conversations.map((item) =>
      item.question || getRandomFromStringArray(item?.questions || []),
    ) || []
  );
};

export const getTemplateConversations = (id: string, lang: string = 'id'): TemplateConversations[] => {
  const libs = lang === 'en' ? templateChatLibrariesEn : templateChatLibraries;
  const templateChat = libs.find((item) => item.id === id);
  return templateChat?.conversations || [];
};

export const getTemplateTopic = (id: string, lang: string = 'id'): string => {
  const libs = lang === 'en' ? templateChatLibrariesEn : templateChatLibraries;
  const templateChat = libs.find((item) => item.id === id);
  if (!templateChat) return '';
  return getRandomFromStringArray(templateChat?.topics || []);
};

// Multiple Choice Template
export const choicesTemplateLibraries = {
  topic: 'Bagaimana memilih instrumen investasi yang tepat untuk saya?',
  conversations: [
    {
      question:
        'Bagaimana Anda memilih instrumen investasi yang tepat untuk Anda?',
      options: [
        'Saya lebih memilih instrumen yang aman dan stabil, meskipun imbal hasilnya rendah.',
        'Saya bersedia mengambil sedikit risiko demi potensi keuntungan yang lebih besar.',
        'Saya siap menghadapi fluktuasi tinggi demi peluang imbal hasil yang maksimal.',
      ],
    },
    {
      question:
        'Apa yang Anda rasakan jika nilai investasi Anda turun 10% dalam satu bulan?',
      options: [
        'Panik dan ingin segera menarik dana saya.',
        'Cemas, tetapi akan tetap memantau sambil mempertimbangkan langkah selanjutnya.',
        'Tidak masalah, saya melihatnya sebagai bagian dari investasi jangka panjang.',
      ],
    },
    {
      question: 'Apa tujuan utama Anda dalam berinvestasi?',
      options: [
        'Menjaga nilai uang agar tidak tergerus inflasi.',
        'Mengembangkan kekayaan secara stabil dalam jangka menengah-panjang.',
        'Mendapatkan pertumbuhan aset yang tinggi secepat mungkin.',
      ],
    },
    {
      question: 'Berapa lama jangka waktu investasi Anda?',
      options: ['Kurang dari 3 tahun.', '3-7 tahun.', 'Lebih dari 7 tahun.'],
    },
    {
      question: 'Seberapa besar toleransi Anda terhadap risiko kerugian?',
      options: [
        'Tidak tahan rugi, saya ingin nilai investasi saya stabil.',
        'Saya bisa menerima kerugian kecil sesekali.',
        'Saya siap menghadapi kerugian besar demi potensi imbal hasil yang lebih tinggi.',
      ],
    },
  ],
};

export const choicesTemplateLibrariesEn = {
  topic: 'How to choose the right investment instrument for me?',
  conversations: [
    {
      question: 'How do you choose the right investment instrument for you?',
      options: [
        'I prefer safe and stable instruments, even if the returns are low.',
        'I am willing to take a little risk for potentially higher returns.',
        'I am ready to face high fluctuations for the chance of maximum returns.',
      ],
    },
    {
      question:
        'How would you feel if your investment value dropped by 10% in one month?',
      options: [
        'Panic and want to withdraw my funds immediately.',
        'Anxious, but will keep monitoring while considering the next step.',
        'No problem, I see it as part of long-term investment.',
      ],
    },
    {
      question: 'What is your main goal in investing?',
      options: [
        'Preserving the value of money against inflation.',
        'Growing wealth steadily in the medium-long term.',
        'Getting high asset growth as quickly as possible.',
      ],
    },
    {
      question: 'How long is your investment timeframe?',
      options: ['Less than 3 years.', '3-7 years.', 'More than 7 years.'],
    },
    {
      question: 'What is your tolerance for loss risk?',
      options: [
        'Cannot tolerate loss, I want my investment value to remain stable.',
        'I can accept small losses occasionally.',
        'I am ready to face large losses for potentially higher returns.',
      ],
    },
  ],
};

export const getChoicesTemplateTopic = (lang: string = 'id') => {
  const templateChat =
    lang === 'en' ? choicesTemplateLibrariesEn : choicesTemplateLibraries;
  return templateChat?.topic || '';
};

export const getChoicesTemplateQuestions = (lang: string = 'id') => {
  const templateChat =
    lang === 'en' ? choicesTemplateLibrariesEn : choicesTemplateLibraries;
  if (!templateChat) return [];
  return templateChat?.conversations.map((item) => item.question) || [];
};

export const getChoicesTemplateOptions = (lang: string = 'id') => {
  const templateChat =
    lang === 'en' ? choicesTemplateLibrariesEn : choicesTemplateLibraries;
  if (!templateChat) return [];
  return templateChat?.conversations?.map((item) => item.options) || [];
};

export const getChoicesTemplateAnswer = (scores: number[], lang: string = 'id', topic: string = '') => {
  const isEn = lang === 'en';
  if (topic.includes('investasi') || topic.includes('investment')) {
    const total = scores.reduce((a, b) => a + b, 0);
    if (total >= 5 && total <= 7) {
      return isEn
        ? 'Risk Profile: **Conservative**\n\nYou prefer safety and stability, suitable for deposits, money market funds, or government bonds. Allocation:\n\n -Deposits/SBN (Retail Bonds): 20%\n\n -Gold: 25%\n\n -US Dollar Savings: 15%\n\n -Government Bonds IDR / USD: 30%\n\n -Stocks / Equity Funds: 10%'
        : 'Profil Risiko: **Konservatif**\n\nAnda lebih suka keamanan dan stabilitas, cocok dengan deposito, reksa dana pasar uang, atau obligasi pemerintah. Alokasi:\n\n -Deposito/SBN (Retail Bonds): 20%\n\n -Emas: 25%\n\n -Tabungan US Dollar: 15%\n\n -Obligasi Pemerintah IDR / USD: 30%\n\n -Saham / Reksa Dana Saham: 10%';
    } else if (total >= 8 && total <= 11) {
      return isEn
        ? 'Risk Profile: **Moderate**\n\nYou are willing to take limited risks for better returns, suitable for balanced funds or medium-term blue-chip stocks. Allocation:\n\n -Deposits/SBN (Retail Bonds): 15%\n\n -Gold: 15%\n\n -US Dollar Savings: 10%\n\n -Government Bonds IDR / USD: 35%\n\n -Stocks / Equity Funds: 25%'
        : 'Profil Risiko: **Moderat**\n\nAnda bersedia mengambil risiko terbatas untuk imbal hasil yang lebih baik, cocok dengan reksa dana campuran atau saham blue chip jangka menengah. Alokasi:\n\n -Deposito/SBN (Retail Bonds): 15%\n\n -Emas: 15%\n\n -Tabungan US Dollar: 10%\n\n -Obligasi Pemerintah IDR / USD: 35%\n\n -Saham / Reksa Dana Saham: 25%';
    } else if (total >= 12 && total <= 15) {
      return isEn
        ? 'Risk Profile: **Aggressive**\n\nYou are ready to take big risks for optimal growth, suitable for stocks, crypto, and alternative investments. Allocation:\n\n -Deposits/SBN (Retail Bonds): 10%\n\n -Gold: 10%\n\n -US Dollar Savings: 10%\n- Government Bonds IDR / USD: 20%\n\n -Stocks / Equity Funds: 50%'
        : 'Profil Risiko: **Agresif**\n\nAnda siap mengambil risiko besar demi pertumbuhan optimal, cocok dengan saham, kripto, dan investasi alternatif. Alokasi:\n\n -Deposito/SBN (Retail Bonds): 10%\n\n -Emas: 10%\n\n -Tabungan US Dollar: 10%\n- Obligasi Pemerintah IDR / USD: 20%\n\n -Saham / Reksa Dana Saham: 50%';
    } else {
      return isEn
        ? 'Risk Profile: **Unknown**\n\nAllocation: Not available.'
        : 'Profil Risiko: **Tidak Diketahui**\n\nAlokasi: Tidak tersedia.';
    }
  } else if (topic.includes('menabung') || topic.includes('save')) {
    // Logic for saving
    let message = '';
    const [marriage, expenditure, income, accounts, cicilan, gold, foreign] = scores;
    if (expenditure === 0) { // Ya, expenditure > income
      message = isEn
        ? 'Your expenditure is greater than your income. Focus on reducing expenses and increasing income. Reduce unnecessary costs like hanging out or impulse buying.'
        : 'Pengeluaran Anda lebih besar dari pendapatan. Fokuslah untuk mengurangi pengeluaran dan meningkatkan pendapatan. Kurangi biaya yang tidak perlu seperti nongkrong atau belanja impulsif.';
    } else {
      const incomeApprox = [4, 7.5, 12.5, 20][income] * 1000000;
      const cicilanApprox = [0.5, 2, 4, 6][cicilan] * 1000000;
      if (cicilanApprox > incomeApprox * 0.3) {
        message = isEn
          ? 'Your installments are too large, maximum 30% of income. Reduce installments and living costs so you can save.'
          : 'Cicilan Anda terlalu besar, maksimal 30% dari pendapatan. Kurangi cicilan dan biaya hidup agar bisa menabung.';
      } else {
        message = isEn
          ? 'You are quite good at managing finances. Make sure savings 20%, installments max 30%, living needs 50%.'
          : 'Anda sudah cukup baik dalam mengelola keuangan. Pastikan tabungan 20%, cicilan maksimal 30%, dan kebutuhan hidup 50%.';
      }
    }
    if (accounts === 0) {
      message += isEn
        ? ' Create 2 bank accounts to separate savings from the main account.'
        : ' Buatlah 2 rekening bank untuk memisahkan tabungan dari rekening utama.';
    }
    if (gold === 0) {
      message += isEn
        ? ' Try saving gold as diversification.'
        : ' Cobalah menabung emas sebagai diversifikasi.';
    }
    if (foreign === 0) {
      message += isEn
        ? ' Try saving foreign currency for hedging.'
        : ' Cobalah menabung mata uang asing untuk lindung nilai.';
    }
    return message;
  } else if (topic.includes('membagi gaji') || topic.includes('divide salary')) {
    // Logic for salary division
    let message = '';
    const [marriage, income, accounts, cicilan, gold, foreign] = scores;
    const incomeApprox = [4, 7.5, 12.5, 20][income] * 1000000;
    const cicilanApprox = [0.5, 2, 4, 6][cicilan] * 1000000;
    if (cicilanApprox > incomeApprox * 0.3) {
      message = isEn
        ? 'Your installments are too large, maximum 30% of income. Reduce installments and living costs so you can save.'
        : 'Cicilan Anda terlalu besar, maksimal 30% dari pendapatan. Kurangi cicilan dan biaya hidup agar bisa menabung.';
    } else {
      message = isEn
        ? 'You are quite good at managing finances. Make sure savings 20%, installments max 30%, living needs 50%.'
        : 'Anda sudah cukup baik dalam mengelola keuangan. Pastikan tabungan 20%, cicilan maksimal 30%, dan kebutuhan hidup 50%.';
    }
    if (accounts === 0) {
      message += isEn
        ? ' Create 2 bank accounts to separate savings from the main account.'
        : ' Buatlah 2 rekening bank untuk memisahkan tabungan dari rekening utama.';
    }
    if (gold === 0) {
      message += isEn
        ? ' Try saving gold as diversification.'
        : ' Cobalah menabung emas sebagai diversifikasi.';
    }
    if (foreign === 0) {
      message += isEn
        ? ' Try saving foreign currency for hedging.'
        : ' Cobalah menabung mata uang asing untuk lindung nilai.';
    }
    return message;
  } else {
    return isEn
      ? 'Unknown topic.'
      : 'Topik tidak dikenal.';
  }
};

export const getChoicesTemplateAnswerForResep = (
  score: number,
  lang: string = 'id',
): IResep => {
  const isEn = lang === 'en';
  if (score >= 5 && score <= 7) {
    return {
      profile: isEn ? 'Conservative' : 'Konservatif',
      text: isEn
        ? 'You prefer safety and stability, suitable for deposits, money market funds, or government bonds.'
        : 'Anda lebih suka keamanan dan stabilitas, cocok dengan deposito, reksa dana pasar uang, atau obligasi pemerintah.',
      allocation: isEn
        ? [
            'Deposits/SBN (Retail Bonds): 20%',
            'Gold: 25%',
            'US Dollar Savings: 15%',
            'Government Bonds IDR / USD: 30%',
            'Stocks / Equity Funds: 10%',
          ]
        : [
            'Deposito/SBN (Retail Bonds): 20%',
            'Emas: 25%',
            'Tabungan US Dollar: 15%',
            'Obligasi Pemerintah IDR / USD: 30%',
            'Saham / Reksa Dana Saham: 10%',
          ],
    };
  } else if (score >= 8 && score <= 11) {
    return {
      profile: isEn ? 'Moderate' : 'Moderat',
      text: isEn
        ? 'You are willing to take limited risks for better returns, suitable for balanced funds or medium-term blue-chip stocks.'
        : 'Anda bersedia mengambil risiko terbatas untuk imbal hasil yang lebih baik, cocok dengan reksa dana campuran atau saham blue chip jangka menengah.',
      allocation: isEn
        ? [
            'Deposits/SBN (Retail Bonds): 15%',
            'Gold: 15%',
            'US Dollar Savings: 10%',
            'Government Bonds IDR / USD: 35%',
            'Stocks / Equity Funds: 25%',
          ]
        : [
            'Deposito/SBN (Retail Bonds): 15%',
            'Emas: 15%',
            'Tabungan US Dollar: 10%',
            'Obligasi Pemerintah IDR / USD: 35%',
            'Saham / Reksa Dana Saham: 25%',
          ],
    };
  } else if (score >= 12 && score <= 15) {
    return {
      profile: isEn ? 'Aggressive' : 'Agresif',
      text: isEn
        ? 'You are ready to take big risks for optimal growth, suitable for stocks, crypto, and alternative investments.'
        : 'Anda siap mengambil risiko besar demi pertumbuhan optimal, cocok dengan saham, kripto, dan investasi alternatif.',
      allocation: isEn
        ? [
            'Deposits/SBN (Retail Bonds): 10%',
            'Gold: 10%',
            'US Dollar Savings: 10%',
            'Government Bonds IDR / USD: 20%',
            'Stocks / Equity Funds: 50%',
          ]
        : [
            'Deposito/SBN (Retail Bonds): 10%',
            'Emas: 10%',
            'Tabungan US Dollar: 10%',
            'Obligasi Pemerintah IDR / USD: 20%',
            'Saham / Reksa Dana Saham: 50%',
          ],
    };
  } else {
    return {
      profile: isEn ? 'Unknown' : 'Tidak Diketahui',
      text: isEn ? 'Allocation: Not available.' : 'Alokasi: Tidak tersedia.',
      allocation: [],
    };
  }
};
