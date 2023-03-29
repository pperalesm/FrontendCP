import { ApiResponse } from 'apisauce';
import { UserSnapshotIn } from '../../models/User';
import { Api } from './api';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import * as SecureStore from 'expo-secure-store';

export interface ApiTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSnapshotIn;
}

export async function signIn(
  this: Api,
  email: string,
  password: string,
): Promise<
  | {
      kind: 'ok';
      user: UserSnapshotIn;
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<ApiTokenResponse> = await this.apisauce.post(
    `auth/sign-in`,
    {
      email,
      password,
    },
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const user: UserSnapshotIn = {
        ...response.data.user,
        createdAt: new Date(response.data.user.createdAt),
        updatedAt: new Date(response.data.user.updatedAt),
      };

      this.apisauce.setHeader(
        'Authorization',
        `Bearer ${response.data.accessToken}`,
      );

      await SecureStore.setItemAsync(
        'refreshToken',
        response.data.refreshToken,
      );

      return { kind: 'ok', user };
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return { kind: 'bad-data' };
    }
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}

export async function signUp(
  this: Api,
  email: string,
  password: string,
): Promise<{ kind: 'ok' } | GeneralApiProblem> {
  const response: ApiResponse<null> = await this.apisauce.post(`auth/sign-up`, {
    email,
    password,
  });

  let problem: GeneralApiProblem;

  if (response.ok) {
    this.apisauce.deleteHeader('Authorization');

    await SecureStore.deleteItemAsync('refreshToken');

    return { kind: 'ok' };
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}

export async function signOut(
  this: Api,
): Promise<{ kind: 'ok' } | GeneralApiProblem> {
  const response: ApiResponse<null> = await this.apisauce.delete(
    `auth/sign-out`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    return { kind: 'ok' };
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}

export async function requestActivation(
  this: Api,
): Promise<{ kind: 'ok' } | GeneralApiProblem> {
  const response: ApiResponse<null> = await this.apisauce.post(
    `auth/request-activation`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    return { kind: 'ok' };
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}

export async function me(
  this: Api,
): Promise<{ kind: 'ok'; user: UserSnapshotIn } | GeneralApiProblem> {
  const response: ApiResponse<UserSnapshotIn> = await this.apisauce.get(
    `users/me`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const user: UserSnapshotIn = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };

      return { kind: 'ok', user };
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return { kind: 'bad-data' };
    }
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}
