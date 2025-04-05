import {FC, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {FlightRounded, LogoutRounded} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {PostForm} from '@components/PostForm';
import {PostList} from '@components/PostList';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {Post} from '@customTypes/Post';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';
import {deleteCommentsByPostId} from '@services/commentsApi';
import {saveNewFile} from '@services/filesApi';
import {createNewPost, deletePost, getAllPosts, updatePost} from '@services/postsApi';
import styles from '@styles/common.module.scss';
import { CreatePostSchemaType } from '@components/PostForm/form';

const Home: FC = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();

  const {data: initialPosts = [], isFetching} = useFetch(getAllPosts);
  const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editedPost, setEditedPost] = useState<Post>();
  const showPostLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleUploadPostImage = async (postDetailsForm: CreatePostSchemaType) => {
    let imageUrl: string | null = null;

    if (postDetailsForm.image) {
      try {
        const result = await saveNewFile(postDetailsForm.image);
        imageUrl = result.url;
      } catch (e) {
        toast.error("We couldn't upload your image");
      }
    }

    return imageUrl;
  };

  const handleCreatePost = async (postDetailsForm: CreatePostSchemaType) => {
    if (user) {
      try {
        const imageUrl = await handleUploadPostImage(postDetailsForm);
        const newPost = await createNewPost({
          content: postDetailsForm.content,
          imageUrl,
          userId: user?._id,
          createdTime: new Date().toISOString(),
        });
        setPosts(prevState => [{...newPost, user}, ...prevState]);
        toast.success('Your new post was added');
      } catch (e) {
        toast.error("We couldn't add your new post");
      }
    }
  };

  const handleEditPost = async (postDetailsForm: CreatePostSchemaType) => {
    if (user && editedPost) {
      try {
        const imageUrl = await handleUploadPostImage(postDetailsForm);
        const updatedPost = await updatePost(editedPost._id, {
          content: postDetailsForm.content,
          imageUrl,
          userId: user?._id,
          createdTime: new Date().toISOString(),
        });
        setPosts(prevState => [{...updatedPost, user}, ...prevState.filter(({_id}) => _id !== editedPost._id)]);
        setEditedPost(undefined);
        toast.success('Post was successfully updated');
      } catch (e) {
        toast.error("We couldn't update your post");
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteCommentsByPostId(postId);
      await deletePost(postId);
      setPosts(prevState => prevState.filter(({_id}) => _id !== postId));
      toast.success('Post was successfully deleted');
    } catch (e) {
      toast.error("We couldn't delete your post");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');

      toast.success('Logged out successfully');
    } catch (e) {
      toast.error('Error logging out');
    }
  };

  const onEditPostClick = (post: Post) => {
    setEditedPost(post);
  };

  const onCancelEditPost = useCallback(() => {
    setEditedPost(undefined);
  }, [setEditedPost]);

  return (
    <Grid container spacing="16px">
      <Grid xs={3} className={styles.gridItem}>
        <Typography level="h3">Your Trips</Typography>
        <StyledButton startDecorator={<FlightRounded />} onClick={() => navigate(ClientRoutes.NEW_TRIP)}>
          New Trip
        </StyledButton>
        <StyledButton startDecorator={<LogoutRounded />} loading={isLoggingOut} onClick={handleLogout}>
          Logout
        </StyledButton>
      </Grid>
      <Grid xs={6} className={styles.gridItem}>
        <Typography level="h3">Posts Feed</Typography>
        <PostList
          posts={posts}
          showLoading={showPostLoading}
          onEditClick={onEditPostClick}
          onDeleteClick={handleDeletePost}
        />
      </Grid>
      <Grid xs={3} className={styles.gridItem}>
        <Typography level="h3">New Post</Typography>
        <PostForm handleSubmitPost={handleCreatePost} submitText="Share" />
      </Grid>
      <Popup open={!!editedPost} title="Update Post" onCancel={onCancelEditPost}>
        <PostForm handleSubmitPost={handleEditPost} post={editedPost} submitText="Update" />
      </Popup>
    </Grid>
  );
};

export default Home;
