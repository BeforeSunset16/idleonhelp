import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { IconPhoto, IconUpload, IconAlertCircle } from '@tabler/icons-react';
import {
  Modal, TextInput, Button, Group, Stack, FileInput, Alert, Text,
} from '@mantine/core';
import { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import PersonalImageUploader from '@/app/components/ImageUploader';
import outputs from '#/amplify_outputs.json';

const MAX_FILE_SIZE = 300 * 1024;

interface CustomRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable: boolean;
  variant: 'display' | 'edit';
}

export default function CustomRichTextEditor({
  content = '',
  onChange = () => {},
  editable = true,
  variant = 'edit',
}: CustomRichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const { createPersonalImageRecord } = PersonalImageUploader({
    onComplete: (url) => {
      editor?.commands.setImage({ src: url });
      setImageUrl('');
      setFile(null);
      setOpened(false);
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
      editor?.commands.setImage({ src: imageUrl });
      setImageUrl('');
      setOpened(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          style: 'display: block; margin: 0 auto;',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
    editable,
  });

  return (
    <>
      <RichTextEditor
        editor={editor}
        styles={{
          root: {
            border: variant === 'display' ? 'none' : '1px solid #dee2e6',
            background: variant === 'display' ? 'transparent' : undefined,
          },
        }}
      >
        {editable && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Control
                onClick={() => setOpened(true)}
                title="Add image"
              >
                <IconPhoto size={16} />
              </RichTextEditor.Control>
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Insert Image">
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
            <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
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
    </>
  );
}
