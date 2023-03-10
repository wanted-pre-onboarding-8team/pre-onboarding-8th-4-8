# ๐ Comment ๋ชฉ๋ก CRUD ๋ฐ Pagination ๊ตฌํ


<!-- <p align="middle">
<img src="./screenshot.png" />
</p> -->

## ๐๋ชฉ์ฐจ

---
- [๐ ์ฌ์ฉ ๋ผ์ด๋ธ๋ฌ๋ฆฌ](#-์ฌ์ฉ-๋ผ์ด๋ธ๋ฌ๋ฆฌ)
- [๐โโ๏ธ ์คํ๋ฐฉ๋ฒ](#๏ธ-์คํ๋ฐฉ๋ฒ)
- [๐ก ๊ตฌํ๋ชฉํ](#๐ก-๊ตฌํ-๋ชฉํ)
  - [1. ๋๊ธ ํ๋ก์ ํธ CRUD ](#1-๋๊ธ-ํ๋ก์ ํธ-crud)
  - [2. Pagination](#2-pagination)
  - [3. ๋ฆฌ๋์ค ๋น๋๊ธฐ ์ฒ๋ฆฌ](#3-๋ฆฌ๋์ค-๋น๋๊ธฐ-์ฒ๋ฆฌ)

<br>

<br>

## ๐ ์ฌ์ฉ ๋ผ์ด๋ธ๋ฌ๋ฆฌ

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

## ๐โโ๏ธ ์คํ๋ฐฉ๋ฒ

---

- ์์กด์ฑ package ์ค์น

```
yarn
```

- ๋ธ๋ผ์ฐ์  ์คํ

```
yarn start
```

- json-server ์คํ

```
yarn api
```

<br>

## ๐ก ๊ตฌํ ๋ชฉํ

---

 <h3>

**API ์๋ฒ์ ํต์ ํ์ฌ ์๋ํ๋ ๋๊ธ ํ๋ก์ ํธ๋ฅผ Redux๋ฅผ ํตํด ๊ตฌํํ๊ธฐ**

 </h3>

- **๋๊ธ ๋ถ๋ฌ์ค๊ธฐ, ์์ฑ, ์์ , ์ญ์ ๊ฐ ๋์ํ๋๋ก ๊ธฐ๋ฅ ๊ตฌํ ( CRUD )**

- **ํ์ด์ง๋ค์ด์ ๊ตฌํ**

    <br>

---

<br>

### 1. ๋๊ธ ํ๋ก์ ํธ CRUD

<br>
  
- **์ถ๊ฐ ์กฐ๊ฑด ( ๋๊ธ ์์ฑ, ์์ , ์ญ์  ํ ๋์ )**
  - ๋๊ธ ์์ฑํ๊ณ  ๋ ๋ค: ๋ค๋ฅธ ํ์ด์ง์ ์์นํ๊ณ  ์์๋๋ผ๋ 1ํ์ด์ง๋ก ์ด๋, ์๋ ฅ ํผ ์ด๊ธฐํ
  - ๋๊ธ ์์ ํ๊ณ  ๋ ๋ค: ํ์ฌ ๋ณด๊ณ ์๋ ํ์ด์ง ์ ์ง, ์๋ ฅ ํผ ์ด๊ธฐํ
  - ์ญ์ ํ๊ณ  ๋ ๋ค: 1ํ์ด์ง๋ก ์ด๋

<br>

**Component**

- ๋๊ธ Create๊ณผ Update์ ๊ฒฝ์ฐ, Redux๋ฅผ ํตํด '์์ ๋ชจ๋(modifyMode)' ์ฌ๋ถ(T/F)๋ฅผ ์ ์ญ์ ์ผ๋ก ๊ด๋ฆฌ ํ์ฌ 'Form.js' Component๋ฅผ ๊ณตํต์ผ๋ก ์ฌ์ฉํ๋๋ก ๊ตฌํ

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
      goToPage1(); // ๋๊ธ ์์ฑ ํ 1ํ์ด์ง๋ก ์ด๋
    }
  };

  // ์์  ๋ฒํผ ๋๋ ์ ๋ ์๋ ฅ ํผ value ๋ณ๊ฒฝ
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

  // ์์ ๋ชจ๋๊ฐ ๊บผ์ก์ ๋ ์๋ ฅ ํผ ์ด๊ธฐํ
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
          {modifyMode ? "์์ ํ๊ธฐ" : "๋ฑ๋กํ๊ธฐ"}
        </button>
        {modifyMode && <div>์ ํ๋ id : {modifySelectInfo.id}</div>}
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
    dispatch(SET_MODIFY_MODE(comments[index].id)); //์์  ๋ชจ๋๋ฅผ ์ ์ญ์ ์ผ๋ก ๊ด๋ฆฌ
    dispatch(SET_MODIFY_SELECTED_INFO(info));
  };

  const onRemoveComment = (index) => {
    removeComment(comments[index].id);
    goToPage1(); //์ญ์  ํ 1ํ์ด์ง๋ก ์ด๋
  };

  return (
    <CommentDiv>
      ...
      <Button>
        <button onClick={onChageModifyMode}>์์ </button>
        <button
          onClick={() => {
            onRemoveComment(index);
          }}
        >
          ์ญ์ 
        </button>
      </Button>
      <hr />
    </CommentDiv>
  );
};
```

<br>

**Hooks**

- **useComment** Hook์ ์ฌ์ฉํ์ฌ ๋๊ธ Create ๋ฐ Delete ์ดํ, 1 ํ์ด์ง๋ก ์ด๋ํ๋๋ก ๊ตฌํ

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

- json-server ๋ผ์ด๋ธ๋ฌ๋ฆฌ๋ฅผ ์ฌ์ฉํ์ฌ ๊ตฌํ
  - API ํธ์ถ ์์:
    - ํํ์ด์ง์ 4๊ฐ์ ๊ฒ์๋ฌผ์ด ๋ณด์ด๊ณ , ์ต๊ทผ ๊ฒ์๋ฌผ๋ถํฐ ์ ๋ ฌํด์ 3ํ์ด์ง๋ฅผ ๋ณด๊ณ  ์ถ์ ๊ฒฝ์ฐ   
      โก๏ธ GET `/comments?_page=3&_limit=4&_order=desc&_sort=id`
      <br>

**Component**

- map ๋ฉ์๋๋ฅผ ์ฌ์ฉํ์ฌ ์ ์ฒด ํ์ด์ง ๋ฒํผ๋ค์ ์์ฑํ ํ, ๊ฐ ํ์ด์ง ๋ฒํผ์ ๋๋ฅผ ๋๋ง๋ค dispatch( 'GET_COMMENTS_CURRENT_PAGE' )๋ฅผ ๋ณด๋ด ํด๋น ํ์ด์ง์ ์ ๋ณด๋ฅผ ๊ฐ์ ธ์ค๋๋ก ๊ตฌํ

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

  **api**

```javascript
export const getCommentsPagination = async pageNumber => {
  return await instance.get(`/comments?_page=${pageNumber}&_limit=5&_order=desc&_sort=id`);
};
```
<br>

### 3. ๋ฆฌ๋์ค ๋น๋๊ธฐ ์ฒ๋ฆฌ

<br>

- ๋ฆฌ๋์ค ์ฌ๋ผ์ด์ค ํ์ผ ๋ด์ ๋น๋๊ธฐ ์ฒ๋ฆฌ

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

- ๋น๋๊ธฐ ์ฒ๋ฆฌ ํ์ผ์ ๋ฐ๋ก ๋นผ๋ 

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
