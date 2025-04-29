import {FC} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {EditRounded, LogoutRounded} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {UserDetails} from '@components/UserDetails';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';
import {saveNewFile} from '@services/filesApi';
import {updateUserProfilePicture} from '@services/usersApi';
import styles from '@styles/profile.module.scss';

const Profile: FC = () => {
  const navigate = useNavigate();
  const {user, setUser} = useUserContext();
  const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);

  const handleUpdateProfilePicture = async (profilePicture: File) => {
    try {
      const result = await saveNewFile(profilePicture);
      const updatedUser = await updateUserProfilePicture(result.url);
      setUser(updatedUser);

      toast.success('Profile picture was successfully updated');
    } catch {
      toast.error("We couldn't upload your image");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');

      toast.success('Logged out successfully');
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={5} className={styles.profileGridItem}>
        <div className={styles.profile}>
          <TitleWithDivider title="Profile" />
          <UserDetails user={user} onUpdateProfilePicture={handleUpdateProfilePicture} />
        </div>
        <div className={styles.bottomActions}>
          <StyledButton
            startDecorator={<LogoutRounded />}
            className={styles.button}
            loading={isLoggingOut}
            onClick={handleLogout}>
            Logout
          </StyledButton>
        </div>
      </Grid>
      <Grid xs={7} className={styles.gridItem}>
        <TitleWithDivider title="About Me" />
        <ContentCard>
          <Typography>TODO: card with user description (About Me)</Typography>
          <StyledIconButton className={styles.editButton}>
            <EditRounded />
          </StyledIconButton>
        </ContentCard>
        <TitleWithDivider title="My Details" />
        <ContentCard>
          <Typography>TODO: card with user info: age, hobbies, diet & etc</Typography>
          <StyledIconButton className={styles.editButton}>
            <EditRounded />
          </StyledIconButton>
        </ContentCard>
        <Typography level="h4">*Both can be edited (via popups)</Typography>
      </Grid>
    </Grid>
  );
};

export default Profile;
