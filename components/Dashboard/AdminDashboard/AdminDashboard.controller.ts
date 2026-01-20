import { useState, useEffect } from "react";
import { AdminDashboardProps, AdminDashboardControllerReturn } from "./AdminDashboard.type";
import { CustomerDataTableType } from "@/types/CustomerDataTable.type";

export const useAdminDashboard = ({ adminId }: AdminDashboardProps): AdminDashboardControllerReturn => {
  const [leads, setLeads] = useState<CustomerDataTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<CustomerDataTableType | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCreateOverlayOpen, setIsCreateOverlayOpen] = useState(false);

  const fetchLeads = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch(`/api/customers?admin_id=${adminId}`);
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
        
        // Update selected lead if it exists to keep overlay data in sync
        if (selectedLead) {
          const updatedLead = result.data.find((l: CustomerDataTableType) => l.id === selectedLead.id);
          if (updatedLead) {
            setSelectedLead(updatedLead);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchLeads();
    }
  }, [adminId]);

  const handleLeadClick = (lead: CustomerDataTableType) => {
    setSelectedLead(lead);
    setIsOverlayOpen(true);
  };

  const handleCreateSuccess = (newLead: CustomerDataTableType) => {
    fetchLeads(true);
    setSelectedLead(newLead);
    setIsOverlayOpen(true);
  };

  return {
    leads,
    isLoading,
    selectedLead,
    isOverlayOpen,
    isCreateOverlayOpen,
    fetchLeads,
    handleLeadClick,
    handleCreateSuccess,
    setIsOverlayOpen,
    setIsCreateOverlayOpen,
  };
};
