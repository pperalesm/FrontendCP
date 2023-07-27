import { ApiResponse } from 'apisauce';
import { Api, handleResponse } from './api';
import { NotebookSnapshotIn } from '../../models/Notebook';
import { Entry, EntrySnapshotIn } from '../../models/Entry';
import { PrivateEntryDto, PublicNotebookDto } from './api.types';

export async function readAllNotebooks(this: Api) {
  const response: ApiResponse<PublicNotebookDto[]> = await this.apisauce.get(
    `notebooks`,
  );

  return await handleResponse(response, (res) => {
    const notebooks: NotebookSnapshotIn[] = res.data.map((notebook) => ({
      ...notebook,
      createdAt: new Date(notebook.createdAt),
      updatedAt: new Date(notebook.updatedAt),
    }));

    return { kind: 'ok', notebooks };
  });
}

export async function readManyEntries(
  this: Api,
  notebookId: number,
  from?: Date,
  take?: number,
  isFavorite?: boolean,
) {
  const response: ApiResponse<PrivateEntryDto[]> = await this.apisauce.get(
    `notebooks/${notebookId}/entries?${
      from ? `from=${from.toISOString()}&` : ''
    }${take ? `take=${take}&` : ''}${isFavorite ? `isFavorite=true` : ''}`,
  );

  return await handleResponse(response, (res) => {
    const entries: EntrySnapshotIn[] = res.data.map((entry) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));

    return { kind: 'ok', entries };
  });
}

export async function updateOneEntry(
  this: Api,
  notebookId: number,
  entryId: number,
  updateData: { isFavorite?: boolean; text?: string },
) {
  const response: ApiResponse<PrivateEntryDto> = await this.apisauce.patch(
    `notebooks/${notebookId}/entries/${entryId}`,
    updateData,
  );

  return await handleResponse(response, (res) => {
    const entry: EntrySnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };

    return { kind: 'ok', entry };
  });
}

export async function createOneEntry(
  this: Api,
  notebookId: number,
  entry: Entry,
) {
  const response: ApiResponse<PrivateEntryDto> = await this.apisauce.post(
    `notebooks/${notebookId}/entries`,
    entry,
  );

  return await handleResponse(response, (res) => {
    const entry: EntrySnapshotIn = {
      ...res.data,
      createdAt: new Date(res.data.createdAt),
      updatedAt: new Date(res.data.updatedAt),
    };

    return { kind: 'ok', entry };
  });
}

export async function deleteOneEntry(
  this: Api,
  notebookId: number,
  entryId: number,
) {
  const response: ApiResponse<null> = await this.apisauce.delete(
    `notebooks/${notebookId}/entries/${entryId}`,
  );

  return await handleResponse(response, () => {
    return { kind: 'ok' };
  });
}
