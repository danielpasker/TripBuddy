import {MenuItem} from '@customTypes/menuItem';
import {ClientRoutes} from '@enums/clientRoutes';

const menuItems: MenuItem[] = [
  {
    text: 'Home',
    route: ClientRoutes.HOME,
  },
  {
    text: 'Profile',
    route: ClientRoutes.PROFILE,
  },
];

export {menuItems};
