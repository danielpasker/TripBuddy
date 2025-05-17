import {FC} from 'react';
import {toast} from 'react-toastify';
import {CakeRounded, CheckRounded, RestaurantRounded, SynagogueRounded, TransgenderRounded} from '@mui/icons-material';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {FormValueSelect} from '@components/common/input/FormValueSelect';
import {EditUserDetailsType, editUserDetailsSchema} from '@components/profile/EditUserDetailsPopup/form';
import {LoggedUser} from '@customTypes/User';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {updateUserDetails} from '@services/usersApi';
import {diets, genders, religions} from '@utils/consts';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const mapUserToFormType = (user: LoggedUser): EditUserDetailsType => ({
  age: user.age ?? 0,
  gender: user.gender ?? '',
  diet: user.diet ?? '',
  religion: user.religion ?? '',
});

const EditUserDetailsPopup: FC<Props> = ({open, onClose}) => {
  const {user, setUser} = useUserContext();
  const {
    handleSubmit,
    control,
    formState: {isValid},
  } = useValidatedForm(editUserDetailsSchema, user ? mapUserToFormType(user) : undefined);

  const {trigger: updateDetails, isLoading} = useMutation(updateUserDetails);

  const handleUpdateDetails = async (values: EditUserDetailsType) => {
    if (isValid) {
      try {
        const updatedUser = await updateDetails(values);
        setUser(updatedUser);

        toast.success('Details was successfully updated');
        onClose();
      } catch {
        toast.error("We couldn't update your details");
      }
    }
  };

  return (
    <Popup
      open={open}
      title="Edit Details"
      onCancel={onClose}
      acceptAction={
        <StyledButton
          onClick={handleSubmit(handleUpdateDetails)}
          loading={isLoading}
          disabled={!isValid}
          startDecorator={<CheckRounded />}>
          Save
        </StyledButton>
      }>
      <div className={styles.container}>
        <FormInput
          className={styles.input}
          control={control}
          formKey="age"
          type="number"
          inputLabel="Age"
          slotProps={{input: {min: 1}}}
          placeholder="Your Age"
          endDecorator={<CakeRounded />}
        />
        <FormValueSelect
          className={styles.input}
          control={control}
          formKey="gender"
          placeholder="Yout Gender"
          inputLabel="Gender"
          options={[...genders]}
          endDecorator={<TransgenderRounded />}
        />
        <FormValueSelect
          className={styles.input}
          control={control}
          formKey="diet"
          placeholder="Yout Diet"
          inputLabel="Diet"
          options={[...diets]}
          endDecorator={<RestaurantRounded />}
        />
        <FormValueSelect
          className={styles.input}
          control={control}
          formKey="religion"
          placeholder="Your Religion"
          inputLabel="Religion"
          options={[...religions]}
          endDecorator={<SynagogueRounded />}
        />
      </div>
    </Popup>
  );
};
export {EditUserDetailsPopup};
