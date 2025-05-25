export const uploadImageToCloudinary = async (file, index) => {
  try {
    if (!file || !file.path) {
      console.warn(`No valid path for file ID ${file.id}`);
      return null;
    }

    // Nếu file là GIF, không upload lên Cloudinary, trả về path làm gifUrl
    if (file.type === 'gif') {
      console.log(`Skipping Cloudinary upload for GIF ID ${file.id}:`, file.path);
      return { id: file.id, gifUrl: file.path };
    }

    const path = file.path;
    const isVideo = file.type === 'video';

    let type = isVideo ? 'video/mp4' : 'image/jpeg';
    if (path.endsWith('.png')) {
      type = 'image/png';
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      type = 'image/jpeg';
    } else if (path.endsWith('.mov')) {
      type = 'video/quicktime';
    }

    console.log(`Uploading ${isVideo ? 'video' : 'image'} ID ${file.id}:`, path);

    const formData = new FormData();
    formData.append('file', {
      uri: path,
      type,
      name: `upload.${type.split('/')[1]}`,
    });
    formData.append('upload_preset', 'Threads-app');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dtwggemew/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Cloudinary upload failed for ID ${file.id}:`, errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    if (!data.secure_url) {
      console.error(`No secure_url returned for ID ${file.id}:`, data);
      return null;
    }

    console.log(`Upload successful for ID ${file.id}:`, data.secure_url);
    if (isVideo) {
      return { id: file.id, videoUrl: data.secure_url };
    }
    return { id: file.id, imageUrl: data.secure_url };
  } catch (error) {
    console.error(`Upload image error for ID ${file.id}:`, error.message);
    return null;
  }
};