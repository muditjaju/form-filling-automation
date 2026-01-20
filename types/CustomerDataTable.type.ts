import { FormData } from "@/components/FormBuilder/FormBuilder.type";

export interface CustomerDataTableType {
    id: string;
    email: string;
    status: string;
    data?: FormData;
}