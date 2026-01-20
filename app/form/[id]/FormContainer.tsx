'use client';

import React, { useState } from 'react';
import config from '@/components/FormBuilder/FormBuilder.config';
import { FormBuilder } from '@/components/FormBuilder/FormBuilder.ui';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast';

export default function FormContainer({ id, initialData, role }: { id: string; initialData: any; role?: string }) {
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(role === 'admin');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPin = async () => {
    if (pin.length !== 6) {
      toast.error('Please enter a 6-digit PIN');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pin }),
      });

      if (response.ok) {
        setIsVerified(true);
        toast.success('Access granted');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Invalid PIN');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      toast.error('Failed to verify PIN. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (data: any) => {
    const loadingToast = toast.loading('Saving changes...');
    try {
      const response = await fetch(`/api/submit-form/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, pin: role === 'admin' ? undefined : pin }),
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

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Enter Access PIN</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your 6-digit PIN to access this form.
            </p>
          </div>
          <div className="mt-8 space-y-6 flex flex-col items-center">
            <InputOTP maxLength={6} value={pin} onChange={setPin}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-14 text-lg border-2 rounded-md" />
                <InputOTPSlot index={1} className="w-12 h-14 text-lg border-2 rounded-md" />
                <InputOTPSlot index={2} className="w-12 h-14 text-lg border-2 rounded-md" />
                <InputOTPSlot index={3} className="w-12 h-14 text-lg border-2 rounded-md" />
                <InputOTPSlot index={4} className="w-12 h-14 text-lg border-2 rounded-md" />
                <InputOTPSlot index={5} className="w-12 h-14 text-lg border-2 rounded-md" />
              </InputOTPGroup>
            </InputOTP>
            <Button 
              onClick={handleVerifyPin} 
              disabled={isVerifying || pin.length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isVerifying ? <Loader2 className="animate-spin" /> : 'Access Form'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <FormBuilder config={config} initialData={initialData || {}} onSubmit={handleSubmit} role={role} />
      </div>
    </div>
  );
}
