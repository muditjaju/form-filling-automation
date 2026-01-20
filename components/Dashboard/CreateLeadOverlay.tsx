'use client';

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Toast } from "@/components/ui/Toast/Toast";
import { Loader2, Mail, Lock, ShieldCheck, UserPlus } from "lucide-react";

interface CreateLeadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  adminId: string;
  onSuccess: (newLead: any) => void;
}

export const CreateLeadOverlay: React.FC<CreateLeadOverlayProps> = ({
  isOpen,
  onClose,
  adminEmail,
  adminId,
  onSuccess,
}) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPin, setCustomerPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail || customerPin.length !== 6 || adminPin.length !== 6) {
      Toast.createNewToast({ message: "Please fill in all fields correctly", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = Toast.createNewToast({ message: "Creating new form...", type: "loading" });

    try {
      const response = await fetch("/api/customers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          pin: customerPin,
          adminEmail: adminEmail,
          adminPin: adminPin,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Toast.createNewToast({ message: "New form created successfully!", type: "success", id: loadingToast });
        onSuccess(result.data);
        handleClose();
      } else {
        Toast.createNewToast({ message: result.error || "Failed to create form", type: "error", id: loadingToast });
      }
    } catch (error) {
      console.error("Create lead error:", error);
      Toast.createNewToast({ message: "An unexpected error occurred", type: "error", id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerEmail("");
    setCustomerPin("");
    setAdminPin("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight">Create New Form</DialogTitle>
          <DialogDescription className="text-indigo-100 mt-2 text-lg">
            Register a new customer and generate their unique access link.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-bold">
                <Mail className="h-4 w-4 text-indigo-500" />
                <Label htmlFor="customerEmail" className="text-base">Customer Email</Label>
              </div>
              <Input
                id="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="h-12 text-lg rounded-xl border-zinc-200 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-bold">
                <Lock className="h-4 w-4 text-indigo-500" />
                <Label className="text-base">Set Customer PIN</Label>
              </div>
              <InputOTP maxLength={6} value={customerPin} onChange={setCustomerPin}>
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl font-bold border-2 rounded-xl" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-zinc-500">A 6-digit PIN the customer will use to access the form.</p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800" />

            <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <Label className="text-base">Admin Confirmation</Label>
              </div>
              <p className="text-sm text-zinc-500 mb-2">Verify your Admin PIN to authorize this creation.</p>
              <InputOTP maxLength={6} value={adminPin} onChange={setAdminPin}>
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl font-bold border-2 rounded-xl border-emerald-100 dark:border-emerald-900/30" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-12 px-6 rounded-xl border-zinc-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Form & Open"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
