export type CalculationInputs = {
  date?: string;
  label?: string;
  term: number;
  price: number;
  downPayment: number;
  budget: number;
};

export interface CalculationResultProps {
  budget: number;
  minus: number;
  minusDP: number;
  monthlyToSave: number;
  monthlyToSaveDP: number;
  installment36Month: number;
  term: number;
  isUmroh: boolean;
  withDp: boolean;
  label?: string;
  dateText?: string;
}

export type ResultVocabulatriesProps = {
  titleIntro: string;
  titleSubject: string;
  inText: string;
  monthText: string;
  amountToSave: string;
  budgetText: string;
  minusText: string;
  savedMoney: string;
  otherInstrument: string;
  goldBtnText: string;
  forexBtnText: string;
};
