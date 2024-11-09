'use client';

import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Title,
  Paper,
  FileInput,
  Button,
  Stack,
  Text,
  Alert,
} from '@mantine/core';
import { IconUpload, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/app/contexts/AuthContext';
import PersonalImageUploader from '@/app/components/ImageUploader';
import outputs from '#/amplify_outputs.json';

const MAX_FILE_SIZE = 300 * 1024; // 300KB in bytes

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const { createPersonalImageRecord } = PersonalImageUploader({
    onComplete: (imageUrl) => {
      console.log('Record created:', imageUrl);
      // Handle success
    },
    onError: (err) => {
      console.error('Failed to create record:', err);
      // Handle error
    },
  });

  const handleFileChange = (newFile: File | null) => {
    setError(null);

    if (!newFile) {
      setFile(null);
      return;
    }

    // Check file type
    if (!newFile.type.includes('jpeg')) {
      setError('Only JPG/JPEG files are allowed');
      return;
    }

    // Check file size
    if (newFile.size > MAX_FILE_SIZE) {
      setError(`File size must be less than 300KB. Current size: ${(newFile.size / 1024).toFixed(1)}KB`);
      return;
    }

    setFile(newFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!user) {
      setError('Please login to upload files');
      return;
    }

    setUploading(true);
    setError(null);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    try {
      const { result } = await uploadData({
        path: ({ identityId }) => `user-uploads/${identityId}/${uniqueFileName}`,
        data: file,
        options: {
          contentType: file.type,
        },
      });
      const uploadResult = await result;
      console.log('Upload success - Result:', result);
      console.log('Upload success - Path:', uploadResult?.path);
      console.log('Upload success - Size:', uploadResult.size);
      console.log('Upload success - ETag:', uploadResult.eTag);
      console.log('Upload success - Content Type:', uploadResult.contentType);
      setFile(null);
      const imageUrl = `https://${outputs.storage.bucket_name}.s3.${outputs.storage.aws_region}.amazonaws.com/${uploadResult?.path}`;
      await createPersonalImageRecord(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="xl">JPG Upload</Title>

      <Paper p="md" withBorder>
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <FileInput
            label="Select JPG file (max 300KB)"
            placeholder="Click to select file"
            leftSection={<IconUpload size={14} />}
            value={file}
            onChange={handleFileChange}
            accept=".jpg,.jpeg"
            clearable
          />

          {file && (
            <Text size="sm" c="dimmed">
              Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </Text>
          )}

          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={!file || !user}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
