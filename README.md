# 📝  검색어 추천기능 구현하기

<!-- <p align="middle">
<img src="./screenshot.png" />
</p> -->

## 📄목차
---
  - [📚 사용 라이브러리](#-사용-라이브러리)
  - [🏃‍♂️ 실행방법](#️-실행방법)
  - [💡 구현목표](#💡-구현-목표)
    - [1. 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현 ](#1-질환명-검색시-api-호출-통해서-검색어-추천-기능-구현)
    - [2. API 호출 최적화](#2-api-호출-최적화)
    - [3. 키보드만으로 추천 검색어들로 이동 가능하도록 구현](#3-키보드만으로-추천-검색어들로-이동-가능하도록-구현)

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
----
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
yarn server
```

<br>

## 💡 구현 목표
---
 <h3> 

 **[한국 임상 정보](https://clinicaltrialskorea.com/) 페이지의 검색영역 클론하기**
 </h3>

  - **질환명 검색시 API 호출 통해서 검색어 추천 기능 구현**

  - **API 호출 최적화**
  
  - **키보드만으로 추천 검색어들로 이동 가능하도록 구현**
  <br>

---
<br>

### 1. 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현 

<br>
  
  * 사용자가 입력한 텍스트와 일치하는 부분 볼드처리
  * 검색어가 없을 시 “검색어 없음” 표출

<br>

**Component**

  * 각 '추천 검색어'의 문자열을 '사용자가 입력한 텍스트( SearchWord )' 를 기준으로  split 메서드를 사용하여 나누어준 후, SearchWord 부분에만 CSS 처리를 해주어 Bold 효과를 줌

```javascript

const RelatedSearchTerm = ({ name, idx }) => {
  const { searchWord, recommendWordIndex } = useSelector(state => state.search);
  const _name = name.split(searchWord);

  return (
    <List className={idx === recommendWordIndex ? 'over' : ''}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <Name>
        <span>{_name[0]}</span>
        {_name[0][_name[0].length - 1] === ' ' ? (
          <BoldName>&nbsp;{searchWord}</BoldName>
        ) : (
          <BoldName>{searchWord}</BoldName>
        )}
        <span>{_name[1]}</span>
      </Name>
    </List>
  );
};

```

<br>

### 2. API 호출 최적화

  - API 호출별로 로컬 캐싱 구현
      ➡️ 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)

  - 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행

  - API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정

<br>

**Component**
 
 * **Cache API**를 사용하여 로컬 캐싱 기능 구현

 * 로컬 브라우저의 **cacheStorage**에 이전에 호출하여 저장한 API URL과 현재 요청한 API URL을 비교한 후, 두 URL이 matching 될 경우 **캐싱 데이터**를 사용하고, matching 되지 않을 경우 **API 호출**하도록 구현
  

```javascript

const handleSearchSick = useCallback(async () => {
    const URL = `http://localhost:4000/sick?q=${searchWord}`;
    const cacheStorage = await caches.open('search');
    const responseCache = await cacheStorage.match(URL);

    // 브라우저 캐시 스토리지에 있을 경우
    if (responseCache?.status === 200) {
      await cacheStorage
        .match(URL)
        .then(res => res.json())
        .then(sickList => setSickList(sickList));
    }
    // 브라우저 캐시 스토리지에 없을 경우
    else {
      await getSick(searchWord).then(res => {
        setSickList(res.data);
        cacheStorage.put(URL, new Response(JSON.stringify(res.data)));
      });
    }
  }, [searchWord]);

```
* **'useSearch' Hook** 에서 Debounce 기능을 넣어 각 입력 사이에 delay(500ms)를 주어, API 호출 횟수를 줄임


```javascript

useEffect(() => {
    if (!!searchWord) setSickList([]);

    const debounce = setTimeout(() => {
      handleSearchSick();
      setInputEntering(false);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [searchWord, handleSearchSick]);

```

<br>

### 3. 키보드만으로 추천 검색어들로 이동 가능하도록 구현

<br>

**Component**

* 검색창에 **onKeyDown 이벤트**를 사용하여 키보드의 위(ArrouUP), 아래(ArrowDown) 버튼의 이동에 따라 **recommendWordIndex** State 값을 바꿔주어 추천 검색어의 키보드 이동이 가능하도록 구현

```javascript

const onKeyPress = e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      console.log(recommendWordIndex);
      // 첫 키 입력 시
      if (recommendWordIndex === null) {
        dispatch(OPERATION_RECOMMEND_WORD_INDEX(0));
      }
      // 맨 위에서 위, 맨 아래에서 아래를 눌렀을 때 아무것도 안함
      else if (recommendWordIndex === 0 && e.key === 'ArrowUp') {
        return;
      } else if (recommendWordIndex === sickList.length - 1 && e.key === 'ArrowDown') {
        return;
      }
      // 키 입력시 증감
      else {
        dispatch(OPERATION_RECOMMEND_WORD_INDEX(e.key));
      }
    }
  };
  
```

<br>
