export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  user: PrivateUserDto;
}

export interface PrivateUserDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  role: string;
  active: boolean;
}

export interface PublicNotebookDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface PrivateEntryDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  isFavorite: boolean;
}

export interface PrivatePlanDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  imageUrl: string;
  numDays: number;
  currentDay?: number;
}

export interface PublicRoutineDto {
  day: number;
  tasks: PublicTaskDto[];
}

export interface PublicTaskDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  notebookId: number | null;
}

export interface PublicActivityCategoryDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  imageUrl: string;
}

export interface PrivateDailyRecordDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  day: string;
  mood?: number | null;
  note?: string | null;
  activityCategoryIds?: number[];
  taskIds?: number[];
}

export interface PageMetaDto {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PageDto<T> {
  data: T[];
  meta: PageMetaDto;
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string;

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
}
