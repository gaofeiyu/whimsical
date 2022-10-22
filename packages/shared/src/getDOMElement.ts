export const getDOMElement = (id: string | HTMLElement | ShadowRoot | undefined) => {
  return typeof id === 'string' ? document.getElementById(id) : id;
};
