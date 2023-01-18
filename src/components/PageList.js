import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { GET_COMMENTS_CURRENT_PAGE } from '../slice/thunk/comment';

function PageList() {
  const dispatch = useDispatch();
  const { currentPageNumber, commentsLength } = useSelector(state => state.comment);

  const onPageMove = e => {
    console.log(e.target.innerHTML);
    dispatch(GET_COMMENTS_CURRENT_PAGE(e.target.innerHTML));
  };

  return (
    <PageListStyle>
      {Array(commentsLength)
        .fill()
        .map((_, index) => (
          <Page active={index + 1 === currentPageNumber} key={'key' + index} onClick={onPageMove}>
            {index + 1}
          </Page>
        ))}
    </PageListStyle>
  );
}

const PageListStyle = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Page = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid lightgray;
  background: ${props => (props.active ? 'gray' : '')};
  color: ${props => (props.active ? '#fff' : '')};
  margin-right: 3px;
`;

export default PageList;
