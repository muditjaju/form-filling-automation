export type FieldType = 'text' | 'dropdown' | 'date' | 'number' | 'multiple';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: DropdownOption[]; // Only for dropdown
  fields?: FieldConfig[]; // Only for 'multiple'
  defaultValue?: any;
}

export interface FormConfig {
  title: string;
  fields: FieldConfig[];
}

export interface FormData {
  [key: string]: any;
}
