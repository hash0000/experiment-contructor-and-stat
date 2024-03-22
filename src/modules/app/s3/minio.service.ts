import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.MINIO_END_POINT,
      useSSL: true,
      accessKey: process.env.MINIO_BUCKET_NAME,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  public async uploadFile(file: Express.Multer.File, objectName: string) {
    const metadata = { 'Content-Type': `${file.mimetype}` };
    await this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, objectName, file.buffer, metadata);
    return `${process.env.MINIO_END_POINT}/${process.env.MINIO_BUCKET_NAME}/${objectName}`;
  }

  public async removeObjectFromMinio(objectName: string) {
    return await this.minioClient.removeObject(process.env.MINIO_BUCKET_NAME, objectName);
  }

  public async generateObjectName(objectName: string) {
    const maxLength = 10;
    const minLength = 5;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const valueOf: string = String(new Date().valueOf());
    let randomFileName = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomFileName += characters.charAt(randomIndex);
    }

    let mixedName = randomFileName + valueOf;

    let mixedResult = '';
    while (mixedName.length > 0) {
      const randomIndex = Math.floor(Math.random() * mixedName.length);
      mixedResult += mixedName.charAt(randomIndex);
      mixedName = mixedName.slice(0, randomIndex) + mixedName.slice(randomIndex + 1);
    }

    const fileExtension: string = objectName.split('.').pop();
    return `${mixedResult}.${fileExtension}`;
  }

  public getFileType(fileName: string) {
    const filesExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico'];
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (filesExtensions.includes(fileExtension)) return true;
  }
}
