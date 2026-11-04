import { objectStorageClient } from "./objectStorage";
import { randomUUID } from "crypto";
import { googleDriveService } from "./googleDriveService";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export class ImageImportService {
  private getPublicObjectDir(): string {
    const paths = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const pathArray = paths.split(",").map(p => p.trim()).filter(p => p.length > 0);
    if (pathArray.length === 0) {
      throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not configured");
    }
    return pathArray[0];
  }

  private parseObjectPath(path: string): { bucketName: string; objectName: string } {
    if (!path.startsWith("/")) {
      path = `/${path}`;
    }
    const pathParts = path.split("/");
    if (pathParts.length < 3) {
      throw new Error("Invalid path: must contain at least a bucket name");
    }
    const bucketName = pathParts[1];
    const objectName = pathParts.slice(2).join("/");
    return { bucketName, objectName };
  }

  async validateGoogleDriveAccess(url: string): Promise<void> {
    const fileId = googleDriveService.extractFileId(url);
    
    if (!fileId) {
      throw new Error('Invalid Google Drive URL: Could not extract file ID');
    }

    try {
      const checkUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const response = await fetch(checkUrl, {
        method: 'HEAD',
        redirect: 'manual',
      });

      if (response.status === 302 || response.status === 301) {
        const location = response.headers.get('Location');
        if (location?.includes('accounts.google.com') || location?.includes('login')) {
          throw new Error('Google Drive video requires authentication. Please set sharing to "Anyone with the link can view"');
        }
      }

      if (response.status === 403) {
        throw new Error('Google Drive video is private or restricted. Please set sharing to "Anyone with the link can view"');
      }

      if (response.status !== 200 && response.status !== 302) {
        throw new Error(`Unable to access Google Drive video (status ${response.status})`);
      }

      console.log(`✅ Google Drive video is publicly accessible: ${url}`);
    } catch (error: any) {
      if (error.message.includes('Google Drive')) {
        throw error;
      }
      throw new Error(`Failed to validate Google Drive access: ${error.message}`);
    }
  }

  async downloadAndUploadImage(sourceUrl: string, objectPath: string): Promise<string> {
    try {
      const response = await fetch(sourceUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const contentLength = parseInt(response.headers.get('content-length') || '0');

      if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
        throw new Error(`Invalid image type: ${contentType}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
      }

      if (contentLength > MAX_IMAGE_SIZE) {
        throw new Error(`Image too large: ${contentLength} bytes. Max size: ${MAX_IMAGE_SIZE} bytes`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      const publicDir = this.getPublicObjectDir();
      const fullPath = `${publicDir}/${objectPath}`;
      const { bucketName, objectName } = this.parseObjectPath(fullPath);

      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      await file.save(buffer, {
        metadata: {
          contentType,
        },
        public: true,
      });

      return `https://storage.googleapis.com/${bucketName}/${objectName}`;
    } catch (error: any) {
      console.error(`Error downloading/uploading image from ${sourceUrl}:`, error);
      throw new Error(`Failed to import image: ${error.message}`);
    }
  }

  async downloadAndUploadVideo(sourceUrl: string, objectPath: string): Promise<string> {
    if (googleDriveService.isGoogleDriveUrl(sourceUrl)) {
      console.log(`Detected Google Drive video URL: ${sourceUrl}`);
      
      await this.validateGoogleDriveAccess(sourceUrl);
      
      if (googleDriveService.isAlreadyEmbedUrl(sourceUrl)) {
        console.log(`URL is already in embed format: ${sourceUrl}`);
        return sourceUrl;
      }
      
      const embedUrl = googleDriveService.convertToEmbedUrl(sourceUrl);
      if (embedUrl) {
        console.log(`Converted Google Drive URL to embed format: ${embedUrl}`);
        return embedUrl;
      }
      
      console.warn(`Failed to convert Google Drive URL, using original: ${sourceUrl}`);
      return sourceUrl;
    }

    try {
      const response = await fetch(sourceUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (!ALLOWED_VIDEO_TYPES.includes(contentType)) {
        console.warn(`Video URL may not be a direct video file: ${contentType}`);
        return sourceUrl;
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      const publicDir = this.getPublicObjectDir();
      const fullPath = `${publicDir}/${objectPath}`;
      const { bucketName, objectName } = this.parseObjectPath(fullPath);

      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      await file.save(buffer, {
        metadata: {
          contentType,
        },
        public: true,
      });

      return `https://storage.googleapis.com/${bucketName}/${objectName}`;
    } catch (error: any) {
      console.error(`Error downloading/uploading video from ${sourceUrl}:`, error);
      return sourceUrl;
    }
  }

  getFileExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const parts = pathname.split('.');
      if (parts.length > 1) {
        return parts[parts.length - 1].toLowerCase();
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
    }
    return 'jpg';
  }

  generateObjectPath(type: 'property' | 'room', id: string, filename: string): string {
    const timestamp = Date.now();
    const uniqueId = randomUUID().substring(0, 8);
    return `${type}/${id}/${timestamp}-${uniqueId}-${filename}`;
  }
}

export const imageImportService = new ImageImportService();
