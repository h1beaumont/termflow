// File Storage Service for Contract Templates
import { ObjectStorageService, objectStorageClient, parseObjectPath } from "./objectStorage";
import { randomUUID } from "crypto";
import type { Express } from "express";

const objectStorageService = new ObjectStorageService();

/**
 * Upload a PDF file to object storage
 * @param file The uploaded file from multer
 * @returns The public URL of the uploaded file
 */
export async function uploadToObjectStorage(file: Express.Multer.File): Promise<string> {
  try {
    // Validate file type
    if (file.mimetype !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueId = randomUUID();
    const filename = `contract-templates/${timestamp}-${uniqueId}-${file.originalname}`;
    
    // Get the private directory for contract templates
    const privateDir = objectStorageService.getPrivateObjectDir();
    const fullPath = `${privateDir}/${filename}`;
    
    // Parse the path to get bucket and object names
    const { bucketName, objectName } = parseObjectPath(fullPath);
    
    // Get the bucket and file reference
    const bucket = objectStorageClient.bucket(bucketName);
    const fileRef = bucket.file(objectName);
    
    // Upload the file
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // Set ACL to private (contract templates should not be public)
    await fileRef.makePrivate();
    
    // Return the internal path that will be stored in the database
    // This path can be used to retrieve the file later
    return fullPath;
  } catch (error) {
    console.error("Error uploading file to object storage:", error);
    throw new Error("Failed to upload file to object storage");
  }
}

/**
 * Load a PDF file from object storage
 * @param fileUrl The URL/path of the file in object storage
 * @returns Buffer containing the PDF data
 */
export async function loadPDFFromStorage(fileUrl: string): Promise<Buffer> {
  try {
    // Parse the path to get bucket and object names
    const { bucketName, objectName } = parseObjectPath(fileUrl);
    
    // Get the bucket and file reference
    const bucket = objectStorageClient.bucket(bucketName);
    const fileRef = bucket.file(objectName);
    
    // Check if file exists
    const [exists] = await fileRef.exists();
    if (!exists) {
      throw new Error("PDF template file not found in storage");
    }
    
    // Download the file
    const [buffer] = await fileRef.download();
    return buffer;
  } catch (error) {
    console.error("Error loading PDF from storage:", error);
    throw new Error("Failed to load PDF from storage");
  }
}

/**
 * Delete a PDF file from object storage
 * @param fileUrl The URL/path of the file to delete
 */
export async function deletePDFFromStorage(fileUrl: string): Promise<void> {
  try {
    // Parse the path to get bucket and object names
    const { bucketName, objectName } = parseObjectPath(fileUrl);
    
    // Get the bucket and file reference
    const bucket = objectStorageClient.bucket(bucketName);
    const fileRef = bucket.file(objectName);
    
    // Delete the file
    await fileRef.delete();
  } catch (error) {
    console.error("Error deleting PDF from storage:", error);
    // Don't throw error for deletion failures
    // The file might already be deleted or not exist
  }
}

/**
 * Get a signed URL for temporary access to a private PDF
 * @param fileUrl The URL/path of the file
 * @param expiresInMinutes How long the URL should be valid (default: 60 minutes)
 * @returns A signed URL that provides temporary access to the file
 */
export async function getSignedPDFUrl(fileUrl: string, expiresInMinutes: number = 60): Promise<string> {
  try {
    // Parse the path to get bucket and object names
    const { bucketName, objectName } = parseObjectPath(fileUrl);
    
    // Get the bucket and file reference
    const bucket = objectStorageClient.bucket(bucketName);
    const fileRef = bucket.file(objectName);
    
    // Generate a signed URL that expires in the specified time
    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });
    
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL for PDF");
  }
}