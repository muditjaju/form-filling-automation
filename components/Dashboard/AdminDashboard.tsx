'use client';

import { Plus, RefreshCw, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AllLeadsTable } from "../AllLeadsTable";
import { LeadOverlay } from "../LeadOverlay";
import { Button } from "../ui/button";
import { CreateLeadOverlay } from "./CreateLeadOverlay";
import { FormData } from "../FormBuilder/FormBuilder.type";
import { CustomerDataTableType } from "@/types/CustomerDataTable.type";

interface AdminDashboardProps {
  adminId: string;
  adminEmail: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminId, adminEmail }) => {
  const [leads, setLeads] = useState([]);
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Admin Console
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            System overview and administrative controls.
          </p>
        </div>
        <div className="flex items-center space-x-3">
            <Button
                onClick={() => setIsCreateOverlayOpen(true)}
                className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
            >
                <Plus className="h-5 w-5" />
                <span>Create New Form</span>
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fetchLeads()} 
                disabled={isLoading}
                className="h-12 w-12 rounded-2xl border-zinc-200 dark:border-zinc-800"
            >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                <ShieldCheck className="h-6 w-6" />
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">All Leads</h3>
            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                {leads.length} leads
            </span>
        </div>
        
        {isLoading ? (
            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                ))}
            </div>
        ) : (
            <AllLeadsTable leads={leads} onLeadClick={handleLeadClick} />
        )}
      </div>

      <LeadOverlay 
        lead={selectedLead} 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
        onUpdate={() => fetchLeads(true)}
      />

      <CreateLeadOverlay 
        isOpen={isCreateOverlayOpen}
        onClose={() => setIsCreateOverlayOpen(false)}
        adminEmail={adminEmail}
        adminId={adminId}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

