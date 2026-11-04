// Application Service for tenant applications and document uploads
import { storage } from "./storage";
import type { InsertTenantApplication, InsertApplicationDocument } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

export class ApplicationService {
  private objectStorageService: ObjectStorageService;

  constructor() {
    this.objectStorageService = new ObjectStorageService();
  }

  /**
   * Submit a tenant application
   * Creates or updates application and progresses lead stage
   */
  async submitApplication(
    leadId: string,
    applicationData: Partial<InsertTenantApplication>
  ) {
    // Check if application already exists for this lead
    const existingApplication = await storage.getApplicationByLead(leadId);

    let application;
    
    if (existingApplication) {
      // Update existing application
      application = await storage.updateApplication(existingApplication.id, {
        ...applicationData,
        status: "submitted",
        submittedAt: new Date(),
      });
    } else {
      // Create new application
      application = await storage.createApplication({
        ...applicationData,
        leadId,
        status: "submitted",
        submittedAt: new Date(),
      } as InsertTenantApplication);
    }

    // Update lead stage to 'application_started'
    await storage.updateLeadStage(leadId, "application_started");

    return application;
  }

  /**
   * Upload a document to object storage
   * Returns the public URL of the uploaded document
   */
  async uploadApplicationDocument(
    applicationId: string,
    file: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
    documentType: string
  ) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `application-${applicationId}-${documentType}-${timestamp}-${file.originalname}`;
      const objectPath = `.private/${filename}`;

      // Upload to object storage
      await this.objectStorageService.uploadObject(objectPath, file.buffer);

      // Get the URL
      const fileUrl = await this.objectStorageService.getObjectURL(objectPath);

      // Create document record
      const document = await storage.createApplicationDocument({
        applicationId,
        documentType,
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      });

      return document;
    } catch (error) {
      console.error("Error uploading application document:", error);
      throw new Error("Failed to upload document");
    }
  }

  /**
   * Get application with all documents
   */
  async getApplicationWithDocuments(applicationId: string) {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      return null;
    }

    const documents = await storage.getApplicationDocuments(applicationId);

    return {
      ...application,
      documents,
    };
  }

  /**
   * Get application by lead ID with documents
   */
  async getApplicationByLeadWithDocuments(leadId: string) {
    const application = await storage.getApplicationByLead(leadId);
    if (!application) {
      return null;
    }

    const documents = await storage.getApplicationDocuments(application.id);

    return {
      ...application,
      documents,
    };
  }
}

export const applicationService = new ApplicationService();
