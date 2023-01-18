import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { removeComment } from '../api/comment';
import useComment from '../hooks/useComment';
import { SET_MODIFY_MODE, SET_MODIFY_SELECTED_INFO } from '../slice/comment';

const Comment = ({ info, index }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector(state => state.comment);
  const { goToPage1 } = useComment();

  const onChageModifyMode = () => {
    dispatch(SET_MODIFY_MODE(comments[index].id));
    dispatch(SET_MODIFY_SELECTED_INFO(info));
  };

  const onRemoveComment = index => {
    removeComment(comments[index].id);
    goToPage1();
  };

  return (
    <CommentDiv>
      <img src={info.profile_url} alt='' />
      {info.author}
      <CreatedAt>{info.createdAt}</CreatedAt>
      <Content>{info.content}</Content>
      <Button>
        <button onClick={onChageModifyMode}>수정</button>
        <button
          onClick={() => {
            onRemoveComment(index);
          }}
        >
          삭제
        </button>
      </Button>
      <hr />
    </CommentDiv>
  );
};

const CommentDiv = styled.div`
  padding: 7px 10px;
  text-align: left;

  & > img {
    vertical-align: middle;
    margin-right: 10px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
`;

const CreatedAt = styled.div`
  width: auto;
  float: right;
  vertical-align: middle;
`;

const Content = styled.div`
  border: none;
  display: block;
  width: 100%;
  margin: 10px 0;
`;

const Button = styled.div`
  text-align: right;
  margin: 10px 0;
  & > a {
    margin-right: 10px;
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid lightgray;
    cursor: pointer;
  }
`;

export default Comment;
