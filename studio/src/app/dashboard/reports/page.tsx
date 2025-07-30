import { PageHeader } from "@/components/page-header";
import { CommunityReportCard } from "@/components/disaster/community-report-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Community Reports"
        description="Submit a new incident report or view existing reports from the community."
      />
      <div className="mx-auto max-w-2xl">
        {/* In a real app, this state would be managed to pass the selected disaster type */}
        <CommunityReportCard disasterType="Flood" />
      </div>
    </>
  );
}
