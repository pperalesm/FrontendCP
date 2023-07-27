import {
  Instance,
  SnapshotOut,
  applySnapshot,
  flow,
  getSnapshot,
  types,
} from 'mobx-state-tree';
import { api } from '../services/api/api';
import { Plan, PlanModel } from './Plan';

export const PlansStoreModel = types
  .model('PlansStore')
  .props({
    plans: types.array(PlanModel),
    selectedPlan: types.maybe(types.reference(PlanModel)),
  })
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      reset: () => {
        applySnapshot(self, initialState);
      },
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
      updateOnePlan: flow(function* (
        planId: number,
        updateData: { assigned?: boolean },
      ) {
        const response = yield api.updateOnePlan(planId, updateData);
        if (response.kind === 'ok') {
          self.plans.splice(
            self.plans.findIndex((item) => item.id === planId),
            1,
            response.plan,
          );
        }
        return response;
      }),
    };
  });

export interface PlansStore extends Instance<typeof PlansStoreModel> {}
export interface PlansStoreSnapshot
  extends SnapshotOut<typeof PlansStoreModel> {}
