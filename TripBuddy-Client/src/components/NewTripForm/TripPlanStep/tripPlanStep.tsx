import {FC} from 'react';
import {TripPlan} from '@customTypes/TripPlan';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  return (
    <div className={styles.container}>
      <h1>TODO: display the trip plan using content card</h1>
    </div>
  );
};
export {TripPlanStep};