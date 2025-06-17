import axios from 'axios';
import {FC, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Popup} from '@components/common/Popup';
import {TripPlan} from '@customTypes/TripPlan';
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
    try {
      await axios.post(`/api/trips/${tripId}/leave`);
      navigate('/home');
    } catch (error) {
      console.error('Failed to leave trip:', error);
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
          <button className={styles.leaveButton} onClick={() => setIsPopupOpen(true)}>
            Leave the trip
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <Popup
          open={isPopupOpen}
          title="Are you sure you want to leave?"
          cancelText=""
          onCancel={() => setIsPopupOpen(false)}>
          <Typography level="body-md">
            This action will remove you from the trip. If you are the only participant, the trip will be deleted.
          </Typography>

          <div className={styles.popupButtons}>
            <button className={styles.leaveButton} onClick={handleLeaveTrip}>
              Yes
            </button>
            <button className={styles.leaveButton} onClick={() => setIsPopupOpen(false)}>
              No
            </button>
          </div>
        </Popup>
      )}
    </ContentCard>
  );
};

export {TripDetailsCard};
