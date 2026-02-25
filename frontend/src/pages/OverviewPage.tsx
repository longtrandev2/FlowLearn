import ContinueLearning from '@/features/overview/components/ContinueLearning';
import StudyTimeChart from '@/features/overview/components/StudyTimeChart';
import StreakCard from '@/features/overview/components/StreakCardNew';
import TodayWidget from '@/features/overview/components/TodayWidget';

export const OverviewPage = () => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden">
      {/* Row 1: Continue Learning – auto height, horizontal cards */}
      <ContinueLearning />

      {/* Row 2: Chart (2/3) + Streak (1/3) – fills remaining space */}
      <section className="grid grid-cols-3 gap-4 min-h-0">
        <div className="col-span-2 min-h-0">
          <StudyTimeChart />
        </div>
        <div className="col-span-1 min-h-0">
          <StreakCard />
        </div>
      </section>

      {/* Row 3: Today bar – slim bottom strip */}
      <TodayWidget />
    </div>
  );
};