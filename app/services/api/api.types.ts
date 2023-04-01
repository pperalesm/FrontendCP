/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link: string;
    type: string;
    length: number;
    duration: number;
    rating: { scheme: string; value: string };
  };
  categories: string[];
}

export interface ApiFeedResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: EpisodeItem[];
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
}

export interface PrivateEntryDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  isFavorite: boolean;
}
