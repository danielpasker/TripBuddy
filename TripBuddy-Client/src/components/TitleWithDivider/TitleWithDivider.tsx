import {memo} from 'react';
import {Divider, Typography} from '@mui/joy';
import styles from './styles.module.scss';

interface Props {
  title: string;
}

const TitleWithDivider = memo<Props>(({title}) => (
  <div className={styles.container}>
    <Typography className={styles.gridTitle} fontWeight={700} level="h2">
      {title}
    </Typography>
    <Divider className={styles.divider} />
  </div>
));

export {TitleWithDivider};
