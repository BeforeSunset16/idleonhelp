'use client';

import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
    try {
      const { result } = await uploadData({
        path: ({ identityId }) => `user-uploads/${identityId}/${file.name}`,
        data: file,
      });
      console.log('Upload success - Result:', result);
      console.log('Upload success - Path:', (await result)?.path);
      console.log('Upload success - Size:', (await result).size);
      console.log('Upload success - ETag:', (await result).eTag);
      console.log('Upload success - Content Type:', (await result).contentType);
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="xl">File Upload</Title>

      <Paper p="md" withBorder>
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <FileInput
            label="Select file"
            placeholder="Click to select file"
            leftSection={<IconUpload size={14} />}
            value={file}
            onChange={setFile}
            accept="image/*"
            clearable
          />

          {file && (
            <Text size="sm" c="dimmed">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
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
