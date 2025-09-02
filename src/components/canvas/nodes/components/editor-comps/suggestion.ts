import { computePosition, flip, shift } from '@floating-ui/dom';
import { posToDOMRect, ReactRenderer, type Editor } from '@tiptap/react';

import type { SuggestionOptions } from '@tiptap/suggestion';
import MentionList, { type KeyHandle } from './MentionList.jsx';

export const items = {
  user: {
    data: {
      name: 'Sam',
      age: 28,
    },
  },
  system: {
    info: {
      os: 'Windows',
      version: '1.0.0',
    },
  },
  notifications: {
    status: true,
  },
};

const formatObject = (items: Record<string, any>): string[] => {
  const traverse = (
    targetItems: Parameters<typeof formatObject>[0],
    path = ''
  ) => {
    return Object.entries(targetItems).flatMap((item) => {
      const [keyName, value] = item;
      const fullPath = path ? `${path}.${keyName}` : keyName;
      const moreProps: string[] =
        typeof value === 'object' ? traverse(value, fullPath) : [];
      return [fullPath, ...moreProps];
    });
  };

  return traverse(items);
};

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      ),
  };

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content';
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

// export const suggestion: MentionOptions['suggestion'] = {
export const suggestion: Omit<
  SuggestionOptions<string, { label: string; id: string; type: string }>,
  'editor'
> = {
  allowSpaces: true,
  char: '!',
  items: ({ query }) => {
    return formatObject(items).filter((item) =>
      // item.toLowerCase().startsWith(query.toLowerCase())
      item.toLowerCase().includes(query.toLowerCase())
    );
  },
  command: ({ editor, range, props }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'mention',
          attrs: {
            id: props.id,
            label: props.label,
            type: props.type,
          },
        },
      ])
      .run();
  },
  render: () => {
    let component: ReactRenderer<KeyHandle>;
    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        (component.element as HTMLElement).style.position = 'absolute';

        document.body.appendChild(component.element);

        updatePosition(props.editor, component.element as HTMLElement);
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        updatePosition(props.editor, component.element as HTMLElement);
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          component.destroy();

          return true;
        }
        return component.ref?.onKeyDown(props) || false;
      },

      onExit() {
        component.element.remove();
        component.destroy();
      },
    };
  },
};
