import { useState } from "react";
import { Toast } from "@/components/ui/Toast/Toast";
import { CreateLeadOverlayProps } from "./CreateLeadOverlay.type";

export const useCreateLeadOverlay = ({
  adminEmail,
  adminId,
  onSuccess,
  onClose,
}: CreateLeadOverlayProps) => {
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

  return {
    customerEmail,
    setCustomerEmail,
    customerPin,
    setCustomerPin,
    adminPin,
    setAdminPin,
    isSubmitting,
    handleSubmit,
    handleClose,
  };
};
