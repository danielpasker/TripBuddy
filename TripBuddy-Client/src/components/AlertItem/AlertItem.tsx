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
  const alertColor = mapAlertLevelToColor(alert.level);

  return (
    <ContentCard className={alertColor === 'danger' ? styles.dangerContainer : styles.container}>
      <div className={styles.header}>
        <div className={styles.iconAndDetails}>
          <img src={alert.iconUrl} width={40} className={styles.icon} alt={alertTypes[alert.type]} />
          <StyledChip className={styles.chip} color="danger">
            {alertTypes[alert.type]}
          </StyledChip>
          <StyledChip className={styles.chip} color={alertColor}>
            {`Level: ${alert.level}`}
          </StyledChip>
        </div>
        <StyledChip
          className={styles.chip}>{`${formatDate(alert.startDate)} - ${formatDate(alert.endDate)}`}</StyledChip>
      </div>
      {!isPreview && (
        <>
          <Typography level="body-lg">{alert.description}</Typography>
          <Link href={alert.url} target="_blank" rel="noopener noreferrer">
            <StyledChip className={styles.chip}>Click Here For More Details</StyledChip>
          </Link>
        </>
      )}
    </ContentCard>
  );
});

export {AlertItem};
