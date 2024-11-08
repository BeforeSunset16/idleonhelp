import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { IconPhoto } from '@tabler/icons-react';
import {
  Modal, TextInput, Button, Group,
} from '@mantine/core';
import { useState } from 'react';

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
  console.log(content);

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

  const handleImageSubmit = () => {
    if (imageUrl) {
      editor?.commands.setImage({ src: imageUrl });
      setImageUrl('');
      setOpened(false);
    }
  };

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
        <TextInput
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.currentTarget.value)}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
          <Button onClick={handleImageSubmit}>Insert</Button>
        </Group>
      </Modal>
    </>
  );
}
