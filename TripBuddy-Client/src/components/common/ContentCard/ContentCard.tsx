import {PropsWithChildren, memo} from 'react';
import {styled} from '@mui/joy';
import {glassBorder, glassEffect} from '@styles/commonStyles';

const CardStyle = styled('div')<{disableGlassBorder?: true}>(({disableGlassBorder}) => ({
  ...glassEffect,
  padding: 16,
  borderRadius: 16,
  border: 'unset',
  '&::after': disableGlassBorder
    ? {}
    : {
        ...glassBorder,
        borderRadius: 16,
      },
}));

interface Props extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
  disableGlassBorder?: true;
}

const ContentCard = memo<Props>(({className, onClick, children, ...props}) => (
  <CardStyle className={className} onClick={onClick} {...props}>
    {children}
  </CardStyle>
));

export {ContentCard};
