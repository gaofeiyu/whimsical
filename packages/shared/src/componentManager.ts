const components: Record<string, unknown> = {};

// export const getComponent = (name?: string): Record<string, unknown> | unknown => {
//   if (name) {
//     return components[name];
//   }
//   return components;
// };

export function getComponent(): Record<string, unknown>;
export function getComponent(name?: string): unknown;
export function getComponent(name?: string): Record<string, unknown> | unknown {
  if (name) {
    return components[name];
  }
  return components;
}

export const registerComponents = (newComponents: { [key: string]: any }) => {
  Object.keys(newComponents).forEach((key: string) => {
    components[key] = newComponents[key];
  });
};
