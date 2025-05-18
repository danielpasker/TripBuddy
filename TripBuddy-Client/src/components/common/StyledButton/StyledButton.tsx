import {Button, styled} from '@mui/joy';
import commonStyles from '@styles/palette.module.scss';

const StyledButton = styled(Button)({
  borderRadius: 8,
  padding: '8px 16px',
  color: commonStyles.fontColor,
  fontSize: 14,
  fontWeight: 400,
  backgroundColor: 'rgba(44, 44, 44, 0.5)',
  border: 'solid',
  borderWidth: 1,
  borderColor: '#2C2C2C',
  width: 'max-content',
  transition: 'color 0.3s, background-color 0.3s, border-color 0.3s',
  '&:hover': {
    backgroundColor: commonStyles.fontColor,
    color: '#2C2C2C',
    borderColor: commonStyles.fontColor,
    outline: `1px solid ${commonStyles.fontColor}`,
  },
  '&:disabled': {
    backgroundColor: 'rgba(44, 44, 44, 0.2)',
    color: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(44, 44, 44, 0.2)',
    cursor: 'not-allowed',
  },
  '&.MuiButton-colorDanger': {
    backgroundColor: 'rgba(125, 18, 18, 0.6)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      backgroundColor: commonStyles.fontColor,
      color: 'rgb(125, 18, 18)',
      borderColor: 'rgb(125, 18, 18)',
      outline: '1px solid rgb(125, 18, 18)',
      fontWeight: 700,
    },
  },
  '&.MuiButton-colorSuccess': {
    backgroundColor: 'rgba(10, 71, 10, 0.5)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      backgroundColor: commonStyles.fontColor,
      color: '#0A470AFF',
      borderColor: '#0A470AFF',
      outline: '1px solid #0A470AFF',
      fontWeight: 700,
    },
  },
  '&.MuiButton-sizeLg': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontSize: 18,
    gap: '8px',
    '& .MuiButton-startDecorator': {
      fontSize: 24,
      '--Icon-margin': 0,
      '--Button-gap': 0,
    },
  },
});

export {StyledButton};
