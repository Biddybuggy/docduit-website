import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CalculationInputs } from './interfaces';
import { percentageDifferences } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCalculationResult = (inputs: CalculationInputs) => {
  const { term, price, downPayment, budget } = inputs;
  const minus = price - budget;
  const monthlyToSave = minus / term;

  const downPaymentPrice = (price * downPayment) / 100;
  const minusDP = downPaymentPrice - budget;
  const monthlyToSaveDP = minusDP / term;
  const installment36Month = (price - downPaymentPrice) / 36;

  return {
    budget,
    minus,
    minusDP,
    monthlyToSave,
    monthlyToSaveDP,
    installment36Month,
    term,
  };
};

export const getRandomPercentageDifferences = () => {
  const random =
    percentageDifferences[
      Math.floor(Math.random() * percentageDifferences.length)
    ];
  return random;
};

export const getCumltvSumWRandomPercentageDiff = (
  monthlyToSave: number,
  term: number,
) => {
  let cumulativeSum = 0;
  const cumulativeArr = [];
  for (let i = 0; i < term; i++) {
    cumulativeSum += monthlyToSave;
    if (i > 0)
      cumulativeSum += (cumulativeSum * getRandomPercentageDifferences()) / 100;
    cumulativeArr.push(cumulativeSum);
  }
  return cumulativeArr;
};

export const getCumltvSumWCAGR = (
  monthlyToSave: number,
  term: number,
  cagr: number,
) => {
  const monthlyGrowthRate = (1 + cagr) ** (1 / 12) - 1;
  const cumulativeBalance = [];

  for (let month = 1; month <= term; month++) {
    let balance = 0;
    for (let i = 0; i < month; i++) {
      balance += monthlyToSave * Math.pow(1 + monthlyGrowthRate, month - i);
    }
    cumulativeBalance.push(Math.round(balance));
  }

  return cumulativeBalance;
};

export const filterPricesRecords = (
  dataSource: any[],
  initialDates: string[],
) => {
  return dataSource.filter((price) =>
    initialDates.some((date) => price.datetime.startsWith(date)),
  );
};

export const getInitials = (fullName: string) => {
  const names = fullName.split(' ');
  const initials = names
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  return initials;
};

export const getRandomFromStringArray = (arr: string[]) => {
  if (arr.length === 0) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const handleMarriageStatus = (text: string): boolean => {
  const normalizedText = (text || '').toLowerCase().trim();

  const marriedKeywords = [
    'iya',
    'sudah',
    'sudah menikah',
    'iya sudah',
    'saya berkeluarga',
    'sudah berkeluarga',
    'menikah',
    'berkeluarga',
    'ya sudah',
    'yup',
    'yes',
    'sudah punya keluarga',
    'sudah berumah tangga',
    'sudah nikah',
    'sudah kawin',
    'ya menikah',
    'tentu sudah',
    'pastinya sudah',
    'sudah punya anak',
    'sudah beristri',
    'sudah bersuami',
    'sudah berpasangan',
    'sudah punya pasangan',
    'betul sudah',
    'yep sudah',
    'memang sudah',
    'benar sudah',
    'sudah punya istri',
    'sudah punya suami',
    'sudah memiliki keluarga',
    'sudah settle',
    'sudah hidup bersama',
    'sudah membina rumah tangga',
  ];

  const notMarriedKeywords = [
    'belum',
    'tidak',
    'no',
    'blm',
    'nggak',
    'belum menikah',
    'tidak menikah',
    'single',
    'jomblo',
    'belum berkeluarga',
    'belum punya keluarga',
    'belum nikah',
    'belum kawin',
    'masih sendiri',
    'belum berpasangan',
    'belum punya pasangan',
    'belum berumah tangga',
    'belum settle',
    'sudah cerai',
    'cerai',
    'berpisah',
    'pisah',
    'sudah bercerai',
    'sudah pisah',
    'bercerai',
    'duda',
    'janda',
    'sudah berpisah',
    'pisah rumah',
    'tidak bersama lagi',
    'sudah tidak menikah',
    'sudah tidak bersama',
    'pisah dengan pasangan',
    'sudah janda',
    'sudah duda',
    'tidak lagi menikah',
    'sudah tidak berkeluarga',
  ];

  
  const isMarriedStatus = marriedKeywords.some((keyword) =>
    normalizedText.includes(keyword),
  );

  const isNotMarriedStatus = notMarriedKeywords.some((keyword) =>
    normalizedText.includes(keyword),
  );

  return isNotMarriedStatus ? false : isMarriedStatus;
};

export const convertRupiahToNumber = (input: string | undefined): number => {
  if (!input) return 0;
  
  const cleanedInput = input
    .trim()
    .replace(/rp\.?|rupiah/gi, '') 
    .replace(/,--|,-/g, '') 
    .replace(/\s+/g, ''); 

  const numericMatch = cleanedInput.match(/^[\d,.]+$/);
  if (numericMatch) {
    const numStr = cleanedInput
      .replace(/([,.])(\d{3})(\b)/g, '$2') 
      .replace(/,/g, '.'); 
    const num = parseFloat(numStr);
    if (isNaN(num)) return 0; 
    return Math.floor(num); 
  }


  return 0;
};

export const getTemplateId = (chat: string): string => {
  const templates = [
    'Apakah pengeluaranmu lebih besar daripada pendapatanmu?',
    'Apakah pengeluaranmu melebihi pendapatanmu?',
    'Apakah kamu menghabiskan lebih banyak uang daripada yang kamu dapatkan?',
    'Apakah belanjaanmu lebih banyak dibandingkan dengan penghasilanmu?',
  ];

  return templates.includes(chat) ? 'A22A' : 'A22B';
};

export function formatMonth(
  term: number,
  labels?: { singular?: string; plural?: string },
): string {
  const singular = labels?.singular || 'month';
  const plural = labels?.plural || (singular === 'month' ? 'months' : singular);
  return term === 1 ? singular : plural;
}