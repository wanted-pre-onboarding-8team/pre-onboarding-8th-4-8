import { createSlice } from '@reduxjs/toolkit';
import { ADD_COMMENT, GET_COMMENTS_CURRENT_PAGE, GET_COMMENTS_LENGTH } from './thunk/comment';

const initialState = {
  comments: [],
  commentsLength: undefined,
  pageLimit: 5,
  currentPageNumber: 1,
  modifyMode: false,
  modifySelectInfo: {
    id: null,
    profile_url: null,
    author: null,
    content: null,
    createdAt: null,
  },
};

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    SET_MODIFY_MODE(state, action) {
      if (state.modifyMode) {
        if (state.modifySelectInfo.id === action.payload) {
          state.modifyMode = !state.modifyMode;
        }
      } else {
        state.modifyMode = !state.modifyMode;
      }
    },
    SET_MODIFY_SELECTED_INFO(state, action) {
      state.modifySelectInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(GET_COMMENTS_LENGTH.fulfilled, (state, action) => {
      const commentsLength = action.payload.length / state.pageLimit;

      if (Number.isInteger(commentsLength)) {
        state.commentsLength = commentsLength;
      } else {
        state.commentsLength = Math.ceil(commentsLength);
      }
    });

    builder.addCase(GET_COMMENTS_CURRENT_PAGE.fulfilled, (state, action) => {
      state.comments = action.payload.comments;
      state.currentPageNumber = Number(action.payload.pageNumber);
    });

    builder.addCase(ADD_COMMENT.fulfilled, state => {
      state.currentPageNumber = 1;
    });
  },
});

export const { SET_MODIFY_MODE, SET_MODIFY_SELECTED_INFO } = commentSlice.actions;

export default commentSlice;
