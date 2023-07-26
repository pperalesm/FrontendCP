import { ApiResponse, ApisauceInstance, create } from 'apisauce';
import Config from '../../config';
import type { ApiConfig, TokenResponseDto } from './api.types';
import * as SecureStore from 'expo-secure-store';
import {
  me,
  requestActivation,
  requestPasswordReset,
  signIn,
  signOut,
  signUp,
} from './authApi';
import {
  createOneEntry,
  deleteOneEntry,
  readAllNotebooks,
  readManyEntries,
  updateOneEntry,
} from './notebooksApi';
import { readAllPlans, readAllRoutines, updateOnePlan } from './plansApi';
import { RootStore } from '../../models/RootStore';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import {
  createOrUpdateOneDailyRecord,
  readManyDailyRecords,
  readOneDailyRecord,
} from './dailyRecordsApi';
import { readAllTasks } from './tasksApi';
import { readAllActivityCategories } from './activityCategoriesApi';

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
};

export class Api {
  apisauce: ApisauceInstance;
  config: ApiConfig;
  rootStore: RootStore;

  // Auth API
  signIn = signIn;
  signUp = signUp;
  signOut = signOut;
  requestActivation = requestActivation;
  requestPasswordReset = requestPasswordReset;
  me = me;

  // Notebooks API
  readAllNotebooks = readAllNotebooks;
  readManyEntries = readManyEntries;
  updateOneEntry = updateOneEntry;
  createOneEntry = createOneEntry;
  deleteOneEntry = deleteOneEntry;

  // Plans API
  readAllPlans = readAllPlans;
  readAllRoutines = readAllRoutines;
  updateOnePlan = updateOnePlan;

  // DailyRecords API
  readManyDailyRecords = readManyDailyRecords;
  readOneDailyRecord = readOneDailyRecord;
  createOrUpdateOneDailyRecord = createOrUpdateOneDailyRecord;

  // Tasks API
  readAllTasks = readAllTasks;

  // ActivityCategories API
  readAllActivityCategories = readAllActivityCategories;

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

        const refreshResponse: ApiResponse<TokenResponseDto> =
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
          this.rootStore.authenticationStore.clearUser();
        }
      } /* else if (
        response.problem === 'SERVER_ERROR' ||
        response.problem === 'CONNECTION_ERROR' ||
        response.problem === 'TIMEOUT_ERROR'
      ) {
        Toast.show(
          'El servidor no se encuentra disponible en estos momentos. Por favor, inténtalo de nuevo más tarde.',
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
          'Error desconocido. Por favor, inténtalo de nuevo más tarde.',
          {
            backgroundColor: colors.errorBackground,
            textColor: colors.error,
            duration: Toast.durations.LONG,
          },
        );
      } */
    });
  }

  setRootStore(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
}

export const handleResponse = async <T, K>(
  response: ApiResponse<T>,
  callback: (response: ApiResponse<T>) => K,
): Promise<K | GeneralApiProblem> => {
  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      return await callback(response);
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
};

export const api = new Api();
