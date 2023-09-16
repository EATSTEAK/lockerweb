declare global {
  interface ImportMetaEnv {
    VITE_BASE_URL: string;
  }
}

export const variables = {
  baseUrl: 'http://locker.soongsil.media'
};
