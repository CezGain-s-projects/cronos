import { LoginForm } from '@/constants/types';
import useApi from './useApi';
import { useTranslation } from 'react-i18next';
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import { PR } from '@/constants/routes';

const useAuthApi = () => {
  const { post } = useApi();
  const { t } = useTranslation('auth');
  const toast = useToastController();

  const login = {
    process: async (data: LoginForm) => post('/auth/login', data),
    onSuccess: (data: any) => {
      // TODO: Handle success
      console.log('success', data);
      router.push(PR.home);
    },
    onError: (error: any) => {
      // TODO: Handle other errors
      console.log('error', error);
    },
    onFormError: () => toast.show(t('error.invalid_credentials')),
  };

  return { login };
};

export default useAuthApi;
