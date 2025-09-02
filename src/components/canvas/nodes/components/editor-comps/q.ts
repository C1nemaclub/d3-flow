const items = {
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

const formatObject = (items: Record<string, any>) => {
  const traverse = (
    targetItems: Parameters<typeof formatObject>[0],
    path = ''
  ) => {
    return Object.entries(targetItems).flatMap((item) => {
      const [keyName, value] = item;
      const fullPath = path ? `${path}.${keyName}` : keyName;
      const moreProps =
        typeof value === 'object' ? traverse(value, fullPath) : [];
      return [fullPath, ...moreProps];
    });
  };

  return traverse(items);
};
