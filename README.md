# flash card backend

[플래시카드 서비스](https://flash-card-frontend-pi.vercel.app/)의 백엔드 레포지토리입니다.

폴리 레포 프로젝트이고 [프론트엔드 레포지토리](https://github.com/arch-spatula/flash-card-frontend)는 따로 구성했습니다.

## 기술 스택

- runtime: Deno
- Deploy: Deno Deploy
- Database: mongoDB Atlas

<!-- TODO: ## DB 스키마 -->

## API 명세

아래는 API 주소입니다.

```
https://flash-card-backend.deno.dev/
```

### Auth

#### Sign Up

요청

- URL: `api/auth/signup`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
- Body:
  - email: `string`
  - password: `string`

```json
{
  "email": "username@email.com",
  "password": "12345678"
}
```

응답 예시

- Status: `201`
- Body: (없음)

```json
// body 없음
```

#### Sign In

요청

- URL: `api/auth/signin`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
- Body:
  - email: `string`
  - password: `string`

```json
{
  "email": "username@email.com",
  "password": "12345678"
}
```

응답 예시

- Status: `201`
- Body:
  - success: `boolean`
  - access_token: `access_token`
  - refresh_token: `access_token`

```json
{
  "success": true,
  "access_token": "asdf1234",
  "refresh_token": "qwer6789"
}
```

auth와 관련이 없은 요청을 보낼 때는 위 토큰을 header에 `Authorization: Bearer (access_token)` 형식으로 설정하고 요청을 보내주세요.

#### Refresh Access

요청

- URL: `/api/auth/refresh`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer (refresh_token)`
- Body: (없음)

```json
// 없음
```

응답 예시

- Status: `200`
- Body:
  - success: `boolean`
  - access_token: `access_token`

```json
{
  "success": true,
  "access_token": "zxcv9876"
}
```

### Card

Card Record

```json
{
  "_id": "1234asdf",
  "question": "CPU의 본딧말",
  "answer": "Central Processing Unit",
  "submitDate": "Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)",
  "stackCount": "0",
  "userId": "1"
}
```

#### createCard

요청

- URL: `api/card`
- Method: `POST`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer (access_token)`
- Body:
  - question: `string`
  - answer: `string`
  - submitDate: `Date`
  - stackCount: `number`

```json
{
  "question": "CPU의 본딧말",
  "answer": "Central Processing Unit",
  "submitDate": "Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)",
  "stackCount": "0"
}
```

응답 예시

- Status: `201`
- Body:
  - insertedId: `string`

```json
{
  "insertedId": "1234asdf"
}
```

#### getCards

요청

- URL: `api/card`
- Method: `GET`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer (access_token)`
- Body: (없음)

```json
// body 없음
```

응답 예시

- Status: `200`
- Body:
  - documents:
    - question: `string`
    - answer: `string`
    - submitDate: `Date`
    - stackCount: `number`

```json
{
  "documents": [
    {
      "_id": "1234asdf",
      "question": "도큐사우르스 짱짱맨",
      "answer": "킹정",
      "submitDate": "Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)",
      "stackCount": "0",
      "userId": "1234asdf"
    },
    {
      "_id": "1234asdf",
      "question": "블로그를 더 간지나게 만드는 방법",
      "answer": "github pages로 DIY로 만든다.",
      "submitDate": "Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)",
      "stackCount": "0",
      "userId": "1234asdf"
    }
  ]
}
```

#### updateCard

요청

- URL: `api/card/:id`
- Method: `PATCH`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer (access_token)`
- Body:
  - question: `string`
  - answer: `string`
  - submitDate: `Date`
  - stackCount: `number`

```json
{
  "question": "CPU의 본딧말",
  "answer": "Central Processing Unit",
  "submitDate": "Wed May 19 2023 21:11:26 GMT+0900 (한국 표준시)",
  "stackCount": "1"
}
```

응답 예시

- Status: `200`
- Body:
  - matchedCount: `number`
  - modifiedCount: `number`

```json
{
  "matchedCount": 1,
  "modifiedCount": 1
}
```

#### deleteCard

요청

- URL: `api/card/:id`
- Method: `DELETE`
- Headers:
  - Content-Type: `application/json`
  - Authorization: `Bearer (access_token)`
- Body: (없음)

```json
// body 없음
```

응답 예시

- Status: `204`
- Body: (없음)

```json
// body 없음
```

## 실행 명령

### Run the program

```sh
deno run main.ts
```

### Run the program and watch for file changes

```sh
deno task dev
```

### Run the tests

```sh
deno test --allow-read
```

### Run the benchmarks

```sh
deno bench
```
