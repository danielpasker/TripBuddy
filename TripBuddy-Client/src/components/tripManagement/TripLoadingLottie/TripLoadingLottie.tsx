import {FC} from 'react';
import {Typography} from '@mui/joy';
import {Player} from '@lottiefiles/react-lottie-player';
import styles from './styles.module.scss';

const TripLoadingLottie: FC = () => (
  <div className={styles.container}>
    <Player autoplay loop src="/assets/trip-lottie.json" style={{width: '300px', height: '300px'}} />
    <Typography level="h2">Getting Your Trip</Typography>
  </div>
);

export {TripLoadingLottie};
