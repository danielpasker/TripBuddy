import {FC, useCallback, useState} from 'react';
import {toast} from 'react-toastify';
import {CheckRounded} from '@mui/icons-material';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {updateUserDescription} from '@services/usersApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditDescriptionPopup: FC<Props> = ({open, onClose}) => {
  const {user, setUser} = useUserContext();
  const [description, setDescription] = useState(user?.description ?? '');
  const {trigger: updateDescription, isLoading} = useMutation(updateUserDescription);

  const isDescriptionValid = description.trim().length >= 2 && description.trim().length <= 255;

  const handleUpdateDescription = async () => {
    if (isDescriptionValid) {
      try {
        const updatedUser = await updateDescription(description);
        setUser(updatedUser);

        toast.success('Description was successfully updated');
        onClose();
      } catch {
        toast.error("We couldn't update your description");
      }
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    setDescription(user?.description ?? '');
  }, [onClose, user]);

  return (
    <Popup
      open={open}
      title="Edit Description"
      onCancel={handleClose}
      acceptAction={
        <StyledButton
          onClick={handleUpdateDescription}
          loading={isLoading}
          disabled={!isDescriptionValid}
          startDecorator={<CheckRounded />}>
          Save
        </StyledButton>
      }>
      <StyledTextArea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Tell us about yourself..."
        minRows={2}
        maxRows={6}
      />
    </Popup>
  );
};
export {EditDescriptionPopup};
