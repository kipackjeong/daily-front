import { Dispatch } from "@reduxjs/toolkit";
import { useAppStatus } from "../hooks/useAppStatus";
import { taskActions } from "../models/task";
import IUser from "../models/user/user";
import { userActions } from "../redux/slices/user.slice";
import axiosInstance from "../utils/axios";
import { ServiceErrorHandler } from "../utils/decorators";

type LoginPayload = {
  email: string;
  password: string;
};
type SignUpPayload = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};
class AuthService {
  public async login(payload, dispatch: Dispatch) {
    const { email, password } = payload;

    const res = await axiosInstance.post(
      "/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    const user: IUser = res.data.data;

    dispatch(userActions.setUser(user));
  }
  @ServiceErrorHandler
  public async logout(dispatch: Dispatch) {
    await axiosInstance.post("/logout");
    dispatch(taskActions.deleteAll());
    dispatch(userActions.setUser(null));
  }

  @ServiceErrorHandler
  public async signup(payload: SignUpPayload) {
    const { firstname, lastname, email, password } = payload;

    const user = await axiosInstance.post("/signup", {
      firstname,
      lastname,
      email,
      password,
    });

    return user;
  }
}

export default new AuthService();
