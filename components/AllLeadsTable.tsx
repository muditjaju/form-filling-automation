import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  email: string;
  status: string;
  [key: string]: any;
}

interface AllLeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export const AllLeadsTable: React.FC<AllLeadsTableProps> = ({ leads, onLeadClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-800/50">
            <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Form ID</TableHead>
            <TableHead className="font-bold text-zinc-700 dark:text-zinc-300">Email</TableHead>
            <TableHead className="font-bold text-zinc-700 dark:text-zinc-300 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow 
                key={lead.id} 
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                onClick={() => onLeadClick(lead)}
              >
                <TableCell className="font-mono text-xs text-zinc-500">{lead.id}</TableCell>
                <TableCell className="font-medium">{lead.email}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={`${getStatusColor(lead.status)} font-semibold`}>
                    {lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
