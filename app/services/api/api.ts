import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse, ApiTokenResponse } from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import { UserSnapshotIn } from "../../models/User"
import * as SecureStore from "expo-secure-store"
import { RootStore } from "../../models"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig
  rootStore: RootStore

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    this.apisauce.addAsyncResponseTransform(async (response) => {
      if (response.status === 401) {
        const refreshToken = await SecureStore.getItemAsync("refreshToken")

        const refreshResponse: ApiResponse<ApiTokenResponse> = await this.apisauce.post(
          `auth/refresh-tokens`,
          {
            refreshToken,
          },
        )

        if (refreshResponse.ok) {
          this.apisauce.setHeader("Authorization", `Bearer ${refreshResponse.data.accessToken}`)

          await SecureStore.setItemAsync("refreshToken", refreshResponse.data.refreshToken)

          response = await this.apisauce.any({
            ...response.config,
            headers: {
              ...response.config.headers,
              Authorization: `Bearer ${refreshResponse.data.accessToken}`,
            },
          })
        } else {
          this.rootStore.authenticationStore.signOut()
        }
      }
    })
  }

  setRootStore(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    let problem: GeneralApiProblem

    if (response.ok) {
      try {
        const rawData = response.data

        const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
          ...raw,
        }))

        return { kind: "ok", episodes }
      } catch (e) {
        if (__DEV__) {
          console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        problem = { kind: "bad-data" }
      }
    } else {
      const error = getGeneralApiProblem(response)
      if (error) {
        problem = error
      }
    }

    return problem
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<
    | { kind: "ok"; accessToken: string; refreshToken: string; user: UserSnapshotIn }
    | GeneralApiProblem
  > {
    const response: ApiResponse<ApiTokenResponse> = await this.apisauce.post(`auth/sign-in`, {
      email,
      password,
    })

    let problem: GeneralApiProblem

    if (response.ok) {
      try {
        const user: UserSnapshotIn = {
          ...response.data.user,
          createdAt: new Date(response.data.user.createdAt),
          updatedAt: new Date(response.data.user.updatedAt),
        }

        this.apisauce.setHeader("Authorization", `Bearer ${response.data.accessToken}`)

        await SecureStore.setItemAsync("refreshToken", response.data.refreshToken)

        return { kind: "ok", ...response.data, user }
      } catch (e) {
        if (__DEV__) {
          console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
      }
    } else {
      problem = getGeneralApiProblem(response)
    }

    return problem
  }

  async signUp(email: string, password: string): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const response: ApiResponse<null> = await this.apisauce.post(`auth/sign-up`, {
      email,
      password,
    })

    let problem: GeneralApiProblem

    if (response.ok) {
      this.apisauce.deleteHeader("Authorization")

      await SecureStore.deleteItemAsync("refreshToken")

      return { kind: "ok" }
    } else {
      problem = getGeneralApiProblem(response)
    }

    return problem
  }

  async signOut(): Promise<{ kind: "ok" } | GeneralApiProblem> {
    const response: ApiResponse<null> = await this.apisauce.delete(`auth/sign-out`)

    let problem: GeneralApiProblem

    if (response.ok) {
      return { kind: "ok" }
    } else {
      problem = getGeneralApiProblem(response)
    }

    return problem
  }
}

export const api = new Api()
