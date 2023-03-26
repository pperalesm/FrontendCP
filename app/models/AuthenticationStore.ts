import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { UserModel } from "./User"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    accessToken: types.maybe(types.string),
    refreshToken: types.maybe(types.string),
    user: types.maybe(UserModel),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.accessToken
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    async signIn(email: string, password: string) {
      const response = await api.signIn(email, password)
      if (response.kind === "ok") {
        store.setProp("accessToken", response.accessToken)
        store.setProp("refreshToken", response.refreshToken)
        store.setProp("user", response.user)
      }
    },
    logout() {
      store.accessToken = undefined
      store.refreshToken = undefined
      store.user = undefined
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
