import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBuilder } from "@/components/FormBuilder/FormBuilder.ui";
import config from "@/components/FormBuilder/FormBuilder.config";
import { Toast } from "@/components/Toast/Toast";
import { PDFManager } from "./Dashboard/PDFManager";

interface Lead {
  id: string;
  email: string;
  status: string;
  data?: any;
  [key: string]: any;
}

interface LeadOverlayProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadOverlay: React.FC<LeadOverlayProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;

  const handleSubmit = async (data: any) => {
    const loadingToast = Toast.createNewToast({ message: 'Saving changes...', type: 'loading' });
    try {
      const response = await fetch(`/api/submit-form/${lead.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      Toast.createNewToast({ message: 'Lead updated successfully!', type: 'success', id: loadingToast });
    } catch (error) {
      console.error('Submission error:', error);
      Toast.createNewToast({ 
        message: 'Failed to save information. Please try again.', 
        type: 'error', 
        id: loadingToast 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl border-zinc-200 dark:border-zinc-800">
        <DialogHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between mt-2">
             <DialogTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Lead Details
            </DialogTitle>
            <div className="text-sm text-zinc-500 font-mono">
                ID: {lead.id}
            </div>
          </div>
          <div className="text-zinc-500 dark:text-zinc-400">
            {lead.email}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6">
          <Tabs defaultValue="form-data" className="h-full flex flex-col">
            <TabsList className="bg-zinc-100 dark:bg-zinc-800/50 p-1 w-fit mb-6">
              <TabsTrigger value="form-data" className="px-6">Form Data</TabsTrigger>
              <TabsTrigger value="submissions" className="px-6">Submissions</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <TabsContent value="form-data" className="mt-0">
                    <FormBuilder 
                        config={config} 
                        initialData={lead.data || {}} 
                        role="Admin"
                        onSubmit={handleSubmit}
                    />
                </TabsContent>
                
                <TabsContent value="submissions" className="mt-0">
                    <PDFManager lead={lead} />
                </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
