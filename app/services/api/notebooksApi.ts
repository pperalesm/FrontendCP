import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem';
import { NotebookSnapshotIn } from '../../models/Notebook';
import { Entry, EntrySnapshotIn } from '../../models/Entry';
import { PrivateEntryDto, PublicNotebookDto } from './api.types';

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

export async function readManyEntries(
  this: Api,
  notebookId: number,
  from?: Date,
  take?: number,
): Promise<
  | {
      kind: 'ok';
      entries: EntrySnapshotIn[];
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PrivateEntryDto[]> = await this.apisauce.get(
    `notebooks/${notebookId}/entries?${from ? `from=${from}&` : ''}${
      take ? `take=${take}` : ''
    }`,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const entries: EntrySnapshotIn[] = response.data.map((entry) => ({
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

export async function updateOneEntry(
  this: Api,
  notebookId: number,
  entryId: number,
  entry: Partial<Entry>,
): Promise<
  | {
      kind: 'ok';
      entry: EntrySnapshotIn;
    }
  | GeneralApiProblem
> {
  const response: ApiResponse<PrivateEntryDto> = await this.apisauce.patch(
    `notebooks/${notebookId}/entries/${entryId}`,
    entry,
  );

  let problem: GeneralApiProblem;

  if (response.ok) {
    try {
      const entry: EntrySnapshotIn = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };

      return { kind: 'ok', entry };
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
