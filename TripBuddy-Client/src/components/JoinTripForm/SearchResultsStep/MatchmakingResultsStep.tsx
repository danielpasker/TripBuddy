import {FC, useMemo, useState} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {ArrowBack, HomeRounded, ThumbDownRounded, ThumbUpRounded} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {Gauge, PieChart} from '@mui/x-charts';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripBuddiesPreview} from '@components/tripManagement/TripBuddiesPreview';
import {TripPlanPreview} from '@components/tripManagement/TripPlanPreview';
import {Trip} from '@customTypes/Trip';
import {User} from '@customTypes/User';
import {ClientRoutes} from '@enums/clientRoutes';
import {useMutation} from '@hooks/useMutation';
import {createJoinRequest} from '@services/joinRequestsApi';
import styles from './styles.module.scss';

interface Props {
  results: Trip[];
  onReturn: () => void;
}

const MatchmakingResultsStep: FC<Props> = ({results, onReturn}) => {
  const navigate = useNavigate();
  const {trigger: handleInterested, isLoading} = useMutation(createJoinRequest);

  const [currentIndex, setCurrentIndex] = useState(results.length === 0 ? -1 : 0);
  const currentResult = useMemo(() => results[currentIndex] ?? null, [results, currentIndex]);

  const onNextResult = () => setCurrentIndex(prevState => prevState + 1);
  const onNavigateHome = () => navigate(ClientRoutes.HOME);

  const averageAge = useMemo(() => {
    if (!currentResult || currentResult.users.length === 0) {
      return 0;
    }

    const totalAge = currentResult.users
      .filter(user => user.age !== null)
      .reduce((sum, user) => sum + Number(user.age), 0);

    return Math.round(totalAge / currentResult.users.length);
  }, [currentResult]);

  const getUserInfoSegmentation = (field: keyof User) => {
    const counts = currentResult?.users
      .filter(user => user[field] !== null && user[field] !== undefined)
      .reduce(
        (acc, user) => {
          const key = String(user[field]);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(counts ?? {}).map(([field, count]) => ({id: field, value: count, label: field}));
  };

  const onInterestedClick = async () => {
    try {
      await handleInterested(currentResult._id);

      toast.success('Join request sent successfully');
      onNextResult();
    } catch {
      toast.error('Failed to send join request');
    }
  };

  return (
    <Grid container spacing="32px">
      {results.length === 0 || !currentResult ? (
        <Grid xs={12} className={styles.emptyState}>
          <Typography level="h2">
            {results.length === 0
              ? 'No results were found at this time. Try adjusting your filters.'
              : 'You’ve reached the end of the results. Please go back or refine your search.'}
          </Typography>
          <img className={styles.suitcase} src="/images/empty_suitcase.png" alt="empty suitcase" />
          <div className={styles.emptyStateActions}>
            <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={onReturn}>
              Return
            </StyledButton>
            <StyledButton className={styles.returnButton} startDecorator={<HomeRounded />} onClick={onNavigateHome}>
              Home
            </StyledButton>
          </div>
        </Grid>
      ) : (
        <>
          <Grid xs={2} className={styles.actions}>
            <StyledButton
              size="lg"
              color="success"
              loading={isLoading}
              onClick={onInterestedClick}
              startDecorator={<ThumbUpRounded />}
              className={styles.button}>
              Interested
            </StyledButton>
            <StyledButton
              size="lg"
              color="danger"
              startDecorator={<ThumbDownRounded />}
              className={styles.button}
              onClick={onNextResult}>
              Not Interested
            </StyledButton>
            <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={onReturn}>
              Return
            </StyledButton>
          </Grid>
          <Grid xs={7.5} className={styles.gridItem}>
            <TitleWithDivider
              title={`Result ${results.indexOf(currentResult) + 1} of ${results.length} suggested trips`}
            />
            <div>
              <Grid container spacing="16px">
                <Grid xs={5}>
                  <TripDetailsCard
                    tripPlan={currentResult.plan}
                    startDate={currentResult.startDate}
                    endDate={currentResult.endDate}
                  />
                </Grid>
                <Grid xs={7}>
                  <ContentCard className={styles.participants}>
                    <TitleWithDivider title="Participants" />
                    <TripBuddiesPreview tripBuddies={currentResult.users} />
                  </ContentCard>
                </Grid>
              </Grid>
            </div>
            <TitleWithDivider title="Trip Locations" />
            <div className={styles.tripPlanPreview}>
              <TripPlanPreview tripPlan={currentResult.plan} />
            </div>
          </Grid>
          <Grid xs={2.5} className={styles.gridItem}>
            <ContentCard className={styles.charts}>
              <TitleWithDivider title="Participants Data" />
              <div className={styles.chart}>
                <PieChart series={[{data: getUserInfoSegmentation('gender')}]} height={100} width={100} />
                <Typography>Genders</Typography>
              </div>
              <div className={styles.chart}>
                <PieChart series={[{data: getUserInfoSegmentation('religion')}]} height={100} width={100} />
                <Typography>Religions</Typography>
              </div>
              <div className={styles.chart}>
                <PieChart series={[{data: getUserInfoSegmentation('diet')}]} height={100} width={100} />
                <Typography>Diets</Typography>
              </div>
              <div className={styles.chart}>
                <Gauge className={styles.averageAge} width={100} height={100} value={averageAge} cornerRadius="50%" />
                <Typography>Average Age</Typography>
              </div>
            </ContentCard>
          </Grid>
        </>
      )}
    </Grid>
  );
};
export {MatchmakingResultsStep};
