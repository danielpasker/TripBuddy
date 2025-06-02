import {memo} from 'react';
import {Link, Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Alert} from '@customTypes/Alert';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  alert: Alert;
}

const AlertItem = memo<Props>(({alert}) => (
  <div className={styles.container}>
    <div >
      <ContentCard>
        <div >
          <div className={styles.iconAndDate}>
            <img src={alert.icon} width={40} />
            <Typography lineHeight="normal" level="body-lg">
              {formatDate(alert.fromdate)}-{formatDate(alert.todate)}
            </Typography>
          </div>
          <Typography level="body-lg" lineHeight="normal">
            {alert.description}
          </Typography>
          <Link
            marginTop={5}
            fontSize={'md'}
            textColor={'common.white'}
            href={alert.url.report}
            target="_blank"
            rel="noopener noreferrer"
            level="body-sm"
            underline="hover">
            Click Here For More Details 👇
          </Link>
        </div>
      </ContentCard>
    </div>
  </div>
));

export {AlertItem};
