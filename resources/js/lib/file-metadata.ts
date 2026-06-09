interface FileMetadata {
    duration?: string;
    thumbnail?: string;
    dimensions?: { width: number; height: number };
    size: string;
    name: string;
    type: string;
}

const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const createVideoThumbnail = (video: HTMLVideoElement): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.currentTime = 1; // Get frame at 1 second

        video.onseeked = () => {
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg'));
        };
    });
};

export const getFileMetadata = (file: File): Promise<FileMetadata> => {
    return new Promise((resolve, reject) => {
        try {
            const fileType = file.type.split('/')[0];
            const size = formatFileSize(file.size);

            // Handle video files
            if (fileType === 'video') {
                const video = document.createElement('video');
                const videoUrl = URL.createObjectURL(file);
                video.preload = 'metadata';

                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(videoUrl);
                    const duration = formatDuration(video.duration);
                    createVideoThumbnail(video).then((thumbnailUrl) => {
                        resolve({
                            duration,
                            dimensions: {
                                width: video.videoWidth,
                                height: video.videoHeight,
                            },
                            size,
                            thumbnail: thumbnailUrl,
                            name: file.name,
                            type: file.type,
                        });
                    });
                };

                video.onerror = () => {
                    URL.revokeObjectURL(videoUrl);
                    reject(new Error('Error loading video metadata'));
                };

                video.src = videoUrl;
            }
            // Handle image files
            else if (fileType === 'image') {
                const img = new Image();
                const imageUrl = URL.createObjectURL(file);

                img.onload = () => {
                    URL.revokeObjectURL(imageUrl);
                    resolve({
                        dimensions: {
                            width: img.width,
                            height: img.height,
                        },
                        size,
                        thumbnail: imageUrl,
                        name: file.name,
                        type: file.type,
                    });
                };

                img.onerror = () => {
                    URL.revokeObjectURL(imageUrl);
                    reject(new Error('Error loading image metadata'));
                };

                img.src = imageUrl;
            }
            // Handle other file types
            else {
                resolve({
                    size,
                    name: file.name,
                    type: file.type,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
