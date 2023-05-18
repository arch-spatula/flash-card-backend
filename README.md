# flash card backend

플래시카드 백엔드를 다루는 레포지토리입니다.

## Run the program

```sh
deno run main.ts
```

## Run the program and watch for file changes

```sh
deno task dev
```

## Run the tests

```sh
deno test
```

## Run the benchmarks

```sh
deno bench
```

## Card 스키마

```json
{
  "_id": "foo",
  "question": "CPU의 본딧말",
  "answer": "Central Processing Unit",
  "submitDate": "Wed May 17 2023 21:11:26 GMT+0900 (한국 표준시)",
  "stackCount": "0"
}
```
