const expressions: { [key: string]: unknown } = {};

export const getCustomExpression = (name?: string): unknown | Record<string, unknown> => {
  if (name) {
    return expressions[name];
  }
  return expressions || {};
};

export const registerExpressions = (newItems: { [key: string]: unknown }) => {
  Object.keys(newItems).forEach((key: string) => {
    expressions[key] = newItems[key];
  });
};
