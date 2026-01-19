"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "./LoginComponent.type";
import { useRouter } from "next/navigation";

export const useLoginController = () => {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      pin: "",
      role: undefined,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login successful:", result);
        router.push("/dashboard");
      } else {
        console.error("Login failed:", result.error);
        // You could set a form error here if you wanted
        form.setError("root", { message: result.error });
      }
    } catch (error) {
      console.error("Login submission error:", error);
      form.setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    logout,
    isLoading: form.formState.isSubmitting,
  };
};
