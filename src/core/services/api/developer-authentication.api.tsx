import { useNavigate } from "react-router";
import { instance } from "../interceptor/Interceptor";
import { clearStorage, setItem } from "../storage/Storage";

const SignInDeveloper = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/auth/login", obj);

    if (response.status === 200) {
      const token = response.data.token;
      setItem("token", token);
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
      setItem("token", token);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const SignOutDeveloper = async () => {
  try {
    clearStorage();
    const navigate = useNavigate();
    navigate("/login");
  } catch (error) {
    return error;
  }
};

export { SignInDeveloper, SignUpDeveloper, SignOutDeveloper };
