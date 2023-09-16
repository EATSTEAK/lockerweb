declare global {
  interface ImportMetaEnv {
    VITE_BASE_URL: string;
  }
}

export const variables = {
  baseUrl: 'https://locker.soongsil.media'
};
