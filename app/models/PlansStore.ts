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
import { copyDefinedValues } from '../utils/copyDefinedvalues';

export const PlansStoreModel = types
  .model('PlansStore')
  .props({
    plans: types.array(PlanModel),
    selectedPlan: types.maybe(types.reference(PlanModel)),
    arePlansLoading: types.optional(types.boolean, false),
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
      handlePressCard(plan: Plan) {
        self.selectedPlan = plan;
      },
    };
  })
  .actions((self) => ({
    reloadPlans: flow(function* () {
      self.arePlansLoading = true;
      self.selectedPlan = undefined;
      const response = yield api.readAllPlans();
      if (response.kind === 'ok') {
        self.plans = response.plans;
      }
      self.arePlansLoading = false;
      return response;
    }),
    handlePressStartOrEnd: flow(function* (plan: Plan) {
      plan.isStartOrEndLoading = true;
      const response = yield api.updateOnePlan(plan.id, {
        isActive: !plan.isActive,
      });
      if (response.kind === 'ok') {
        copyDefinedValues(plan, response.plan);
      }
      plan.isStartOrEndLoading = false;
      return response;
    }),
  }));

export interface PlansStore extends Instance<typeof PlansStoreModel> {}
export interface PlansStoreSnapshot
  extends SnapshotOut<typeof PlansStoreModel> {}
