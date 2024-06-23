import {
  Collection,
  ErrorResponse,
  Photo,
  PhotosWithTotalResults,
  Video,
} from 'pexels';

export type CollectionsWithTotalResults = {
  collections: Collection[];
  page: number;
  per_page: number;
  total_results: number;
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
