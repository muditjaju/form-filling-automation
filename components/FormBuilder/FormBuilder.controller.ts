import { useState, useCallback, useEffect } from 'react';
import { FormConfig, FormData, FieldConfig } from './FormBuilder.type';

export const useFormBuilder = (config: FormConfig, initialData: FormData = {}) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  // Initialize form data based on config if not provided
  useEffect(() => {
    const initializeData = (fields: FieldConfig[], currentData: FormData) => {
      const newData = { ...currentData };
      fields.forEach((field) => {
        if (field.type === 'multiple') {
          if (!newData[field.id]) {
            newData[field.id] = [{}]; // Start with one empty item for multiple
          }
        } else if (newData[field.id] === undefined) {
          newData[field.id] = field.defaultValue !== undefined ? field.defaultValue : '';
        }
      });
      return newData;
    };

    setFormData((prev) => initializeData(config.fields, prev));
  }, [config.fields]);

  // Sync with initialData if it changes from outside
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = useCallback((id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleMultipleChange = useCallback((fieldId: string, index: number, subFieldId: string, value: any) => {
    setFormData((prev) => {
      const list = [...(prev[fieldId] || [])];
      list[index] = { ...list[index], [subFieldId]: value };
      return {
        ...prev,
        [fieldId]: list,
      };
    });
  }, []);

  const addMultipleItem = useCallback((fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), {}],
    }));
  }, []);

  const removeMultipleItem = useCallback((fieldId: string, index: number) => {
    setFormData((prev) => {
      const list = [...(prev[fieldId] || [])];
      if (list.length > 1) {
        list.splice(index, 1);
      } else {
        list[0] = {}; // Don't remove the last one, just clear it
      }
      return {
        ...prev,
        [fieldId]: list,
      };
    });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    return formData;
  }, [formData]);

  return {
    formData,
    handleChange,
    handleMultipleChange,
    addMultipleItem,
    removeMultipleItem,
    handleSubmit,
  };
};
