import {IconButton, styled} from '@mui/joy';
import commonStyles from '@styles/palette.module.scss';

const StyledIconButton = styled(IconButton)({
  display: 'flex',
  gap: 6,
  alignItems: 'center',
  transition: 'background-color 0.2s',
  '> svg': {
    fill: commonStyles.fontColor,
  },
  '&:disabled': {
    '> svg': {
      fill: 'rgba(255,255,255,0.2)',
    },
  },
  '&:hover': {
    backgroundColor: 'white',
    '> svg': {
      fill: 'black',
    },
    p: {
      color: 'black',
    },
  },
});

export {StyledIconButton};
