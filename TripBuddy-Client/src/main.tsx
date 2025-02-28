import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';
import {ToastContainer} from 'react-toastify';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import {Layout} from '@components/Layout';
import {ClientRoutes} from '@enums/clientRoutes';
import {UserProvider} from '@contexts/UserContext';
import Comments from '@pages/Comments';
import Login from '@pages/Login';
import Home from '@pages/Home';
import NewTrip from '@pages/NewTrip';
import {GoogleOAuthProvider} from '@react-oauth/google';
import '@styles/index.module.scss';
import {theme} from './Theme';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="1070493279650-fdhbigfkh36sbo7tig40j34cifj0j007.apps.googleusercontent.com">
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index path={ClientRoutes.HOME} element={<Home />} />
                <Route path={`${ClientRoutes.POST}/:postId${ClientRoutes.COMMENTS}`} element={<Comments />} />
                <Route path={ClientRoutes.NEW_TRIP} element={<NewTrip />} />
              </Route>
            </Routes>
            <ToastContainer position="bottom-left" />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>,
);
