export class GoogleDriveService {
  extractFileId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      
      if (!urlObj.hostname.includes('google.com') && !urlObj.hostname.includes('drive.google.com')) {
        return null;
      }

      if (urlObj.pathname.includes('/file/d/')) {
        const match = urlObj.pathname.match(/\/file\/d\/([^/]+)/);
        return match ? match[1] : null;
      }

      if (urlObj.pathname.includes('/open')) {
        const fileId = urlObj.searchParams.get('id');
        return fileId;
      }

      const match = urlObj.pathname.match(/\/d\/([^/]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting Google Drive file ID:', error);
      return null;
    }
  }

  convertToEmbedUrl(url: string): string | null {
    const fileId = this.extractFileId(url);
    
    if (!fileId) {
      return null;
    }

    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  validateDriveUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('google.com') || urlObj.hostname.includes('drive.google.com');
    } catch {
      return false;
    }
  }

  isGoogleDriveUrl(url: string): boolean {
    return this.validateDriveUrl(url);
  }

  isAlreadyEmbedUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.includes('/preview') || urlObj.pathname.includes('/embed');
    } catch {
      return false;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
