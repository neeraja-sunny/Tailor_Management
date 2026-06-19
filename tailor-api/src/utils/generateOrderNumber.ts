export const generateOrderNumber = () => {
  const now = Date.now().toString().slice(-6); // last 6 digits
  return `T-${now}-${Math.floor(Math.random()*900+100)}`; // e.g. T-123456-345
};