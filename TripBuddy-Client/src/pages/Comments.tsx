import {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Add, ArrowBack} from '@mui/icons-material';
import {Grid} from '@mui/joy';
import {CommentList} from '@components/CommentList';
import {PostItem} from '@components/PostItem';
import {PostItemSkeleton} from '@components/PostItem/PostItemSkeleton';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {StyledButton} from '@components/common/StyledButton';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {StyledInput} from '@components/common/input/StyledInput';
import {Comment} from '@customTypes/Comment';
import {Post} from '@customTypes/Post';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {createNewComment, getAllComments} from '@services/commentsApi';
import {getPostById} from '@services/postsApi';
import styles from '@styles/comments.module.scss';

const Comments: FC = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();
  const {postId} = useParams();

  const {data: initialPost, isFetching: isFetchingPost} = useFetch(getPostById, postId?.toString() ?? '');
  const {data: initialComments = [], isFetching: isFetchingComments} = useFetch(
    getAllComments,
    postId?.toString() ?? ''
  );

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentContent, setCommentContent] = useState<string>('');

  const showPostLoading = useLoadingWithDelay(isFetchingPost);
  const showCommentLoading = useLoadingWithDelay(isFetchingComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const handleSaveComment = async () => {
    if (user && post) {
      try {
        const newComment = await createNewComment({
          content: commentContent,
          userId: user._id,
          postId: post._id,
          createdTime: new Date().toISOString(),
        });
        setComments(prevState => [newComment, ...prevState]);
        setPost(prevState => (prevState ? {...prevState, commentCount: prevState.commentCount + 1} : undefined));

        setCommentContent('');
        toast.success('Comment was added');
      } catch {
        toast.error("We couldn't add your new comment");
      }
    }
  };

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.HOME);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <TitleWithDivider title="What people say about this post" />
      <Grid container spacing="32px" className={styles.grid}>
        <Grid xs={7} className={styles.postGridItem}>
          {!post || showPostLoading ? <PostItemSkeleton /> : <PostItem post={post} />}
          <StyledInput
            className={styles.input}
            placeholder="Add a comment..."
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            endDecorator={
              <StyledIconButton
                className={styles.addButton}
                disabled={!user || !commentContent.trim()}
                onClick={handleSaveComment}>
                <Add />
              </StyledIconButton>
            }
          />
        </Grid>
        <Grid xs={5}>
          <CommentList comments={comments} showLoading={showCommentLoading} />
        </Grid>
      </Grid>
      <StyledButton size="lg" className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
        Return to feed
      </StyledButton>
    </div>
  );
};

export default Comments;
