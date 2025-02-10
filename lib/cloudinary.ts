export const getCloudinaryUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) => {
  if (!publicId || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return '';

  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'webp'
  } = options;

  const transformations = [
    'c_fill',
    'g_center',
    `w_${width}`,
    height && `h_${height}`,
    quality !== 'auto' && `q_${quality}`,
    `f_${format}`
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};