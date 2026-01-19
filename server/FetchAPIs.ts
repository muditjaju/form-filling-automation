import { supabase } from "./supabase/client";

export const FetchAPIs = {
  /**
   * Validates admin credentials using email and PIN.
   */
  async loginAdmin(email: string, pin: string) {
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("pin", pin)
      .single();

    if (error || !admin) {
      return { success: false, error: "Invalid email or PIN" };
    }

    return { success: true, data: admin };
  },

  /**
   * Fetches customers with status 'IN_PROGRESS' for a specific admin.
   */
  async fetchInProgressCustomers(adminId: string) {
    const { data, error } = await supabase
      .from("customer-data")
      .select("*")
      .eq("agent_id", adminId)
      .eq("status", "IN_PROGRESS");

    if (error) {
      console.error("Error fetching in-progress customers:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Searches for a customer by email in the customer-data table.
   */
  async searchCustomerByEmail(email: string) {
    const { data, error } = await supabase
      .from("customer-data")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Error searching customer by email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }
};
