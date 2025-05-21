export const withTimestamp = <T extends object>(data: T) => ({
  ...data,
  create_at: Date.now().toString(),
  update_at: Date.now().toString(),
});
