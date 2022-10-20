const components: Record<string, unknown> = {};

export const getComponents = () => {
  return components;
};

export const registerComponents = (newComponents: { [key: string]: any }) => {
  Object.keys(newComponents).forEach((key: string) => {
    components[key] = newComponents[key];
  });
};
