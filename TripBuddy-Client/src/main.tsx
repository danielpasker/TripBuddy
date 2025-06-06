import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';
import {ToastContainer} from 'react-toastify';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import {Layout} from '@components/Layout';
import {ClientRoutes} from '@enums/clientRoutes';
import {UserProvider} from '@contexts/UserContext';
import Comments from '@pages/Comments';
import Home from '@pages/Home';
import JoinTrip from '@pages/JoinTrip';
import Login from '@pages/Login';
import NewTrip from '@pages/NewTrip';
import Profile from '@pages/Profile';
import {TripAlerts} from '@pages/TripAlerts';
import TripChat from '@pages/TripChat';
import TripManagement from '@pages/TripManagement';
import TripPlan from '@pages/TripPlan';
import {GoogleOAuthProvider} from '@react-oauth/google';
import '@styles/index.module.scss';
import {theme} from './Theme';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="468248101450-64v26lpmuh6alve8gen1gn0feosaq26m.apps.googleusercontent.com">
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
                <Route path={`${ClientRoutes.TRIPS}/:tripId`} element={<TripManagement />} />
                <Route path={`${ClientRoutes.TRIPS}/:tripId/plan`} element={<TripPlan />} />
                <Route path={`${ClientRoutes.TRIPS}/:tripId/chat`} element={<TripChat />} />
                <Route path={`${ClientRoutes.TRIPS}/join`} element={<JoinTrip />} />
                <Route path={`${ClientRoutes.TRIPS}/:tripId/${ClientRoutes.ALERTS}`} element={<TripAlerts />} />
                <Route path={ClientRoutes.PROFILE} element={<Profile />} />
              </Route>
            </Routes>
            <ToastContainer position="bottom-left" />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
