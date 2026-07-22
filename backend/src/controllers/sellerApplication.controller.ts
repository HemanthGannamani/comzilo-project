import { Request, Response, NextFunction } from 'express';
import { SellerApplication, User } from '../database/models';
import { created, success } from '../shared/responses';
import { ValidationError, ConflictError, NotFoundError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { NotificationService } from '../services/notification.service';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export class SellerApplicationController {
  private saveBase64File(base64Data: string, prefixName: string): string {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new ValidationError('Invalid file format. Upload must be a valid file string.');
    }

    const fileType = matches[1];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      throw new ValidationError('Allowed formats: PDF, JPG, JPEG, PNG');
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      throw new ValidationError('Maximum upload size: 5 MB');
    }

    const extension = fileType === 'application/pdf' ? 'pdf' : fileType.split('/')[1];
    const fileName = `${prefixName}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'seller-applications');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    return `/uploads/seller-applications/${fileName}`;
  }

  public createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        businessName,
        ownerName,
        email,
        phone,
        businessType,
        gstNumber,
        panNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        postalCode,
        preferredStoreName,
        password,
        logo,
        license,
        gstCertificate,
        identityProof,
      } = req.body;

      // Duplicate validations
      const existingUser = await User.findOne({ where: { email } });
      const existingApp = await SellerApplication.findOne({ where: { email } });
      if (existingUser || existingApp) {
        throw new ConflictError('A seller account or application with this email already exists.');
      }

      if (gstNumber) {
        const duplicateGst = await SellerApplication.findOne({ where: { gstNumber } });
        if (duplicateGst) {
          throw new ConflictError('An application with this GST number already exists.');
        }
      }

      // Hash password using bcrypt
      const passwordHash = await bcrypt.hash(password, 10);

      // Process file uploads
      let logoPath = null;
      let licensePath = null;
      let gstCertificatePath = null;
      let identityProofPath = null;

      if (logo) {
        logoPath = this.saveBase64File(logo, 'logo');
      }
      if (license) {
        licensePath = this.saveBase64File(license, 'license');
      }
      if (gstCertificate) {
        gstCertificatePath = this.saveBase64File(gstCertificate, 'gst_cert');
      }
      if (identityProof) {
        identityProofPath = this.saveBase64File(identityProof, 'id_proof');
      }

      // Generate application number
      const count = await SellerApplication.count();
      const applicationNumber = `APP-2026-${String(count + 1).padStart(6, '0')}`;

      // Create record in Database
      const application = await SellerApplication.create({
        applicationNumber,
        businessName,
        ownerName,
        email,
        phone,
        businessType,
        gstNumber: gstNumber || null,
        panNumber: panNumber || null,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        country,
        postalCode,
        preferredStoreName,
        passwordHash,
        logoPath,
        licensePath,
        gstCertificatePath,
        identityProofPath,
        status: 'Pending',
      });

      // Write Audit Logs
      await createAuditLog(
        {
          action: 'seller_application.submitted',
          entityType: 'seller_application',
          entityId: String(application.id),
          newValues: { applicationNumber, email, businessName },
        },
        req.context
      );

      if (licensePath || identityProofPath) {
        await createAuditLog(
          {
            action: 'seller_application.file_uploaded',
            entityType: 'seller_application',
            entityId: String(application.id),
          },
          req.context
        );
      }

      // Send Email Notification
      const notificationService = new NotificationService();
      await notificationService.sendNotification(1, null, {
        recipient: email,
        channel: 'email',
        title: 'Seller Application Submitted',
        content: `Dear ${ownerName}, your application for ${businessName} has been submitted successfully and is under review.`,
      });

      created(res, 'Seller Application Submitted Successfully', {
        applicationNumber: application.applicationNumber,
        status: application.status,
      });
    } catch (error) {
      next(error);
    }
  };

  public getApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { applicationNumber } = req.params;
      const application = await SellerApplication.findOne({ where: { applicationNumber } });

      if (!application) {
        throw new NotFoundError('Application not found');
      }

      success(res, 'Application status retrieved successfully', {
        applicationNumber: application.applicationNumber,
        status: application.status,
        submittedAt: application.submittedAt,
      });
    } catch (error) {
      next(error);
    }
  };
}
