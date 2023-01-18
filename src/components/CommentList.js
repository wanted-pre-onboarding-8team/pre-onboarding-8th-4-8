import React from 'react';
import { useSelector } from 'react-redux';
import Comment from './Comment';

function CommentList() {
  const { comments } = useSelector(state => state.comment);

  return comments.map((comment, index) => <Comment key={index} info={comment} index={index} />);
}

export default CommentList;
