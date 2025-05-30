export const withTimestamp = <T extends object>(data: T) => ({
  ...data,
  create_at: Date.now().toString(),
  update_at: Date.now().toString(),
});

export const generateId = (prefix = "") => {
  return Array.from({ length: 19 }, () => `${prefix}${Date.now()}${Math.floor(Math.random() * 10)}`).join("");
};
