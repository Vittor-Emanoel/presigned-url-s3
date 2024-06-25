import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { response } from './utils/response.js'

export async function handler(event) {
  const { filename } = JSON.parse(event.body)

  if(!filename) {
    return response(400, {
     error: 'Filename is required.' 
    })
  }

  const s3client = new S3Client({
    region: 'us-east-2'
  })
  const command = new GetObjectCommand({
    Bucket: "mybkt-vittor",
    Key: `uploads/${randomUUID()}-${filename}`,
  })

  const url = await getSignedUrl(s3client, command, {expiresIn: 120})

  return response(200, { url })
}