import MapSection from "../components/MapSection";
import AnalyticsCard from "../components/AnalyticsCard";
import ReportCard from "../components/ReportCard";
import StatusCards from "../components/StatusCards";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <MapSection />
        <StatusCards />
      </div>
      <div className="space-y-4">
        <AnalyticsCard />
        <ReportCard />
      </div>
    </div>
  );
}
