import { Typography } from '@mui/material';
import { generateJSON, Node, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  renderToMarkdown,
  renderToReactElement,
} from '@tiptap/static-renderer';
// import 'prosemirror-view/style/prosemirror.css';
// import 'tiptap/core/style.css'; // for base styles
// import 'tiptap/extension-text-style/style.css'; // optional, for colors/fonts

import { CustomMention } from './Editor';

const msg = `<h3>Title</h3><h3>Another title</h3><ol><li><p>First</p></li><li><p>Second</p></li></ol><p>Text</p><h1>hello</h1><p></p>`;

const extensions = [
  StarterKit,
  CustomMention.configure({
    HTMLAttributes: {
      class: 'mention',
      ['data-something']: 'hello World!',
    },
  }),
];

const MyNode = Node.create({
  addNodeView() {
    return ReactNodeViewRenderer(Typography);
  },
  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: null,
      },
    };
  },
});

export const jsonDoc = generateJSON(msg, extensions);
export const reactResult = renderToReactElement({
  extensions,
  content: jsonDoc,
  options: {
    // HAndle the mention
    nodeMapping: {
      // paragraph: ({ node }) => {
      //   return <p>{node.textContent}</p>;
      // },
      // heading: ({ node }) => {
      //   // default to h1 if level is missing
      //   const level = node.attrs?.level || 1;
      //   const Tag = `h${level}`;
      //   return <Tag>{node.textContent}</Tag>;
      // },
    },
  },
});

export const mdResult = renderToMarkdown({
  extensions,
  content: jsonDoc,
});
