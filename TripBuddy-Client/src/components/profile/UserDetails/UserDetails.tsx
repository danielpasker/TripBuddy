import {FC} from 'react';
import {Divider, Typography} from '@mui/joy';
import {User} from '@customTypes/User';
import styles from './styles.module.scss';

interface Props {
  user: User | null;
}

const NOT_SPECIFIED = 'Not specified';

const UserDetails: FC<Props> = ({user}) => (
  <div className={styles.container}>
    <Typography level="h4">{`Age: ${user?.age ?? NOT_SPECIFIED}`}</Typography>
    <Divider className={styles.divider} />
    <Typography level="h4">{`Gender: ${user?.gender ?? NOT_SPECIFIED}`}</Typography>
    <Divider className={styles.divider} />
    <Typography level="h4">{`Diet: ${user?.diet ?? NOT_SPECIFIED}`}</Typography>
    <Divider className={styles.divider} />
    <Typography level="h4">{`Religion: ${user?.religion ?? NOT_SPECIFIED}`}</Typography>
  </div>
);
export {UserDetails};
