import {FC} from 'react';
import { TripPlan, DayPlan } from '../../types/TripPlan';
import {ContentCard} from '@components/common/ContentCard';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  return (
    <div className={styles.container}>
      {tripPlan?.Dayplans.map((category: DayPlan, index: number) => (
      <div key={index} className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{category.type}</h1>
        <div className="grid grid-cols-3 gap-4">
        {category.items.map((item: string, idx: number) => (
          <ContentCard key={idx} className="p-4 border rounded-lg shadow-md">
          {item}
          </ContentCard>
        ))}
        </div>
      </div>
      ))}
    </div>
  );
};

export {TripPlanStep};