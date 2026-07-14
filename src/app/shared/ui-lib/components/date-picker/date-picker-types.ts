export type DatePickerValue = string | null;

export type DatePickerDisplayFormat = 'dd-MM-yyyy' | 'yyyy-MM-dd' | 'MM-dd-yyyy';

export type DatePickerDisabledDate = (date: string) => boolean;
