import { ApiResponse, ApisauceInstance, create } from 'apisauce';
import Config from '../../config';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import type { ApiConfig, ApiFeedResponse } from './api.types';
import type { EpisodeSnapshotIn } from '../../models/Episode';
import * as SecureStore from 'expo-secure-store';
import { RootStore } from '../../models';
import Toast from 'react-native-root-toast';
import { colors } from '../../theme';
import {
  ApiTokenResponse,
  me,
  requestActivation,
  signIn,
  signOut,
  signUp,
} from './authApi';

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
};

export class Api {
  apisauce: ApisauceInstance;
  config: ApiConfig;
  rootStore: RootStore;

  // Auth api
  signIn = signIn;
  signUp = signUp;
  signOut = signOut;
  requestActivation = requestActivation;
  me = me;

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });

    this.apisauce.addAsyncResponseTransform(async (response) => {
      if (response.status === 401 && this.rootStore.authenticationStore.user) {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        const refreshResponse: ApiResponse<ApiTokenResponse> =
          await this.apisauce.post(`auth/refresh-tokens`, {
            refreshToken,
          });

        if (refreshResponse.ok) {
          this.apisauce.setHeader(
            'Authorization',
            `Bearer ${refreshResponse.data.accessToken}`,
          );

          await SecureStore.setItemAsync(
            'refreshToken',
            refreshResponse.data.refreshToken,
          );

          const newResponse = await this.apisauce.any({
            ...response.config,
            headers: {
              ...response.config.headers,
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          });

          response.config = newResponse.config;
          response.data = newResponse.data;
          response.duration = newResponse.duration;
          response.headers = newResponse.headers;
          response.ok = newResponse.ok;
          response.originalError = newResponse.originalError;
          response.problem = newResponse.problem;
          response.status = newResponse.status;
        } else {
          this.rootStore.authenticationStore.signOut();
        }
      } else if (
        response.problem === 'SERVER_ERROR' ||
        response.problem === 'CONNECTION_ERROR' ||
        response.problem === 'TIMEOUT_ERROR'
      ) {
        Toast.show(
          'El servidor no se encuentra disponible en estos momentos. Por favor, inténtelo de nuevo más tarde.',
          {
            backgroundColor: colors.errorBackground,
            textColor: colors.error,
            duration: Toast.durations.LONG,
          },
        );
      } else if (response.problem === 'NETWORK_ERROR') {
        Toast.show(
          'Error de red. Por favor, compruebe su conexión a Internet.',
          {
            backgroundColor: colors.errorBackground,
            textColor: colors.error,
            duration: Toast.durations.LONG,
          },
        );
      } else if (response.problem === 'UNKNOWN_ERROR') {
        Toast.show(
          'Error desconocido. Por favor, inténtelo de nuevo más tarde.',
          {
            backgroundColor: colors.errorBackground,
            textColor: colors.error,
            duration: Toast.durations.LONG,
          },
        );
      }
    });
  }

  setRootStore(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  async getEpisodes(): Promise<
    { kind: 'ok'; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem
  > {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    );

    let problem: GeneralApiProblem;

    if (response.ok) {
      try {
        const rawData = response.data;

        const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
          ...raw,
        }));

        return { kind: 'ok', episodes };
      } catch (e) {
        if (__DEV__) {
          console.tron.error(
            `Bad data: ${e.message}\n${response.data}`,
            e.stack,
          );
        }
        problem = { kind: 'bad-data' };
      }
    } else {
      const error = getGeneralApiProblem(response);
      if (error) {
        problem = error;
      }
    }

    return problem;
  }
}

export const api = new Api();
