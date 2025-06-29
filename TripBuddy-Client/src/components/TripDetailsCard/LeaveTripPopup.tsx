import {FC} from 'react';
import {Typography} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';

interface LeaveTripPopupProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveTripPopup: FC<LeaveTripPopupProps> = ({open, onConfirm, onCancel}) => {
  return (
    <Popup
      open={open}
      title="Are you sure you want to leave?"
      cancelText="No"
      onCancel={onCancel}
      acceptAction={
        <StyledButton color="danger" onClick={onConfirm}>
          Yes
        </StyledButton>
      }>
      <Typography level="body-md">
        This action will remove you from the trip. If you are the only participant, the trip will be deleted.
      </Typography>
    </Popup>
  );
};

export {LeaveTripPopup};
