const expressions: { [key: string]: unknown } = {};

export const getCustomExpressions = () => {
  return expressions || {};
};

export const registerExpressions = (newItems: { [key: string]: unknown }) => {
  Object.keys(newItems).forEach((key: string) => {
    expressions[key] = newItems[key];
  });
};
