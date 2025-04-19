import {FC, useCallback} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
import {TripPlanPreview} from 'src/components/tripManagement/TripPlanPreview';
import {ChatBubbleOutlineRounded, FormatListBulletedRounded} from '@mui/icons-material';
import {Grid} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {TripDetailsCard} from '@components/TripDetailsCard';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {TripBuddiesPreview} from '@components/tripManagement/TripBuddiesPreview';
import {TripLoadingLottie} from '@components/tripManagement/TripLoadingLottie';
import {LoggedUser} from '@customTypes/User';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getTripById} from '@services/tripApi';
import styles from '@styles/tripManagement.module.scss';

// TODO: remove this mock data after the get function is implemented
const defaultTrip = (tripId?: string, user?: LoggedUser | null) => ({
  _id: tripId ?? '',
  users: [
    {
      userName: user?.userName ?? '',
      _id: user?._id ?? '',
      profileImageUrl: user?.profileImageUrl ?? '',
    },
    {userName: 'Rony', _id: '122', profileImageUrl: ''},
    {userName: 'Lior', _id: '124', profileImageUrl: ''},
    {userName: 'Gaya', _id: '4545', profileImageUrl: ''},
    {userName: 'Shiran', _id: '45455', profileImageUrl: ''},
  ],
  startDate: new Date('2023-10-01').toISOString(),
  endDate: new Date('2023-10-10').toISOString(),
  plan: {
    location: 'Rome',
    countryCode: 'IT',
    days: 3,
    budget: '2000 EUR',
    participants: 2,
    plan: [
      {
        day: 1,
        activities: [
          {
            activity:
              "Begin your Roman holiday with a visit to the Colosseum, the iconic amphitheater of the Roman Empire, and explore the Roman Forum, the heart of ancient Rome's political and social life. Wander through the ruins of temples, basilicas, and public spaces, imagining the grandeur of the past.",
            location: 'Colosseum',
          },
          {
            activity:
              'After immersing yourselves in ancient history, toss a coin into the Trevi Fountain, ensuring your return to Rome according to legend, and then indulge in a delicious gelato at a nearby gelateria. Afterwards, enjoy the architectural beauty and artistic treasures within the Pantheon, a marvel of Roman engineering.',
            location: 'Trevi Fountain',
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            activity:
              "Dedicate the morning to Vatican City, starting with St. Peter's Basilica, a magnificent example of Renaissance architecture and a key pilgrimage site. Then, immerse yourselves in art history at the Vatican Museums, home to the Sistine Chapel and countless priceless artifacts, sculptures and paintings.",
            location: "St. Peter's Basilica",
          },
          {
            activity:
              "In the afternoon, cross the Ponte Sant'Angelo, adorned with angel statues, towards Castel Sant'Angelo, a former mausoleum transformed into a papal fortress. Explore the castle's ramparts for panoramic city views, then enjoy a traditional Roman dinner in the charming neighborhood of Trastevere.",
            location: "Castel Sant'Angelo",
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            activity:
              'Explore the Borghese Gallery and Gardens, home to masterpieces by Bernini and Caravaggio, in a tranquil setting. Pre-booking tickets is essential due to timed entry. Afterward, wander through the picturesque gardens, enjoying the sculptures, fountains, and serene atmosphere.',
            location: 'Borghese Gallery and Museum',
          },
          {
            activity:
              'Conclude your Roman adventure with a visit to the Spanish Steps, a monumental staircase linking the Piazza di Spagna with the Trinità dei Monti church. Enjoy the vibrant atmosphere and the views from the top before a final authentic Italian meal to celebrate your cultural exploration.',
            location: 'Spanish Steps',
          },
        ],
      },
    ],
  },
});

const TripManagement: FC = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {tripId} = useParams();

  const {data: trip = defaultTrip(tripId, user), isFetching} = useFetch(getTripById, tripId?.toString() ?? '');
  const showLoading = useLoadingWithDelay(isFetching, 1500);

  const onShowFullPlan = useCallback(() => {
    navigate(`${ClientRoutes.TRIPS}/${tripId}/plan`);
  }, [navigate, tripId]);

  return showLoading ? (
    <TripLoadingLottie />
  ) : (
    <Grid container spacing="16px">
      <Grid xs={3} className={styles.gridItem}>
        <TripDetailsCard tripPlan={trip.plan} />
        <ContentCard className={styles.buddiesGridCard}>
          <TitleWithDivider title="My Trip Buddies" />
          <TripBuddiesPreview tripBuddies={trip.users} />
          <StyledButton className={styles.button} startDecorator={<ChatBubbleOutlineRounded />}>
            Chat With Buddies
          </StyledButton>
        </ContentCard>
      </Grid>
      <Grid xs className={styles.gridItem}>
        <ContentCard className={styles.gridCard}>
          <TitleWithDivider title="What Am I Doing" />
          <TripPlanPreview tripPlan={trip.plan} />
          <StyledButton
            className={styles.button}
            onClick={onShowFullPlan}
            startDecorator={<FormatListBulletedRounded />}>
            View Full Plan
          </StyledButton>
        </ContentCard>
      </Grid>
      <Grid xs className={styles.gridItem}>
        <ContentCard className={styles.gridCard}>
          <TitleWithDivider title="Emergency Alerts" />
          <StyledButton className={styles.button} startDecorator={<FormatListBulletedRounded />}>
            View All Alerts
          </StyledButton>
        </ContentCard>
      </Grid>
    </Grid>
  );
};

export default TripManagement;
