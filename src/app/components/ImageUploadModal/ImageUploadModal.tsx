import {
  Modal, TextInput, Button, Group, Stack, FileInput, Alert, Text, SimpleGrid, Card, Image,
} from '@mantine/core';
import { IconUpload, IconAlertCircle } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import PersonalImageUploader from '@/app/components/ImageUploader';
import outputs from '#/amplify_outputs.json';
import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '#/amplify/data/resource';

const client = generateClient<Schema>();
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
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const { result } = await uploadData({
        path: ({ identityId }) => `user-uploads/${identityId}/${uniqueFileName}`,
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

  const fetchRecentImages = async (token?: string | null) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, nextToken: newNextToken } = await client.models.PersonalImage
        .listPersonalImageByActiveAndCreatedAt(
          {
            active: 'T',
          },
          {
            sortDirection: 'DESC',
            filter: {
              owner: { beginsWith: user?.username },
            },
            authMode: 'userPool',
            limit: 2,
            nextToken: token,
          },
        );

      if (token) {
        setRecentImages((prev) => [...prev, ...(data || [])]);
      } else {
        setRecentImages(data || []);
      }
      setNextToken(newNextToken || null);
    } catch (error2) {
      console.error('Error fetching recent images:', error2);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (nextToken) {
      fetchRecentImages(nextToken);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchRecentImages(null);
    }
  }, [opened, user]);

  const handleRecentImageClick = (selectedImageUrl: string) => {
    onImageUploaded(selectedImageUrl);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Insert Image" size="xl">
      <Stack>
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {error}
          </Alert>
        )}

        <TextInput
          placeholder="输入图片URL"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.currentTarget.value)}
          mb="md"
        />

        <FileInput
          label="上传jpg 文件 (最大 300KB)"
          placeholder="点击选择文件"
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
              {uploading ? '上传中...' : '上传并插入'}
            </Button>
          )}
        </Group>

        {recentImages.length > 0 && (
          <>
            <Text size="sm" fw={500} mt="md">Recent Images</Text>
            <SimpleGrid cols={5} spacing="xs">
              {recentImages.map((image) => (
                <Card
                  key={image.id}
                  p="xs"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRecentImageClick(image.imageUrl)}
                >
                  <Card.Section>
                    <Image
                      src={image.imageUrl}
                      alt={image.title || 'Uploaded image'}
                      height={100}
                      fit="cover"
                    />
                  </Card.Section>
                  <Text size="xs" c="dimmed" mt={4} lineClamp={1}>
                    {new Date(image.createdAt).toLocaleDateString()}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>

            {nextToken && (
              <Button
                variant="light"
                onClick={handleLoadMore}
                loading={loading}
                fullWidth
                mt="sm"
              >
                加载更多图片
              </Button>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}
