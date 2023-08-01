import { ApiResponse } from 'apisauce';
import { Api, handleResponse } from './api';
import { PlanSnapshotIn } from '../../models/Plan';
import { RoutineSnapshotIn } from '../../models/Routine';
import { PublicRoutineDto, PrivatePlanDto } from './api.types';

export async function readAllPlans(this: Api) {
  const response: ApiResponse<PrivatePlanDto[]> = await this.apisauce.get(
    `plans`,
  );

  return await handleResponse(response, (res) => {
    const plans: PlanSnapshotIn[] = res.data.map((plan) => ({
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt),
    }));

    return { kind: 'ok', plans };
  });
}

export async function updateOnePlan(
  this: Api,
  planId: number,
  updateData: { isActive?: boolean },
) {
  const response: ApiResponse<PrivatePlanDto> = await this.apisauce.patch(
    `plans/${planId}`,
    updateData,
  );

  return await handleResponse(response, (res) => {
    const plan: PlanSnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };

    return { kind: 'ok', plan };
  });
}

export async function readAllRoutines(this: Api, planId: number) {
  const response: ApiResponse<PublicRoutineDto[]> = await this.apisauce.get(
    `plans/${planId}/routines`,
  );

  return await handleResponse(response, (res) => {
    const routines: RoutineSnapshotIn[] = res.data.map((routine) => ({
      day: routine.day,
      tasks: routine.tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        notebook: task.notebookId,
      })),
    }));

    return { kind: 'ok', routines };
  });
}
