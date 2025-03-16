import {FC, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowBack} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {DayPlanItem} from '@components/NewTripForm/TripPlanStep/DayPlanItem';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
}

const TripPlanStep: FC<Props> = ({tripPlan}) => {
  const navigate = useNavigate();

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.detailsAndReturn}>
        <ContentCard>
          <div className={styles.detailsCard}>
            <div className={styles.location}>
              <Typography level="h1" fontWeight={700} lineHeight="normal">
                {tripPlan?.location}
              </Typography>
              <Typography level="h1" fontWeight={300} lineHeight="normal">
                {tripPlan?.countryCode}
              </Typography>
              <img
                className={styles.flag}
                src={`https://flagsapi.com/${tripPlan?.countryCode}/flat/48.png`}
                alt={`flag_${tripPlan?.countryCode}`}
              />
            </div>
            <Typography level="body-lg">{`Days: ${tripPlan?.days}`}</Typography>
            <Typography level="body-lg">{`Budget: ${tripPlan?.budget}`}</Typography>
            <Typography level="body-lg">{`Participants: ${tripPlan?.participants}`}</Typography>
          </div>
        </ContentCard>
        <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
          Return
        </StyledButton>
      </div>
      <div className={styles.tripPlan}>
        {tripPlan?.plan.map(dayPlan => <DayPlanItem key={dayPlan.day} dayPlan={dayPlan} />)}
      </div>
    </div>
  );
};

export {TripPlanStep};
