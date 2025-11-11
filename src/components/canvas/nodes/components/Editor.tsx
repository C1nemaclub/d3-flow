import { Box, IconButton, styled } from '@mui/material';
import { IconSettings } from '@tabler/icons-react';
import Mention from '@tiptap/extension-mention';
import {
  EditorContent,
  mergeAttributes,
  Node,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type ReactNodeViewProps,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import MentionComponent from './editor-comps/MentionComponent';
import { suggestion } from './editor-comps/suggestion';

const PopupComponent = ({ node }: any) => {
  return (
    // <div
    //   data-id='my-block'
    //   className='popup relative border rounded p-4'
    //   style={{ position: 'relative' }}>
    //   <div>{node.textContent}</div>
    //   <button
    //     className='absolute top-0 right-0 m-1 bg-blue-500 text-white rounded-full p-1 shadow'
    //     onClick={() => alert('Icon button clicked!')}
    //     ⚙️
    //   </button>
    // </div>
    <NodeViewWrapper>
      <Box data-id='my-block' sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={() => alert('Icon button clicked!')}>
          <IconSettings />
        </IconButton>
      </Box>
    </NodeViewWrapper>
  );
};

const PopupExtension = Node.create({
  name: 'popup',
  // group: 'block',
  content: 'inline',
  // addAttributes: () => ({ class: 'popup' }),
  addAttributes() {
    return {
      class: {
        default: 'popup',
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-id="my-block"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-id': 'my-block' }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PopupComponent);
  },
});

export interface CustomProps {
  inject: string;
}

const VenomInjectedMentionComponent = (
  props: ReactNodeViewProps<CustomProps>
) => {
  const extraProps = {
    inject: 'Poison',
  };
  return <MentionComponent {...props} {...extraProps} />;
};

export const CustomMention = Mention.extend({
  addNodeView() {
    return ReactNodeViewRenderer(VenomInjectedMentionComponent);
  },
  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: null,
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-type'),
      },
    };
  },
});

interface CustomEditorProps {
  variant?: 'default' | 'outlined';
}

const CustomEditor = styled(EditorContent, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<CustomEditorProps>(({ theme, variant }) => {
  return [
    {
      cursor: 'text',
      borderRadius: '4px',
      textAlign: 'left',
      backgroundColor: theme.palette.background.default,
      float: 'left',
      width: '100%',
      lineHeight: '1rem',
      '& .tiptap.ProseMirror': {
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: '4px',
        outline: 'none',
        color: theme.palette.text.primary,
        padding: '6px 10px',
        '& p': {
          margin: '10px 0',
        },
        '&.ProseMirror-focused': {
          border: `1px solid ${theme.palette.primary.main}`,
        },
      },
      // '& .mention': {
      //   backgroundColor: 'rgba(182, 147, 253, 0.1)',
      //   color: '#5800cc',
      // },
    },
    variant === 'outlined' && {
      '& .tiptap.ProseMirror': {
        border: '1px solid blue',
      },
    },
  ];
});

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      PopupExtension.configure({}),
      // Document,
      // Paragraph,
      // Text,
      CustomMention.configure({
        deleteTriggerWithBackspace: false,
        HTMLAttributes: {
          class: 'mention',
          ['data-something']: 'hello World!',
        },
        suggestion,
        // renderHTML: ({ node, options }) => {
        //   // const domNode = document.createElement('a');
        //   // domNode.textContent = 'Hey!';
        //   console.log(node, options);

        //   return [
        //     'span',
        //     { 'data-type': 'mention', class: 'mention' },
        //     `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
        //   ];
        // },
      }),
    ],
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    },
    content: '<div data-id="my-block">Editable block with popup</div>',
    // editorProps: {
    //   attributes: {
    //     class: ['custom-editor'].join(' '),
    //   },
    // },
  });

  const className = clsx('editor', {
    'editor-empty': editor.isActive,
    'editor-focused': editor.isFocused,
    'editor-outlined': true,
  });

  return (
    <CustomEditor
      editor={editor}
      className={className}
      variant='default'
      placeholder='Type @ to see variables...'
    />
  );
};

export default Editor;
