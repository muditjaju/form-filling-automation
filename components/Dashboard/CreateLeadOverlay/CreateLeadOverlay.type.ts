export interface CreateLeadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  adminId: string;
  onSuccess: (newLead: any) => void;
}
