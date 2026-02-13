// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'dceckgsol',
  uploadPreset: 'chats-unsigned',
};

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string; publicId: string; format: string; size: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload file');
  }

  const data = await response.json();
  
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    size: data.bytes,
  };
};

export const getOptimizedImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}): string => {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // Parse the Cloudinary URL
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;

  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  return `${urlParts[0]}/upload/${transformations.join(',')}/${urlParts[1]}`;
};
