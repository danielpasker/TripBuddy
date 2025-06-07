import {FC} from 'react';
import {Typography} from '@mui/joy';
import {LoginForm} from '@components/LoginForm';
import {ContentCard} from '@components/common/ContentCard';
import styles from '@styles/login.module.scss';

const Login: FC = () => (
  <div className={styles.container}>
    <ContentCard>
      <div className={styles.cardContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.logo}>
            <Typography level="h1" fontWeight={700} fontSize="3rem">
              Trip
            </Typography>
            <Typography className={styles.buddy} fontWeight={700} level="h1" fontSize="3rem">
              Buddy
            </Typography>
          </div>
          <Typography level="h4" fontWeight={100} letterSpacing="2px">
            A buddy for your trips.
          </Typography>
        </div>
        <LoginForm />
      </div>
    </ContentCard>
  </div>
);

export default Login;
