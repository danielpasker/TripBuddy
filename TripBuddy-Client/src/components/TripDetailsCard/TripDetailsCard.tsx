import {FC, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {TripPlan} from '@customTypes/TripPlan';
import {ClientRoutes} from '@enums/clientRoutes';
import {leaveTrip} from '@services/tripsApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  tripPlan?: TripPlan;
  startDate?: string;
  endDate?: string;
}

const TripDetailsCard: FC<Props> = ({tripPlan, startDate, endDate}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const {tripId} = useParams();

  const handleLeaveTrip = async () => {
    if (!tripId) return;

    try {
      await leaveTrip(tripId);
      navigate(ClientRoutes.HOME);
    } catch {
      toast.error('Failed to leave the trip. Please try again.');
    }
  };

  return (
    <ContentCard>
      <div className={styles.container}>
        <div className={styles.location}>
          <Typography level="h1" lineHeight="normal" className={styles.gothicFont}>
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

        {!!startDate && !!endDate && (
          <Typography level="h3">{`${formatDate(startDate)} - ${formatDate(endDate)}`}</Typography>
        )}
        <Typography level="body-lg">{`Days: ${tripPlan?.days}`}</Typography>
        <Typography level="body-lg">{`Budget: ${tripPlan?.budget}`}</Typography>
        <Typography level="body-lg">{`Type: ${tripPlan?.tripType}`}</Typography>

        <div className={styles.participantsRow}>
          <Typography level="body-lg">{`Participants: ${tripPlan?.participants}`}</Typography>
          <StyledButton onClick={() => setIsPopupOpen(true)}>Leave the trip</StyledButton>
        </div>
      </div>

      <Popup
        open={isPopupOpen}
        title="Are you sure you want to leave?"
        onCancel={() => setIsPopupOpen(false)}
        cancelText="No"
        acceptAction={<StyledButton onClick={handleLeaveTrip}>Yes</StyledButton>}>
        <Typography level="body-md">
          This action will remove you from the trip. If you are the only participant, the trip will be deleted.
        </Typography>
      </Popup>
    </ContentCard>
  );
};

export {TripDetailsCard};
