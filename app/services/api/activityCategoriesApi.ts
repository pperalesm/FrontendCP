import { ApiResponse } from 'apisauce';
import { Api, handleResponse } from './api';
import { ActivityCategorySnapshotIn } from '../../models/ActivityCategory';
import { PublicActivityCategoryDto } from './api.types';

export async function readAllActivityCategories(this: Api) {
  const response: ApiResponse<PublicActivityCategoryDto[]> =
    await this.apisauce.get(`activity-categories`);

  return await handleResponse(response, (res) => {
    const activityCategories: ActivityCategorySnapshotIn[] = res.data.map(
      (activityCategory) => ({
        ...activityCategory,
        createdAt: new Date(activityCategory.createdAt),
        updatedAt: new Date(activityCategory.updatedAt),
      }),
    );

    return { kind: 'ok', activityCategories };
  });
}
