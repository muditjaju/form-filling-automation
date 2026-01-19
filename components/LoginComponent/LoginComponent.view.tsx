"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useLoginController } from "./LoginComponent.controller";
import { Loader2 } from "lucide-react";

export const LoginComponent = () => {
  const { form, onSubmit, isLoading } = useLoginController();

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800/50 transition-all">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-sm">
          Please enter your details to sign in
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="h-11 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 focus:ring-primary/20 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 bg-zinc-50/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 transition-all">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-700/50">
                    <SelectItem value="admin" className="cursor-pointer">Admin</SelectItem>
                    <SelectItem value="customer" className="cursor-pointer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2">
                <div className="w-full flex justify-between items-center">
                  <FormLabel>PIN</FormLabel>
                </div>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md first:rounded-md first:border-l-2 bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-14 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700/50 rounded-md last:rounded-md bg-zinc-50/50 dark:bg-zinc-800/50 transition-all font-mono"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="w-full text-center" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "LOGIN"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
