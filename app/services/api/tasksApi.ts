import { ApiResponse } from 'apisauce';
import { Api, handleResponse } from './api';
import { TaskSnapshotIn } from '../../models/Task';
import { PublicTaskDto } from './api.types';

export async function readAllTasks(this: Api) {
  const response: ApiResponse<PublicTaskDto[]> = await this.apisauce.get(
    `tasks`,
  );

  return await handleResponse(response, (res) => {
    const tasks: TaskSnapshotIn[] = res.data.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));

    return { kind: 'ok', tasks };
  });
}
