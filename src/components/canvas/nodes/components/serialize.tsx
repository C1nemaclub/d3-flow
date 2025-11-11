import { Typography } from '@mui/material';
import { generateJSON, Node, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer';
import { CustomMention } from './Editor';
import MentionComponent from './editor-comps/MentionComponent';

const msg = `<pre><code class="language-typescriptreact">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui cum vero numquam aperiam repellendus suscipit atque quos expedita doloribus in modi maxime nisi culpa, facere tenetur adipisci consectetur placeat provident aliquid quisquam iste, fugit voluptatibus saepe illo? Molestiae, harum molestias. Magni eos sint repellat quidem optio, temporibus atque iusto consequuntur nihil eligendi similique nostrum non veritatis nam maiores provident. Saepe perspiciatis quaerat, modi dignissimos molestiae enim cupiditate quasi. Provident itaque, dolorem iste deserunt delectus labore tenetur doloremque perferendis, dolore ratione recusandae a, debitis nam. Fuga sit illo atque earum? Amet facilis in mollitia harum eveniet quidem, fuga veritatis hic sapiente doloremque neque est quaerat reprehenderit? Reprehenderit repellat inventore quasi neque sequi omnis perspiciatis molestias nobis aliquam nulla enim culpa voluptatum suscipit ullam porro at ipsum rem nemo placeat, fuga a ut necessitatibus facilis. Vitae asperiores odit error animi laboriosam fugiat magni quasi minima dolore, beatae nostrum officia, saepe sit neque. Sequi animi sint quam corrupti ullam error, porro hic tenetur molestias dicta blanditiis consequatur nisi quia? Molestias est eius placeat, dolores impedit vel, esse possimus numquam ratione quam facere quae fugiat sapiente error modi aliquam velit iure provident. Culpa quod sunt magni iusto error inventore quibusdam veritatis quos rerum id.</code></pre><p></p>`;

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
      mention: (data) => {
        return <MentionComponent {...data} />;
        return (
          <Typography
            component='span'
            sx={{
              color: 'red',
              cursor: 'pointer',
            }}>
            @{data.node.attrs.id ?? ''}
          </Typography>
        );
      },
    },
  },
});
