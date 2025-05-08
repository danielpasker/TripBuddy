import {FC, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {AddRounded, FlightRounded} from '@mui/icons-material';
import {Grid} from '@mui/joy';
import {PostForm} from '@components/PostForm';
import {CreatePostSchemaType} from '@components/PostForm/form';
import {PostList} from '@components/PostList';
import {TitleWithDivider} from '@components/TitleWithDivider';
import {TripList} from '@components/TripList';
import {Popup} from '@components/common/Popup';
import {StyledButton} from '@components/common/StyledButton';
import {Post} from '@customTypes/Post';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {deleteCommentsByPostId} from '@services/commentsApi';
import {saveNewFile} from '@services/filesApi';
import {createNewPost, deletePost, getAllPosts, updatePost} from '@services/postsApi';
import styles from '@styles/home.module.scss';

const Home: FC = () => {
  const {user} = useUserContext();
  const navigate = useNavigate();

  const {data: initialPosts = [], isFetching} = useFetch(getAllPosts);

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
      } catch {
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
      } catch {
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
      } catch {
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
    } catch {
      toast.error("We couldn't delete your post");
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
        <TitleWithDivider title="Your Trips" />
        <div className={styles.actions}>
          <StyledButton
            className={styles.tripAction}
            size="lg"
            startDecorator={<AddRounded />}
            onClick={() => navigate(ClientRoutes.NEW_TRIP)}>
            Create New Trip
          </StyledButton>
          <StyledButton
            size="lg"
            className={styles.tripAction}
            startDecorator={<FlightRounded />}
            onClick={() => navigate(ClientRoutes.JOIN_TRIP)}>
            Join Trip
          </StyledButton>
        </div>
        {user && <TripList userId={user._id} />}
      </Grid>
      <Grid xs={6} className={styles.gridItem}>
        <TitleWithDivider title="Buddy Feed" />
        <PostList
          posts={posts}
          showLoading={showPostLoading}
          onEditClick={onEditPostClick}
          onDeleteClick={handleDeletePost}
        />
      </Grid>
      <Grid xs={3} className={styles.gridItem}>
        <TitleWithDivider title="New Post" />
        <PostForm handleSubmitPost={handleCreatePost} submitText="Share" />
      </Grid>
      <Popup open={!!editedPost} title="Update Post" onCancel={onCancelEditPost}>
        <PostForm handleSubmitPost={handleEditPost} post={editedPost} submitText="Update" />
      </Popup>
    </Grid>
  );
};

export default Home;
