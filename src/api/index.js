import CONSTANTS from '../constants';

const fetchGet = async url => {
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (res.ok) {
    return res.json();
  }
  return null;
};

const fetchVia = async ({ url, method, body }) => {
  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (res.ok) {
    return res.json();
  }
  return null;
};

const fetchPost = async ({ url, body }) => {
  return fetchVia({ url, body, method: 'POST' });
};

const fetchPatch = async ({ url, body }) => {
  return fetchVia({ url, body, method: 'PATCH' });
};

const fetchDelete = async ({ url, body }) => {
  return fetchVia({ url, body, method: 'DELETE' });
};

export const getDates = async () => {
  return fetchGet(CONSTANTS.API.DATES);
};

export const auth = async () => {
  return fetchGet(CONSTANTS.API.AUTH);
};

export const getNeighborhoods = async () => {
  return fetchGet(CONSTANTS.API.NEIGHBORHOODS);
};

export const getTags = async () => {
  return fetchGet(CONSTANTS.API.TAGS);
};

export const getUserDates = async () => {
  return fetchGet(CONSTANTS.API.USER_DATES);
};

export const createUserDate = async userDateObj => {
  return fetchPost({ url: CONSTANTS.API.USER_DATES, body: userDateObj });
};

export const updateUserDate = async userDateObj => {
  return fetchPatch({ url: CONSTANTS.API.USER_DATES, body: userDateObj });
};

export const deleteUserDate = async userDateObj => {
  return fetchDelete({ url: CONSTANTS.API.USER_DATES, body: userDateObj });
};