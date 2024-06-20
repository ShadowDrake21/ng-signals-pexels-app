import {
  Collection,
  ErrorResponse,
  Photo,
  PhotosWithTotalResults,
  Video,
} from 'pexels';

export type CollectionsWithTotalResults = {
  page: number;
  per_page: number;
  collections: Collection[];
};

export type CollectionMediaWidthTotalResults = {
  page: number;
  per_page: number;
  total_results: number;
  media: (
    | (Photo & {
        type: 'Video' | 'Photo';
      })
    | (Video & {
        type: 'Video' | 'Photo';
      })
  )[];
};
