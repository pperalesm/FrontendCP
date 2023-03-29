import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { api } from '../services/api';
import { withSetPropAction } from './helpers/withSetPropAction';
import { UserModel } from './User';

export const AuthenticationStoreModel = types
  .model('AuthenticationStore')
  .props({
    user: types.maybe(UserModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async signIn(email: string, password: string) {
      const response = await api.signIn(email, password);
      if (response.kind === 'ok') {
        store.setProp('user', response.user);
      }
      return response;
    },
    async signUp(email: string, password: string) {
      return await api.signUp(email, password);
    },
    async signOut() {
      await api.signOut();
      store.setProp('user', undefined);
    },
    async requestActivation() {
      return await api.requestActivation();
    },
    async me() {
      const response = await api.me();
      if (response.kind === 'ok') {
        store.setProp('user', response.user);
      }
      return response;
    },
  }));

export interface AuthenticationStore
  extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot
  extends SnapshotOut<typeof AuthenticationStoreModel> {}
