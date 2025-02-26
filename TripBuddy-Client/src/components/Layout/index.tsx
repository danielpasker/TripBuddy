import {FC} from 'react';
import {Outlet} from 'react-router';
import {Navbar} from '@components/Navbar';
import styles from './styles.module.scss';

const Layout: FC = () => (
  <>
    <Navbar />
    <div className={styles.contentContainer}>
      <Outlet />
    </div>
  </>
);

export {Layout};
