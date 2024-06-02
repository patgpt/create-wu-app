// src/types/interfaces.ts

export interface IContentfulFieldOperations {
  createField(contentTypeId: string, field: any): Promise<void>;
  readField(contentTypeId: string, fieldId: string): Promise<any>;
  updateField(
    contentTypeId: string,
    fieldId: string,
    field: any,
  ): Promise<void>;
  deleteField(contentTypeId: string, fieldId: string): Promise<void>;
}

export interface IContentfulPropsOperations {
  createProp(contentTypeId: string, prop: any): Promise<void>;
  readProp(contentTypeId: string, propId: string): Promise<any>;
  updateProp(contentTypeId: string, propId: string, prop: any): Promise<void>;
  deleteProp(contentTypeId: string, propId: string): Promise<void>;
}

export interface EntryProps {
  [key: string]: {
    'en-US': string;
  };
}

export interface FieldProps {
  id: string;
  name: string;
  type: string;
  required: boolean;
  localized: boolean;
  validations?: any[];
  disabled?: boolean;
  omitted?: boolean;
}
