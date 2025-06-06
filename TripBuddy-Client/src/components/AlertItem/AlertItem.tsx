import {memo} from 'react';
import {Link, Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {StyledChip} from '@components/common/StyledChip';
import {Alert} from '@customTypes/Alert';
import {mapAlertLevelToColor} from '@utils/alertUtils';
import {alertTypes} from '@utils/consts';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  alert: Alert;
  isPreview?: true;
}

const AlertItem = memo<Props>(({alert, isPreview}) => {
  const alertColor = mapAlertLevelToColor(alert.alertlevel);

  return (
    <ContentCard className={alertColor === 'danger' ? styles.dangerContainer : styles.container}>
      <div className={styles.header}>
        <div className={styles.iconAndDetails}>
          <img src={alert.icon} width={40} className={styles.icon} alt={alertTypes[alert.eventtype]} />
          <StyledChip className={styles.chip} color="danger">
            {alertTypes[alert.eventtype]}
          </StyledChip>
          <StyledChip className={styles.chip} color={alertColor}>
            {`Level: ${alert.alertlevel}`}
          </StyledChip>
        </div>
        <StyledChip className={styles.chip}>{`${formatDate(alert.fromdate)} - ${formatDate(alert.todate)}`}</StyledChip>
      </div>
      {!isPreview && (
        <>
          <Typography level="body-lg">{alert.description}</Typography>
          <Link href={alert.url.report} target="_blank" rel="noopener noreferrer">
            <StyledChip className={styles.chip}>Click Here For More Details</StyledChip>
          </Link>
        </>
      )}
    </ContentCard>
  );
});

export {AlertItem};
