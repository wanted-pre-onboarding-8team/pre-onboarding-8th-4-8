import { instance } from '.';

export const getComments = async () => {
  return await instance.get('/comments');
};

export const getCommentsPagination = async pageNumber => {
  return await instance.get(`/comments?_page=${pageNumber}&_limit=5&_order=desc&_sort=id`);
};

export const addComment = async info => {
  return await instance.post('/comments', info);
};

export const modifyComment = async info => {
  return await instance.patch(`/comments/${info.id}`, info.infoData);
};

export const removeComment = async id => {
  return await instance.delete(`/comments/${id}`);
};
