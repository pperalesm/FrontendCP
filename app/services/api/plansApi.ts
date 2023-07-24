import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import { PlanSnapshotIn } from '../../models/Plan';
import { Routine, RoutineSnapshotIn } from '../../models/Routine';
import { PrivateRoutineDto, PublicPlanDto } from './api.types';

export async function readAllPlans(this: Api): Promise<
  | {
      kind: 'ok';
      plans: PlanSnapshotIn[];
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PublicPlanDto[]> = await this.apisauce.get(
    `plans`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const plans: PlanSnapshotIn[] = response.data.map((plan) => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
      }));

      return { kind: 'ok', plans };
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
}

export async function readManyRoutines(
  this: Api,
  planId: number,
  from?: Date,
  take?: number,
  isFavorite?: boolean,
): Promise<
  | {
      kind: 'ok';
      routines: RoutineSnapshotIn[];
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PrivateRoutineDto[]> = await this.apisauce.get(
    `plans/${planId}/routines?${from ? `from=${from.toISOString()}&` : ''}${
      take ? `take=${take}&` : ''
    }${isFavorite ? `isFavorite=true` : ''}`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const routines: RoutineSnapshotIn[] = response.data.map((routine) => ({
        ...routine,
        createdAt: new Date(routine.createdAt),
        updatedAt: new Date(routine.updatedAt),
      }));

      return { kind: 'ok', routines };
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
}

export async function updateOneRoutine(
  this: Api,
  planId: number,
  routineId: number,
  routine: Partial<Routine>,
): Promise<
  | {
      kind: 'ok';
      routine: RoutineSnapshotIn;
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PrivateRoutineDto> = await this.apisauce.patch(
    `plans/${planId}/routines/${routineId}`,
    routine,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const routine: RoutineSnapshotIn = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };

      return { kind: 'ok', routine };
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
}

export async function createOneRoutine(
  this: Api,
  planId: number,
  routine: Partial<Routine>,
): Promise<
  | {
      kind: 'ok';
      routine: RoutineSnapshotIn;
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PrivateRoutineDto> = await this.apisauce.post(
    `plans/${planId}/routines`,
    routine,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const routine: RoutineSnapshotIn = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };

      return { kind: 'ok', routine };
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
}

export async function deleteOneRoutine(
  this: Api,
  planId: number,
  routineId: number,
): Promise<
  | {
      kind: 'ok';
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<null> = await this.apisauce.delete(
    `plans/${planId}/routines/${routineId}`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    return { kind: 'ok' };
  } else {
    problem = getGeneralApiProblem(response);
  }

  return problem;
}
