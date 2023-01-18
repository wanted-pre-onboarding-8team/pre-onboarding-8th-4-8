import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useComment from '../hooks/useComment';
import useInput from '../hooks/useInput';
import { SET_MODIFY_MODE } from '../slice/comment';
import { ADD_COMMENT, GET_COMMENTS_CURRENT_PAGE, MODIFY_COMMENT } from '../slice/thunk/comment';

function Form() {
  const dispatch = useDispatch();
  const { modifyMode, modifySelectInfo, currentPageNumber } = useSelector(state => state.comment);
  const { goToPage1 } = useComment();
  const [profileURL, onChangeProfileURL, setProfileURL] = useInput('');
  const [author, onChangeAuthor, setAuthor] = useInput('');
  const [content, onChangeContent, setContent] = useInput('');
  const [createdAt, onChangeCreatedAt, setCreateAt] = useInput('');

  const inputReset = useCallback(() => {
    setProfileURL('');
    setAuthor('');
    setContent('');
    setCreateAt('');
  }, [setAuthor, setContent, setCreateAt, setProfileURL]);

  const onSubmitComment = e => {
    e.preventDefault();
    const infoData = {
      profile_url: profileURL,
      author,
      content,
      createdAt,
    };

    if (modifyMode) {
      dispatch(MODIFY_COMMENT({ id: modifySelectInfo.id, infoData }));
      dispatch(GET_COMMENTS_CURRENT_PAGE(currentPageNumber));
      dispatch(SET_MODIFY_MODE(modifySelectInfo.id));
      inputReset();
    } else {
      dispatch(ADD_COMMENT(infoData));
      inputReset();
      goToPage1();
    }
  };
  // 수정 버튼 눌렀을 때 입력 폼 value 변경
  useEffect(() => {
    setProfileURL(modifySelectInfo.profile_url);
    setAuthor(modifySelectInfo.author);
    setContent(modifySelectInfo.content);
    setCreateAt(modifySelectInfo.createdAt);
  }, [modifyMode, modifySelectInfo, setAuthor, setContent, setCreateAt, setProfileURL]);
  // 수정모드가 꺼졌을 때 입력 폼 초기화
  useEffect(() => {
    if (!modifyMode) {
      inputReset();
    }
  }, [modifyMode, inputReset]);

  return (
    <FormStyle>
      <form>
        <input
          value={profileURL}
          onChange={onChangeProfileURL}
          type='text'
          name='profile_url'
          placeholder='https://picsum.photos/id/1/50/50'
          required
        />
        <br />
        <input value={author} onChange={onChangeAuthor} type='text' name='author' placeholder='작성자' />
        <br />
        <textarea value={content} onChange={onChangeContent} name='content' placeholder='내용' required></textarea>
        <br />
        <input
          value={createdAt}
          onChange={onChangeCreatedAt}
          type='text'
          name='createdAt'
          placeholder='2020-05-30'
          required
        />
        <br />
        <button type='submit' onClick={onSubmitComment}>
          {modifyMode ? '수정하기' : '등록하기'}
        </button>
        {modifyMode && <div>선택된 id : {modifySelectInfo.id}</div>}
      </form>
    </FormStyle>
  );
}

const FormStyle = styled.div`
  & > form {
    padding: 0 10px;
    margin-bottom: 50px;
  }
  & > form > textarea {
    padding: 5px 1%;
    width: 98%;
    height: 50px;
  }
  & > form > input[type='text'] {
    padding: 5px 1%;
    width: 98%;
    margin-bottom: 10px;
  }
  & > form > button {
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid lightgray;
    cursor: pointer;
  }
`;

export default Form;
