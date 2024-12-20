interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    image: string;
  };
}
interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
interface CreateCategoryParams {
  title: string;
  status: string;
}

interface EditCategoryParams extends CreateCategoryParams {
  categoryId: string;
}
interface GetCategoryParams {
  categoryId: string;
}
