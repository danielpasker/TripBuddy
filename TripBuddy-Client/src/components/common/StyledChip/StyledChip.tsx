import {Chip, styled} from '@mui/joy';

const StyledChip = styled(Chip)({
  backgroundColor: 'rgba(141,141,141,0.1)',
  backdropFilter: 'blur(8px)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  '&.MuiChip-colorDanger': {
    color: 'rgb(255, 222, 222)',
    backgroundColor: 'rgba(125, 18, 18, 0.6)',
    borderColor: 'rgba(125, 18, 18, 0.4)',
  },
  '&.MuiChip-colorSuccess': {
    color: 'rgb(235, 255, 235)',
    backgroundColor: 'rgba(10, 71, 10, 0.6)',
    borderColor: 'rgba(10, 71, 10, 0.4)',
  },
  '&.MuiChip-colorWarning': {
    color: 'rgb(255,241,223)',
    backgroundColor: 'rgba(182, 112, 6, 0.6)',
    borderColor: 'rgba(182, 112, 6, 0.4)',
  },
});
export {StyledChip};
