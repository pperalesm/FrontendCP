import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import { NotebookSnapshotIn } from '../../models/Notebook';
import { EntrySnapshotIn } from '../../models/Entry';
import { PageDto, PrivateEntryDto, PublicNotebookDto } from './api.types';

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

export async function readManyEntriesPaginated(
  this: Api,
  notebookId: number,
  page: number,
  take: number,
): Promise<
  | {
      kind: 'ok';
      entries: EntrySnapshotIn[];
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PageDto<PrivateEntryDto>> =
    await this.apisauce.get(
      `notebooks/${notebookId}/entries/paginated?page=${page}&take=${take}`,
    );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const entries: EntrySnapshotIn[] = response.data.data.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));

      return { kind: 'ok', entries };
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
