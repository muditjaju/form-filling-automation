'use client';

import config from '@/components/FormBuilder/FormBuilder.config';
import { FormBuilder } from '@/components/FormBuilder/FormBuilder.ui';

import toast from 'react-hot-toast';

export default function FormContainer({ id, initialData }: { id: string; initialData: any }) {
  
  const handleSubmit = async (data: any) => {
    const loadingToast = toast.loading('Saving changes...');
    try {
      const response = await fetch(`/api/submit-form/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      toast.success('Information updated successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to save information. Please try again.', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Customer Profile Update
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Please review and update your information below.
          </p>
        </div>
        <FormBuilder config={config} initialData={initialData || {}} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
