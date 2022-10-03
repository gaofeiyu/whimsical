const uuid = (l = 12) => {
  return URL.createObjectURL(new Blob()).substr(-l);
};
export default uuid;
