import { useDispatch } from 'react-redux';
import { GET_COMMENTS_CURRENT_PAGE } from '../slice/thunk/comment';

const useComment = () => {
  const dispatch = useDispatch();

  const goToPage1 = () => {
    dispatch(GET_COMMENTS_CURRENT_PAGE(1));
  };

  return { goToPage1 };
};

export default useComment;
