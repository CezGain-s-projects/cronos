import { Trans, useTranslation } from 'react-i18next';
import { YStack } from 'tamagui';
import FormInput from '../molecules/FormInput';
import LoadingButton from '../molecules/LoadingButton';
import Text from '../atoms/Text';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { AR } from '@/constants/routes';
import { Controller } from 'react-hook-form';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoginForm } from '@/constants/types';
import useAuthApi from '@/hooks/api/useAuthApi';
import AuthTemplate from '../templates/AuthTemplate';
import RULES from '@/constants/rules';
import useForm from '@/hooks/useForm';
import { DEVICE } from '@/constants/config';

export default function LoginPage() {
  if (__DEV__) console.log('📃 - LoginPage');

  const { t } = useTranslation('auth');
  const { login } = useAuthApi();

  const refs = {
    identifier: useRef<TextInput>(null),
    password: useRef<TextInput>(null),
  };

  const { mutate: fetchLogin, isPending } = useMutation({
    mutationFn: login.process,
    onSuccess: login.onSuccess,
    onError: login.onError,
  });

  const { control, onSubmit, isFormPending } = useForm<LoginForm>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    onSuccess: fetchLogin,
    onError: login.onFormError,
  });

  return (
    <AuthTemplate
      customButton={
        <YStack>
          <LoadingButton onPress={onSubmit} isLoading={isPending || isFormPending}>
            {t('login')}
          </LoadingButton>
          <Text
            bottom={-20}
            position="absolute"
            fontSize={'$2'}
            color={'$inversed75'}
            alignSelf="center"
            onPress={() => router.push(AR.policies)}>
            <Trans
              t={t}
              i18nKey="no_account"
              components={{ underline: <Text unstyled textDecorationLine="underline" /> }}
            />
          </Text>
        </YStack>
      }
      gap={DEVICE.height * 0.08}>
      <Controller
        control={control}
        name="identifier"
        rules={{ required: true, ...RULES.identifier }}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            ref={refs[name]}
            type={name}
            onChangeText={onChange}
            value={value}
            onSubmitEditing={() => refs.password.current?.focus()}
          />
        )}
      />
      <YStack>
        <Controller
          control={control}
          name="password"
          rules={{ required: true, ...RULES.password }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              ref={refs[name]}
              type={name}
              onChangeText={onChange}
              value={value}
              onSubmitEditing={onSubmit}
            />
          )}
        />
        <Text fontSize={'$2'} color={'$inversed75'} alignSelf="flex-end">
          {t('forgot_password')}
        </Text>
      </YStack>
    </AuthTemplate>
  );
}