
import RecentDocuments from '@/features/overview/components/RecentDocuments';
import StudyChart from '@/features/overview/components/StudyChart';
import StreakCard from '@/features/overview/components/StreakCard';
import RealtimeClock from '@/features/overview/components/RealtimeClock';

export const OverviewPage = () => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <RecentDocuments />
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 h-full">
          <StudyChart />
        </div>
        <div className="h-full">
          <StreakCard />
        </div>
      </section>
      <RealtimeClock />

    </div>
  );
}