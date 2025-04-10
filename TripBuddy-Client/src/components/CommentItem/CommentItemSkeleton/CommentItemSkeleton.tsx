import {memo} from 'react';
import {UserSkeleton} from 'src/components/UserSkeleton';
import {Skeleton} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';

const CommentItemSkeleton = memo(() => (
  <ContentCard>
    <UserSkeleton />
    <Skeleton variant="text" width="100%" height={20} />
  </ContentCard>
));

export {CommentItemSkeleton};
