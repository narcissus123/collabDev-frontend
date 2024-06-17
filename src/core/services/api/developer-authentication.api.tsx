import { instance } from "../interceptor/Interceptor";
import { setItem, clearStorage } from "../storage/Storage";

const SignInDeveloper = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/auth/login", obj);

    if (response.status === 200) {
      const token = response.data.token;
      const user = JSON.stringify(response.data.data.userWithoutPassword);
      setItem("token", token);
      setItem("user", user);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const SignUpDeveloper = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/auth/signup", obj);

    if (response.status === 201) {
      const token = response.data.token;
      const user = JSON.stringify(response.data.data.user);
      setItem("token", token);
      setItem("user", user);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const SignOutDeveloper = async () => {
  try {
    clearStorage();
  } catch (error) {
    return error;
  }
};

export { SignInDeveloper, SignUpDeveloper, SignOutDeveloper };
