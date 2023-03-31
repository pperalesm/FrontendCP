import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import { NotebookSnapshotIn } from '../../models/Notebook';

export interface PublicNotebookDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export async function readAllNotebooks(this: Api): Promise<
  | {
      kind: 'ok';
      notebooks: NotebookSnapshotIn[];
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PublicNotebookDto[]> = await this.apisauce.get(
    `notebooks`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const notebooks: NotebookSnapshotIn[] = response.data.map((notebook) => ({
        ...notebook,
        createdAt: new Date(notebook.createdAt),
        updatedAt: new Date(notebook.updatedAt),
      }));
      return { kind: 'ok', notebooks };
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
