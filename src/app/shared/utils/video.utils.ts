// angular stuff
import { Video } from 'pexels';

export const getAppropriateVideo = (video: Video) => {
  const foundVideo = video.video_files.find((file) => file.quality === 'sd');

  if (!foundVideo) {
    return (
      video.video_files.find((file) => file.quality === 'hls') ||
      video.video_files.find((file) => file.quality === 'hd')
    );
  }

  return foundVideo;
};
