declare global {
  interface ImportMetaEnv {
    VITE_BASE_URL: string;
  }
}

export const variables = {
  baseUrl: import.meta.env.VITE_BASE_URL ?? '',
};
