import { createAsyncThunk } from '@reduxjs/toolkit';
import { addComment, getComments, getCommentsPagination, modifyComment } from '../../api/comment';

export const GET_COMMENTS_LENGTH = createAsyncThunk('GET_COMMENTS_LENGTH', async () => {
  const res = await getComments();
  return res.data;
});

export const GET_COMMENTS_CURRENT_PAGE = createAsyncThunk('GET_COMMENTS_CURRENT_PAGE', async pageNumber => {
  const res = await getCommentsPagination(pageNumber);
  const comments = res.data;
  return { comments, pageNumber };
});

export const MODIFY_COMMENT = createAsyncThunk('MODIFY_COMMENT', async info => {
  await modifyComment(info);
});

export const ADD_COMMENT = createAsyncThunk('ADD_COMMENT', async info => {
  await addComment(info);
});
