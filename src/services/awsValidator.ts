import AWS from 'aws-sdk';
import { AWSCredentials, ValidationResult } from '../types/aws';

export class AWSValidator {
  private static instance: AWSValidator;
  
  public static getInstance(): AWSValidator {
    if (!AWSValidator.instance) {
      AWSValidator.instance = new AWSValidator();
    }
    return AWSValidator.instance;
  }

  async validateCredentials(credentials: AWSCredentials): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Configure AWS SDK with the provided credentials
      const sts = new AWS.STS({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        region: credentials.region || 'us-east-1',
        maxRetries: 1,
        httpOptions: {
          timeout: 10000, // 10 second timeout
        }
      });

      const result = await sts.getCallerIdentity().promise();
      const responseTime = Date.now() - startTime;

      return {
        id: credentials.id,
        credentials,
        isValid: true,
        arn: result.Arn,
        userId: result.UserId,
        account: result.Account,
        validatedAt: new Date(),
        responseTime
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        id: credentials.id,
        credentials,
        isValid: false,
        errorMessage: this.getErrorMessage(error),
        validatedAt: new Date(),
        responseTime
      };
    }
  }

  async validateBatch(
    credentialsList: AWSCredentials[], 
    onProgress?: (results: ValidationResult[], stats: any) => void,
    concurrency: number = 5
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const chunks = this.chunkArray(credentialsList, concurrency);
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(cred => this.validateCredentials(cred));
      const chunkResults = await Promise.all(chunkPromises);
      
      results.push(...chunkResults);
      
      if (onProgress) {
        const stats = this.calculateStats(results, credentialsList.length);
        onProgress([...results], stats);
      }
    }
    
    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private calculateStats(results: ValidationResult[], total: number) {
    const valid = results.filter(r => r.isValid).length;
    const invalid = results.filter(r => !r.isValid).length;
    const completed = results.length;
    const pending = total - completed;

    return {
      total,
      valid,
      invalid,
      pending,
      completed,
      validPercentage: Math.round((valid / Math.max(total, 1)) * 100),
      invalidPercentage: Math.round((invalid / Math.max(total, 1)) * 100),
      completedPercentage: Math.round((completed / Math.max(total, 1)) * 100)
    };
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'InvalidUserID.NotFound') {
      return 'Invalid Access Key ID';
    }
    if (error.code === 'SignatureDoesNotMatch') {
      return 'Invalid Secret Access Key';
    }
    if (error.code === 'TokenRefreshRequired') {
      return 'Session token expired';
    }
    if (error.code === 'AccessDenied') {
      return 'Access denied - check permissions';
    }
    if (error.code === 'NetworkingError' || error.code === 'TimeoutError') {
      return 'Network timeout - check connectivity';
    }
    
    return error.message || 'Unknown validation error';
  }
}