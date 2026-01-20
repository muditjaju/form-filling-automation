import { CustomerDataTableType } from "@/types/CustomerDataTable.type";

export interface AdminDashboardProps {
  adminId: string;
  adminEmail: string;
}

export interface AdminDashboardControllerReturn {
  leads: CustomerDataTableType[];
  isLoading: boolean;
  selectedLead: CustomerDataTableType | null;
  isOverlayOpen: boolean;
  isCreateOverlayOpen: boolean;
  fetchLeads: (silent?: boolean) => Promise<void>;
  handleLeadClick: (lead: CustomerDataTableType) => void;
  handleCreateSuccess: (newLead: CustomerDataTableType) => void;
  setIsOverlayOpen: (open: boolean) => void;
  setIsCreateOverlayOpen: (open: boolean) => void;
}
