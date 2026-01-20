import { supabase } from "@/server/supabase/client";
import FormContainer from "./FormContainer";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const role = cookieStore.get("ROLE")?.value;

  // Fetch data from 'customer-data' table
  const { data, error } = await supabase
    .from("customer-data")
    .select("data")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer data:", error);
  }

  return <FormContainer id={id} initialData={data?.data} role={role} />;
}
