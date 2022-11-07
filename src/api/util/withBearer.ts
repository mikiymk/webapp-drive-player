export const fetchGetWithBearer = (
  url: string,
  accessToken: string
): Promise<Response> => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
