import { RichTextEditor, Link } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { IconPhoto } from '@tabler/icons-react';
import {
  useState, useCallback, useRef, useEffect,
} from 'react';
import { uploadData } from 'aws-amplify/storage';
import { useAuth } from '@/app/contexts/AuthContext';
import SharedImageUploader from '@/app/components/ImageUploader';
import outputs from '#/amplify_outputs.json';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadModal from '../ImageUploadModal/ImageUploadModal';

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
  const [opened, setOpened] = useState(false);
  const { user } = useAuth();
  const editorRef = useRef<any>(null);

  const { createSharedImageRecord } = SharedImageUploader({
    onComplete: (imageUrl) => {
      editorRef.current?.commands.setImage({ src: imageUrl });
    },
    onError: (err) => {
      console.error('Failed to create record:', err);
    },
  });

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const imageItem = Array.from(items).find(
      (item) => item.type.indexOf('image') === 0,
    );

    if (imageItem) {
      event.preventDefault();
      const file = imageItem.getAsFile();
      if (file && user) {
        try {
          const fileExtension = file.name.split('.').pop() || 'jpg';
          const uniqueFileName = `${uuidv4()}.${fileExtension}`;

          const { result } = await uploadData({
            path: ({ identityId }) => `shared-images/${identityId}/${uniqueFileName}`,
            data: file,
            options: {
              contentType: file.type,
            },
          });
          const uploadResult = await result;
          const imageUrl = `https://${outputs.storage.bucket_name}.s3.${outputs.storage.aws_region}.amazonaws.com/${uploadResult?.path}`;

          await createSharedImageRecord(imageUrl);
        } catch (err) {
          console.error('Upload error:', err);
        }
      }
    }
  }, [user, createSharedImageRecord]);

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
    editorProps: {
      handlePaste: (view, event) => {
        handlePaste(event);
        return false;
      },
    },
    enableCoreExtensions: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  const handleImageUploaded = useCallback((imageUrl: string) => {
    editorRef.current?.commands.setImage({ src: imageUrl });
    setOpened(false);
  }, []);

  return (
    <>
      <RichTextEditor
        editor={editor}
        styles={{
          root: {
            border: variant === 'display' ? 'none' : '0px solid #dee2e6',
            backgroundColor: 'transparent',
          },
          content: {
            minHeight: '600px',
            backgroundColor: 'transparent',
            '& .ProseMirror': {
              minHeight: '600px',
              padding: '20px',
              backgroundColor: 'transparent !important',
              '& p': {
                backgroundColor: 'transparent !important',
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
              },
            },
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
        {editor && editable && (
          <BubbleMenu editor={editor}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              padding: '6px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              maxWidth: '500px',
            }}>
              <RichTextEditor.ControlsGroup style={{ padding: '2px' }}>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.Highlight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup style={{ padding: '2px' }}>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup style={{ padding: '2px' }}>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup style={{ padding: '2px' }}>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignRight />
                <RichTextEditor.AlignJustify />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup style={{ padding: '2px' }}>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Blockquote />
              </RichTextEditor.ControlsGroup>
            </div>
          </BubbleMenu>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>

      <ImageUploadModal
        opened={opened}
        onClose={() => setOpened(false)}
        onImageUploaded={handleImageUploaded}
      />
    </>
  );
}
