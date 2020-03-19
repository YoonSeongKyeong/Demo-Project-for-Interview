import Axios from '../config';
import { AxiosResponse } from 'axios';
import { SignInReq, SignInRes } from '../../interface/api';

export const signIn = async ({ email, password }: SignInReq) => {
  try {
    const {
      data: { isSuccess },
    }: AxiosResponse<SignInRes> = await Axios.post(
      `api/signIn`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    if (!isSuccess) {
      // !ISSUE 나중에 어떤 오류로 requset가 성공하지 못했는지 message를 추가해서 알리는 게 좋다.
      alert('로그인 정보가 유효하지 않습니다.');
      throw new Error('Error in signin');
    }
    alert('로그인이 성공헸습니다!');
    return true;
  } catch (error) {
    if (error.message === 'Request failed with status code 404') {
      alert('로그인 정보가 유효하지 않습니다.');
      return false;
    } else {
      alert('에러가 발생했습니다!');
    }
    throw error;
  }
};

export const isSignIn = async () => {
  // 이미 로그인 되어 있는지 확인한다.
  try {
    debugger;
    await Axios.get(`api/isSignIn`, {
      withCredentials: true,
    });
    alert('이미 로그인되어 있습니다.');
    return true; // 404로 에러가 안떴으면 이미 로그인 되어있다.
  } catch (error) {
    if (error.message === 'Request failed with status code 404') {
      // 로그인 정보를 찾을 수 없는 정상적인 상황
      return false;
    } else {
      alert('에러가 발생했습니다!');
    }
    throw error;
  }
};
