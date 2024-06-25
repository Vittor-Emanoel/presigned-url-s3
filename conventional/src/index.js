import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import parser from 'lambda-multipart-parser'
import { randomUUID } from 'node:crypto'
import { response } from './utils/response.js'

export async function handler(event) {
  const {files: [file]} = await parser.parse(event)

  if(!file || file.fieldname !== 'file') {
    return response(400, {
     error: 'File is required.' 
    })
  }

  if(file.contentType !== 'image/png') {
    return response(400, {
      error: 'Only png files are accepted.' 
     })
  }

  const s3client = new S3Client({
    region: 'us-east-2'
  })
  const command = new PutObjectCommand({
    Bucket: "mybkt-vittor",
    Key: `uploads/${randomUUID()}-${file.filename}`,
    Body: file.content,
  })

  await s3client.send(command)

  return {statusCode: 204, body: null}
}