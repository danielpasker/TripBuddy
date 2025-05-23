import {memo} from 'react';
import {UserSkeleton} from 'src/components/UserSkeleton';
import {Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {ContentCard} from '@components/common/ContentCard';
import {Comment} from '@customTypes/Comment';
import {useFetch} from '@hooks/useFetch';
import {getUserById} from '@services/usersApi';
import {LONG_DISPLAY_DATE_FORMAT, formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  comment: Comment;
}

const CommentItem = memo<Props>(({comment}) => {
  const {data: creatingUser, isFetching: isFetchingUser} = useFetch(getUserById, comment.userId);

  return (
    <ContentCard>
      <div className={styles.container}>
        <div className={styles.detailsContent}>
          {isFetchingUser || !creatingUser ? (
            <UserSkeleton />
          ) : (
            <div className={styles.header}>
              <UserAvatar user={creatingUser} />
              <div>
                <Typography level="body-lg" fontWeight={700}>
                  {`@${creatingUser.userName}`}
                </Typography>
                <Typography level="body-md">{formatDate(comment.createdTime, LONG_DISPLAY_DATE_FORMAT)}</Typography>
              </div>
            </div>
          )}
          <div className={styles.content}>
            <Typography level="body-lg" className={styles.text}>
              {comment.content}
            </Typography>
          </div>
        </div>
      </div>
    </ContentCard>
  );
});

export {CommentItem};
