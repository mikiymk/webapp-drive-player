export const fetchGet = (url: string, accessToken: string) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
