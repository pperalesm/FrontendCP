export const isPasswordValid = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._!"`'#%&,:;<>=@{}~$()*+/\\?[\]^|]).{8,}$/.test(
    password,
  );
};
