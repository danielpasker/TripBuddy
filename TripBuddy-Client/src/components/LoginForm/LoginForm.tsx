import {AxiosError} from 'axios';
import {FC, useCallback} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {LoginRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useMutation} from '@hooks/useMutation';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {googleLogin, registerUser, userLogin} from '@services/authApi';
import {LoginSchemaType, loginSchema} from './form';
import styles from './styles.module.scss';
import { useValidatedForm } from '@hooks/UseValidatedSchema';

const LoginForm: FC = () => {
  const {
    handleSubmit,
    control,
    formState: {isValid},
  } = useValidatedForm(loginSchema);
  const navigate = useNavigate();
  const {setUser} = useUserContext();

  const {trigger: register, isLoading: isRegistering} = useMutation(registerUser);
  const {trigger: login, isLoading: isLoggingIn} = useMutation(userLogin);

  const handleRegistration = async (loginForm: LoginSchemaType) => {
    try {
      await register(loginForm);
      toast.success('Registration successful! You can now login');
    } catch (e) {
      toast.error(`Error registering user: ${(e as AxiosError)?.response?.data}`);
    }
  };

  const handleLogin = async (loginForm: LoginSchemaType) => {
    try {
      const user = await login(loginForm);
      setUser(user);
      navigate(ClientRoutes.HOME);

      toast.success(`Welcome back, ${user.userName}`);
    } catch (e) {
      toast.error(`Error logging in: ${(e as AxiosError)?.response?.data}`);
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse);
      setUser(user);
      navigate(ClientRoutes.HOME);

      toast.success(`Welcome, ${user.userName}`);
    } catch (e) {
      toast.error(`Error logging in: ${(e as AxiosError)?.response?.data}`);
    }
  };

  const onGoogleLoginError = useCallback(() => {
    toast.error('Error logging in');
  }, []);

  return (
    <div className={styles.container}>
      <Typography level="h4">Login / Register</Typography>
      <FormInput
        control={control}
        formKey="email"
        inputLabel="Email"
        inputMode="email"
        placeholder="Enter your email"
      />
      <FormInput
        control={control}
        formKey="password"
        inputLabel="Password"
        type="password"
        placeholder="Enter your password"
      />
      <div className={styles.actionsContainer}>
        <div className={styles.googleLogin}>
          <GoogleLogin
            theme="filled_black"
            shape="pill"
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginError}
          />
        </div>
        <div className={styles.loginRegister}>
          <StyledButton disabled={!isValid} loading={isRegistering} onClick={handleSubmit(handleRegistration)}>
            Register
          </StyledButton>
          <StyledButton
            disabled={!isValid}
            loading={isLoggingIn}
            onClick={handleSubmit(handleLogin)}
            startDecorator={<LoginRounded />}>
            Login
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export {LoginForm};
