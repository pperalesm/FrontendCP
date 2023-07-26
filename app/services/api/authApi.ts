import { ApiResponse } from 'apisauce';
import { RoleEnum, UserSnapshotIn } from '../../models/User';
import { Api, handleResponse } from './api';
import { GeneralApiProblem } from './apiProblem';
import * as SecureStore from 'expo-secure-store';
import { TokenResponseDto } from './api.types';

export async function signIn(this: Api, email: string, password: string) {
  const response: ApiResponse<TokenResponseDto> = await this.apisauce.post(
    `auth/sign-in`,
    {
      email,
      password,
    },
  );

  return await handleResponse(response, async (res) => {
    const user: UserSnapshotIn = {
      ...res.data.user,
      role: RoleEnum[res.data.user.role],
      createdAt: new Date(res.data.user.createdAt),
      updatedAt: new Date(res.data.user.updatedAt),
    };

    this.apisauce.setHeader('Authorization', `Bearer ${res.data.accessToken}`);

    await SecureStore.setItemAsync('refreshToken', res.data.refreshToken);

    return { kind: 'ok', user };
  });
}

export async function signUp(this: Api, email: string, password: string) {
  const response: ApiResponse<null> = await this.apisauce.post(`auth/sign-up`, {
    email,
    password,
  });

  return await handleResponse(response, async () => {
    this.apisauce.deleteHeader('Authorization');

    await SecureStore.deleteItemAsync('refreshToken');

    return { kind: 'ok' };
  });
}

export async function signOut(
  this: Api,
): Promise<{ kind: 'ok' } | GeneralApiProblem> {
  const response: ApiResponse<null> = await this.apisauce.delete(
    `auth/sign-out`,
  );

  return await handleResponse(response, () => {
    return { kind: 'ok' };
  });
}

export async function requestActivation(this: Api) {
  const response: ApiResponse<null> = await this.apisauce.post(
    `auth/request-activation`,
  );

  return await handleResponse(response, () => {
    return { kind: 'ok' };
  });
}

export async function requestPasswordReset(
  this: Api,
  email: string,
  password: string,
) {
  const response: ApiResponse<null> = await this.apisauce.post(
    `auth/request-password-reset`,
    { email, password },
  );

  return await handleResponse(response, () => {
    return { kind: 'ok' };
  });
}

export async function me(this: Api) {
  const response: ApiResponse<UserSnapshotIn> = await this.apisauce.get(
    `users/me`,
  );

  return await handleResponse(response, (res) => {
    const user: UserSnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };

    return { kind: 'ok', user };
  });
}
