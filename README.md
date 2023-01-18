# 📝 Comment 목록 CRUD 및 Pagination 구현


<!-- <p align="middle">
<img src="./screenshot.png" />
</p> -->

## 📄목차

---
- [📚 사용 라이브러리](#-사용-라이브러리)
- [🏃‍♂️ 실행방법](#️-실행방법)
- [💡 구현목표](#💡-구현-목표)
  - [1. 댓글 프로젝트 CRUD ](#1-댓글-프로젝트-crud)
  - [2. Pagination](#2-pagination)
  - [3. 리덕스 비동기 처리](#3-리덕스-비동기-처리)

<br>

<br>

## 📚 사용 라이브러리

---

<div align="center">
  
<img src="https://img.shields.io/badge/Redux-7347B6?style=for-the-badge&logo=Redux&logoColor=white" />
<img src="https://img.shields.io/badge/ReduxToolkit-7347B6?style=for-the-badge&logo=Redux&logoColor=white" />
<img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" />
  
<br/>
<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" />
</div>

<br>

## 🏃‍♂️ 실행방법

---

- 의존성 package 설치

```
yarn
```

- 브라우저 실행

```
yarn start
```

- json-server 실행

```
yarn api
```

<br>

## 💡 구현 목표

---

 <h3>

**API 서버와 통신하여 작동하는 댓글 프로젝트를 Redux를 통해 구현하기**

 </h3>

- **댓글 불러오기, 작성, 수정, 삭제가 동작하도록 기능 구현 ( CRUD )**

- **페이지네이션 구현**

    <br>

---

<br>

### 1. 댓글 프로젝트 CRUD

<br>
  
- **추가 조건 ( 댓글 작성, 수정, 삭제 후 동작 )**
  - 댓글 작성하고 난 뒤: 다른 페이지에 위치하고 있었더라도 1페이지로 이동, 입력 폼 초기화
  - 댓글 수정하고 난 뒤: 현재 보고있는 페이지 유지, 입력 폼 초기화
  - 삭제하고 난 뒤: 1페이지로 이동

<br>

**Component**

- 댓글 Create과 Update의 경우, Redux를 통해 '수정모드(modifyMode)' 여부(T/F)를 전역적으로 관리 하여 'Form.js' Component를 공통으로 사용하도록 구현

```javascript
function Form() {
  const dispatch = useDispatch();
  const { modifyMode, modifySelectInfo, currentPageNumber } = useSelector(
    (state) => state.comment
  );
  const { goToPage1 } = useComment();
 ...

  const inputReset = useCallback(() => {
    setProfileURL("");
    setAuthor("");
    setContent("");
    setCreateAt("");
  }, [setAuthor, setContent, setCreateAt, setProfileURL]);

  const onSubmitComment = (e) => {
  ...
    if (modifyMode) {
      dispatch(MODIFY_COMMENT({ id: modifySelectInfo.id, infoData }));
      dispatch(GET_COMMENTS_CURRENT_PAGE(currentPageNumber));
      dispatch(SET_MODIFY_MODE(modifySelectInfo.id));
      inputReset();
    } else {
      dispatch(ADD_COMMENT(infoData));
      inputReset();
      goToPage1(); // 댓글 작성 후 1페이지로 이동
    }
  };

  // 수정 버튼 눌렀을 때 입력 폼 value 변경
  useEffect(() => {
    setProfileURL(modifySelectInfo.profile_url);
    setAuthor(modifySelectInfo.author);
    setContent(modifySelectInfo.content);
    setCreateAt(modifySelectInfo.createdAt);
  }, [
    modifyMode,
    modifySelectInfo,
    setAuthor,
    setContent,
    setCreateAt,
    setProfileURL,
  ]);

  // 수정모드가 꺼졌을 때 입력 폼 초기화
  useEffect(() => {
    if (!modifyMode) {
      inputReset();
    }
  }, [modifyMode, inputReset]);

  return (
    <FormStyle>
      <form>
      ...
        <button type="submit" onClick={onSubmitComment}>
          {modifyMode ? "수정하기" : "등록하기"}
        </button>
        {modifyMode && <div>선택된 id : {modifySelectInfo.id}</div>}
      </form>
    </FormStyle>
  );
}
```

```javascript
const Comment = ({ info, index }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);
  const { goToPage1 } = useComment();

  const onChageModifyMode = () => {
    dispatch(SET_MODIFY_MODE(comments[index].id)); //수정 모드를 전역적으로 관리
    dispatch(SET_MODIFY_SELECTED_INFO(info));
  };

  const onRemoveComment = (index) => {
    removeComment(comments[index].id);
    goToPage1(); //삭제 후 1페이지로 이동
  };

  return (
    <CommentDiv>
      ...
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
```

<br>

**Hooks**

- **useComment** Hook을 사용하여 댓글 Create 및 Delete 이후, 1 페이지로 이동하도록 구현

```javascript
import { useDispatch } from "react-redux";
import { GET_COMMENTS_CURRENT_PAGE } from "../slice/thunk/comment";

const useComment = () => {
  const dispatch = useDispatch();

  const goToPage1 = () => {
    dispatch(GET_COMMENTS_CURRENT_PAGE(1));
  };

  return { goToPage1 };
};

export default useComment;
```

<br>

### 2. Pagination

<br>

- json-server 라이브러리를 사용하여 구현
  - API 호출 예시:
    - 한페이지에 4개의 게시물이 보이고, 최근 게시물부터 정렬해서 3페이지를 보고 싶은 경우   
      ➡️ GET `/comments?_page=3&_limit=4&_order=desc&_sort=id`
      <br>

**Component**

- map 메서드를 사용하여 전체 페이지 버튼들을 생성한 후, 각 페이지 버튼을 누를 때마다 dispatch( 'GET_COMMENTS_CURRENT_PAGE' )를 보내 해당 페이지의 정보를 가져오도록 구현

```javascript
function PageList() {
  const dispatch = useDispatch();
  const { currentPageNumber, commentsLength } = useSelector(
    (state) => state.comment
  );

  const onPageMove = (e) => {
    console.log(e.target.innerHTML);
    dispatch(GET_COMMENTS_CURRENT_PAGE(e.target.innerHTML));
  };

  return (
    <PageListStyle>
      {Array(commentsLength)
        .fill()
        .map((_, index) => (
          <Page
            active={index + 1 === currentPageNumber}
            key={"key" + index}
            onClick={onPageMove}
          >
            {index + 1}
          </Page>
        ))}
    </PageListStyle>
  );
}
```

<br>

### 3. 리덕스 비동기 처리

<br>

- 리덕스 슬라이스 파일 내에 비동기 처리

```javascript

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

```

- 비동기 처리 파일은 따로 빼둠

```javascript
export const GET_COMMENTS_LENGTH = createAsyncThunk(
  "GET_COMMENTS_LENGTH",
  async () => {
    const res = await getComments();
    return res.data;
  }
);

export const GET_COMMENTS_CURRENT_PAGE = createAsyncThunk(
  "GET_COMMENTS_CURRENT_PAGE",
  async (pageNumber) => {
    const res = await getCommentsPagination(pageNumber);
    const comments = res.data;
    return { comments, pageNumber };
  }
);

export const MODIFY_COMMENT = createAsyncThunk(
  "MODIFY_COMMENT",
  async (info) => {
    await modifyComment(info);
  }
);

export const ADD_COMMENT = createAsyncThunk("ADD_COMMENT", async (info) => {
  await addComment(info);
});
```

<br>
