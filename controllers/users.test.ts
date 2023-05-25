import type { Context } from "https://deno.land/x/oak/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { hash, compare } from "https://deno.land/x/bcrypt/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";
import Token from "../util/token.ts";
import { signin, signup } from "./users.ts";

// 테스트용 가짜 데이터
const mockUser = {
  email: "test@example.com",
  password: "password123",
};

// mock 사용자 데이터를 저장할 변수
const mockUserDocument = {
  _id: "userId",
  email: mockUser.email,
  passwordHash: "",
  passwordSalt: "",
};

// MongoDB API 모의 객체 생성
const mockMongoAPI = {
  getUser: async (email: string) => {
    if (email === mockUser.email) {
      return mockUserDocument;
    } else {
      return null;
    }
  },
  postUser: async (user: any) => {
    mockUserDocument.passwordHash = user.passwordHash;
    mockUserDocument.passwordSalt = user.passwordSalt;
    return mockUserDocument;
  },
};

// Token 모의 객체 생성
const mockToken = {
  makeToken: async () => {
    return { jwt: "validToken", expires: new Date() };
  },
};

// MongoDB API와 Token 모의 객체를 사용하여 테스트용 auth 모듈 생성
const mockAuth = {
  ...mockMongoAPI,
  ...mockToken,
};

// 가짜 Context 객체 생성
const mockContext: Context = {
  request: {
    hasBody: true,
    async body() {
      return { value: mockUser };
    },
  },
  response: {
    status: 0,
    body: {},
  },
  cookies: {
    set: () => {},
  },
} as any;

Deno.test("signup 테스트", async () => {
  // 테스트용 mockMongoAPI와 mockToken 객체를 사용하여 signup 함수 테스트
  await signup(mockContext);

  assertEquals(mockContext.response.status, 201);
  assertEquals(mockContext.response.body, mockUserDocument);
});

Deno.test("signin 테스트", async () => {
  // 비밀번호를 해싱하여 mockUserDocument에 저장
  mockUserDocument.passwordHash = await hash(mockUser.password, "8");

  // 테스트용 mockMongoAPI와 mockToken 객체를 사용하여 signin 함수 테스트
  await signin(mockContext);

  assertEquals(mockContext.response.status, 201);
  assertEquals(mockContext.response.body, mockUserDocument);
});

Deno.test("signup 에러 테스트 - 이미 가입한 아이디", async () => {
  // getUser 함수를 수정하여 이미 가입한 아이디로 설정
  const mockMongoAPIWithError = {
    ...mockMongoAPI,
    getUser: async () => mockUserDocument,
  };

  // 테스트용 mockMongoAPIWithError와 mockToken 객체를 사용하여 signup 함수 테스트
  await signup(mockContext);

  assertEquals(mockContext.response.status, 400);
  assertEquals(mockContext.response.body, {
    success: false,
    msg: "Error: 이미 가입한 아이디입니다.",
  });
});

Deno.test("signin 에러 테스트 - 이메일 없음", async () => {
  // getUser 함수를 수정하여 이메일이 없음을 설정
  const mockMongoAPIWithError = {
    ...mockMongoAPI,
    getUser: async () => null,
  };

  // 테스트용 mockMongoAPIWithError와 mockToken 객체를 사용하여 signin 함수 테스트
  await signin(mockContext);

  assertEquals(mockContext.response.status, 400);
  assertEquals(mockContext.response.body, {
    success: false,
    msg: "Error: 이메일이 없습니다.",
  });
});

Deno.test("signin 에러 테스트 - 비밀번호 불일치", async () => {
  // compare 함수를 수정하여 비밀번호 불일치로 설정
  const mockAuthWithError = {
    ...mockMongoAPI,
    ...mockToken,
    compare: async () => false,
  };

  // 테스트용 mockMongoAPI와 mockAuthWithError 객체를 사용하여 signin 함수 테스트
  await signin(mockContext);

  assertEquals(mockContext.response.status, 400);
  assertEquals(mockContext.response.body, {
    success: false,
    msg: "Error: 비밀번호가 일치하지 않습니다.",
  });
});
