import React, { useEffect } from 'react';
import CommentListContainer from './containers/CommentListContainer';
import PageListContainer from './containers/PageListContainer';
import FormContainer from './containers/FormContainer';
import { useDispatch } from 'react-redux';
import { GET_COMMENTS_LENGTH } from './slice/thunk/comment';
import useComment from './hooks/useComment';

function App() {
  const dispatch = useDispatch();
  const { goToPage1 } = useComment();

  useEffect(() => {
    dispatch(GET_COMMENTS_LENGTH());
    goToPage1();
  });

  return (
    <div>
      <CommentListContainer />
      <PageListContainer />
      <FormContainer />
    </div>
  );
}

export default App;
