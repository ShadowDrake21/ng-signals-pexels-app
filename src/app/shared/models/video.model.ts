export interface IVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  full_res: any;
  tags: any[];
  duration: number;
  user: IAuthor;
  video_files: IVideoFile[];
  video_pictures: IVideoPicture[];
}

export interface IAuthor {
  id: number;
  name: string;
  url: string;
}

export interface IVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
}

export interface IVideoPicture {
  id: number;
  picture: string;
  nr: number;
}
