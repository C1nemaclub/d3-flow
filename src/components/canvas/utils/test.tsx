// Test tabler

import { IconNumber, IconUser, type IconProps } from '@tabler/icons-react';

type IconComponent = React.ComponentType<IconProps>;

export function withTablerIcon(
  Icon: IconComponent,
  injectedProps?: Partial<IconProps>
): React.FC<IconProps> {
  return function InjectedIcon(props: IconProps) {
    return <Icon {...injectedProps} {...props} />;
  };
}

export const vals: Record<string, IconComponent> = {
  name: IconUser,
  age: withTablerIcon(IconNumber, { color: 'red' }),
};
