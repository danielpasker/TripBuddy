import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {Typography} from '@mui/joy';
import {menuItems} from '@components/Navbar/menuItems';
import {UserAvatar} from '@components/UserAvatar';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {glassEffect} from '@styles/commonStyles';
import styles from './styles.module.scss';

const Navbar: FC = () => {
  const {user} = useUserContext();
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <div style={glassEffect} className={styles.container}>
      <div className={styles.logoAndLinks}>
        <Link to={ClientRoutes.HOME} className={styles.logo}>
          <Typography fontWeight={600} level="h2" lineHeight="normal">
            TripBuddy
          </Typography>
        </Link>
        <div className={styles.linksContainer}>
          {menuItems.map(item => (
            <Link
              key={item.text}
              to={item.route}
              className={currentRoute === item.route ? styles.activePageText : styles.pageText}>
              <Typography level="body-lg">{item.text}</Typography>
            </Link>
          ))}
        </div>
      </div>
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
