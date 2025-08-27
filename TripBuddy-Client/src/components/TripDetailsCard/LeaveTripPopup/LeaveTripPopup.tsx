import {memo, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router';
import {toast} from 'react-toastify';
import {MeetingRoomRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {ClientRoutes} from '@enums/clientRoutes';
import {useMutation} from '@hooks/useMutation';
import {leaveTrip} from '@services/tripsApi';

interface Props {
  open: boolean;
  onCancel: () => void;
}

const LeaveTripPopup = memo<Props>(({open, onCancel}) => {
  const navigate = useNavigate();
  const {tripId} = useParams();
  const {trigger, isLoading} = useMutation(leaveTrip);

  const handleLeaveTrip = useCallback(async () => {
    if (tripId) {
      try {
        await trigger(tripId);
        navigate(ClientRoutes.HOME);
        toast.success('You left the trip successfully.');
      } catch {
        toast.error('Failed to leave the trip. Please try again.');
      }
    }
  }, [tripId, trigger, navigate]);

  return (
    <Popup
      open={open}
      title="Leaving the trip"
      onCancel={onCancel}
      acceptAction={
        <StyledButton
          loading={isLoading}
          startDecorator={<MeetingRoomRounded />}
          color="danger"
          onClick={handleLeaveTrip}>
          Leave Trip
        </StyledButton>
      }>
      <Typography level="body-lg" overflow="hidden">
        Are you sure you want to leave this trip? You will lose access to all trip details and communications.
      </Typography>
    </Popup>
  );
});

export {LeaveTripPopup};
