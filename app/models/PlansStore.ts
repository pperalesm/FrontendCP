import { Instance, SnapshotOut, flow, types } from 'mobx-state-tree';
import { api } from '../services/api/api';
import { Plan, PlanModel } from './Plan';

export const PlansStoreModel = types
  .model('PlansStore')
  .props({
    plans: types.array(PlanModel),
    selectedPlan: types.maybe(types.reference(PlanModel)),
  })
  .actions((self) => ({
    select(plan: Plan) {
      self.selectedPlan = plan;
    },
    readAllPlans: flow(function* () {
      const response = yield api.readAllPlans();
      if (response.kind === 'ok') {
        self.plans = response.plans;
      }
      return response;
    }),
  }));

export interface PlanStore extends Instance<typeof PlansStoreModel> {}
export interface PlanStoreSnapshot
  extends SnapshotOut<typeof PlansStoreModel> {}
