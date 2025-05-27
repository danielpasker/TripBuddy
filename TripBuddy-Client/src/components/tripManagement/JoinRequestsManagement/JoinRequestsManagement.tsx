import {FC, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {PeopleRounded} from '@mui/icons-material';
import {Dropdown, Menu, MenuButton, Switch, Typography} from '@mui/joy';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {JoinRequestItem} from '@components/tripManagement/JoinRequestsManagement/JoinRequestItem';
import {JoinRequestPreview} from '@customTypes/JoinRequest';
import {Trip} from '@customTypes/Trip';
import {useFetch} from '@hooks/useFetch';
import {useMutation} from '@hooks/useMutation';
import {approveJoinRequest, declineJoinRequest, getJoinRequests} from '@services/joinRequestsApi';
import {setIsTripOpenToJoin} from '@services/tripsApi';
import styles from './styles.module.scss';

interface Props {
  trip?: Trip;
  setTrip: (trip: Trip) => void;
}

const JoinRequestsManagement: FC<Props> = ({trip, setTrip}) => {
  const {data: initialRequests = [], isFetching: isFetchingRequests} = useFetch(getJoinRequests, trip?._id ?? '');
  const [joinRequests, setJoinRequests] = useState<JoinRequestPreview[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {trigger: accept} = useMutation(approveJoinRequest);
  const {trigger: decline} = useMutation(declineJoinRequest);

  useEffect(() => {
    setJoinRequests(initialRequests);
  }, [initialRequests]);

  const handleAccept = async (joinRequestId: string) => {
    try {
      const updatedTrip = await accept(joinRequestId);

      setTrip?.(updatedTrip);
      setJoinRequests(prevState => prevState.filter(request => request._id !== joinRequestId));
      toast.success('Join request accepted successfully');
    } catch {
      toast.error('Failed to accept join request');
    }
  };

  const handleDecline = async (joinRequestId: string) => {
    try {
      await decline(joinRequestId);
      setJoinRequests(prevState => prevState.filter(request => request._id !== joinRequestId));
    } catch {
      toast.error('Failed to decline join request');
    }
  };

  const handleToggleChange = async (isOpenToJoin: boolean) => {
    if (trip) {
      try {
        await setIsTripOpenToJoin(trip._id, isOpenToJoin);
        setTrip({...trip, isOpenToJoin});
      } catch {
        toast.error('Failed to update trip open to join status');
      }
    }
  };

  return (
    <Dropdown>
      <MenuButton
        loading={isFetchingRequests}
        disabled={!trip || isFetchingRequests}
        slots={{root: StyledButton}}
        onClick={() => setIsMenuOpen(prevState => !prevState)}
        startDecorator={<PeopleRounded />}>
        {`Join Requests (${joinRequests.length})`}
      </MenuButton>
      {trip && (
        <Menu open={isMenuOpen} variant="solid" style={{backgroundColor: 'transparent', boxShadow: 'none'}}>
          <ContentCard className={styles.container}>
            <TitleWithDivider title="Join Requests" />
            <div className={styles.content}>
              <Switch
                checked={trip.isOpenToJoin}
                onChange={event => handleToggleChange(event.target.checked)}
                size="lg"
                endDecorator={<Typography level="body-lg">Open to join Requests</Typography>}
              />
              {joinRequests.map(joinRequest => (
                <JoinRequestItem
                  key={joinRequest._id}
                  joinRequest={joinRequest}
                  requiredUsersAmount={trip.users.length}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
              <Typography textAlign="center">
                All trip participants must approve for the user to join the trip
              </Typography>
            </div>
          </ContentCard>
        </Menu>
      )}
    </Dropdown>
  );
};

export {JoinRequestsManagement};
