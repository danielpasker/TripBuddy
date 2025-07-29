import {FC} from 'react';
import {useNavigate, useParams} from 'react-router';
import {toast} from 'react-toastify';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {ClientRoutes} from '@enums/clientRoutes';
import {leaveTrip} from '@services/tripsApi';

interface LeaveTripPopupProps {
  open: boolean;
  onCancel: () => void;
}

const LeaveTripPopup: FC<LeaveTripPopupProps> = ({open, onCancel}) => {
  const navigate = useNavigate();
  const {tripId} = useParams();

  const handleLeaveTrip = async () => {
    try {
      await leaveTrip(tripId!);
      navigate(ClientRoutes.HOME);
      toast.success('You left the trip successfully.');
    } catch {
      toast.error('Failed to leave the trip. Please try again.');
    }
  };

  return (
    <Popup
      open={open}
      title="Are you sure you want to leave?"
      cancelText="No"
      onCancel={onCancel}
      acceptAction={
        <StyledButton color="danger" onClick={handleLeaveTrip}>
          Yes
        </StyledButton>
      }
    />
  );
};

export {LeaveTripPopup};
