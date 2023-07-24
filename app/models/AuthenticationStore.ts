import { Instance, SnapshotOut, flow, types } from 'mobx-state-tree';
import { api } from '../services/api/api';
import { UserModel } from './User';

export const AuthenticationStoreModel = types
  .model('AuthenticationStore')
  .props({
    user: types.maybe(UserModel),
  })
  .actions((self) => ({
    clearUser() {
      self.user = undefined;
    },
    signIn: flow(function* (email: string, password: string) {
      const response = yield api.signIn(email, password);
      if (response.kind === 'ok') {
        self.user = response.user;
      }
      return response;
    }),
    signUp: flow(function* (email: string, password: string) {
      return yield api.signUp(email, password);
    }),
    signOut: flow(function* () {
      yield api.signOut();
      self.user = undefined;
    }),
    requestActivation: flow(function* () {
      return yield api.requestActivation();
    }),
    requestPasswordReset: flow(function* (email: string, password: string) {
      return yield api.requestPasswordReset(email, password);
    }),
    me: flow(function* () {
      const response = yield api.me();
      if (response.kind === 'ok') {
        self.user = response.user;
      }
      return response;
    }),
  }));

export interface AuthenticationStore
  extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot
  extends SnapshotOut<typeof AuthenticationStoreModel> {}
