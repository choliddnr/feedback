// export type User = {
//   id?: string;
//   username: string;
//   email: string;
//   name: string;
//   picture: string;
//   default_merchant: string;
// };

declare module "#auth-utils" {
  interface User {
    id?: number;
    username: string;
    email: string;
    name: string;
    picture: string | null;
    default_merchant: number | null;
    updated?: Date | null;
    created?: Date | null;
  }
  interface UserSession {
    // Add your own fields
    user: User[];
    loggedInAt: Date;
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
