import React from 'react';
import { FormConfig, FormData, FieldConfig } from './FormBuilder.type';
import { useFormBuilder } from './FormBuilder.controller';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormBuilderProps {
  config: FormConfig;
  initialData?: FormData;
  onSubmit?: (data: FormData) => void;
  role?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ config, initialData, onSubmit, role }) => {
  const {
    formData,
    handleChange,
    handleMultipleChange,
    addMultipleItem,
    removeMultipleItem,
    handleSubmit,
  } = useFormBuilder(config, initialData);

  const isAdmin = role?.toLowerCase() === 'admin';

  const renderField = (field: FieldConfig, value: any, onChange: (val: any) => void) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <Input
            id={field.id}
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );
      case 'dropdown':
        return (
          <Select onValueChange={onChange} value={value || ''}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{config.title}</h2>
      <form onSubmit={(e) => {
        const data = handleSubmit(e);
        if (onSubmit) onSubmit(data);
      }} className="space-y-6">
        {config.fields.filter(f => !f.adminOnly || isAdmin).map((field) => (
          <div key={field.id} className="space-y-2">
            {field.type !== 'multiple' && (
              <>
                <Label htmlFor={field.id} className="text-sm font-semibold text-gray-700">
                  {field.label}
                </Label>
                {renderField(field, formData[field.id], (val) => handleChange(field.id, val))}
              </>
            )}

            {field.type === 'multiple' && (
              <div className="space-y-4 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/30 rounded-r-lg">
                <Label className="text-lg font-bold text-blue-800 sticky top-0">{field.label}</Label>
                {(formData[field.id] || []).map((item: any, index: number) => (
                  <div key={index} className="relative p-4 bg-white border border-blue-100 rounded-lg shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Entry #{index + 1}</span>
                       <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMultipleItem(field.id, index)}
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-full"
                      >
                        &times;
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {field.fields?.filter(f => !f.adminOnly || isAdmin).map((subField) => (
                        <div key={subField.id} className="space-y-1">
                          <Label htmlFor={`${field.id}-${index}-${subField.id}`} className="text-xs font-medium text-gray-500">
                            {subField.label}
                          </Label>
                          {renderField(
                            subField,
                            item[subField.id],
                            (val) => handleMultipleChange(field.id, index, subField.id, val)
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMultipleItem(field.id)}
                  className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  + Add Another {field.label.replace(/s$/, '')}
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-xl shadow-md">
          Submit Form
        </Button>
      </form>
    </div>
  );
};
