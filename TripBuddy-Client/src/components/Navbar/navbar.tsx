import {FC} from 'react';
import {Link} from 'react-router';
import {Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const Navbar: FC = () => {
  const {user} = useUserContext();

  return (
    <div style={glassEffect} className={styles.container}>
      <Link to={ClientRoutes.HOME} className={styles.logo}>
        <Typography fontWeight={600} level="h2">
          TripBuddy
        </Typography>
      </Link>
      {user && (
        <div className={styles.userPreview}>
          <Typography level="body-lg">Welcome</Typography>
          <Typography fontWeight={700} level="body-lg">
            {user.userName}
          </Typography>
          <UserAvatar user={user} />
        </div>
      )}
    </div>
  );
};
export {Navbar};
