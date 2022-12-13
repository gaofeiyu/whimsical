const components: Record<string, unknown> = {};

export const getComponent = (name?: string) => {
  if (name) {
    return components[name];
  }
  return components;
};

export const registerComponents = (newComponents: { [key: string]: any }) => {
  Object.keys(newComponents).forEach((key: string) => {
    components[key] = newComponents[key];
  });
};
