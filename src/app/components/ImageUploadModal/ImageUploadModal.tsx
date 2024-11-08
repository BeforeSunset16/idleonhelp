import {
  Modal, TextInput, Button, Group, Stack, FileInput, Alert, Text,
} from '@mantine/core';
import { IconUpload, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import PersonalImageUploader from '@/app/components/ImageUploader';
import outputs from '#/amplify_outputs.json';

const MAX_FILE_SIZE = 300 * 1024;

interface ImageUploadModalProps {
  opened: boolean;
  onClose: () => void;
  onImageUploaded: (imageUrl: string) => void;
}

export default function ImageUploadModal({
  opened, onClose, onImageUploaded,
}: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const { createPersonalImageRecord } = PersonalImageUploader({
    onComplete: (url) => {
      onImageUploaded(url);
      setImageUrl('');
      setFile(null);
      onClose();
    },
    onError: (err) => {
      console.error('Failed to create record:', err);
      setError('Failed to create image record');
    },
  });

  const handleFileChange = (newFile: File | null) => {
    setError(null);
    setImageUrl('');

    if (!newFile) {
      setFile(null);
      return;
    }

    if (!newFile.type.includes('jpeg')) {
      setError('Only JPG/JPEG files are allowed');
      return;
    }

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
    try {
      const { result } = await uploadData({
        path: ({ identityId }) => `user-uploads/${identityId}/${file.name}`,
        data: file,
        options: {
          contentType: file.type,
        },
      });
      const uploadResult = await result;
      const uploadedImageUrl = `https://${outputs.storage.bucket_name}.s3.${outputs.storage.aws_region}.amazonaws.com/${uploadResult?.path}`;
      await createPersonalImageRecord(uploadedImageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSubmit = () => {
    if (imageUrl) {
      onImageUploaded(imageUrl);
      setImageUrl('');
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Insert Image">
      <Stack>
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        <TextInput
          placeholder="Or enter image URL directly"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.currentTarget.value)}
          mb="md"
        />

        <FileInput
          label="Upload JPG file (max 300KB)"
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

        <Group justify="flex-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {imageUrl ? (
            <Button onClick={handleImageSubmit}>Insert URL</Button>
          ) : (
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={!file || !user}
            >
              {uploading ? 'Uploading...' : 'Upload & Insert'}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
