import Axios from '../config';
import { AxiosResponse } from 'axios';
import { SignInReq, SignInRes } from '../../interface/api';

export const signIn = async ({ email, password }: SignInReq) => {
  try {
    debugger;
    const {
      data: { isSuccess },
    }: AxiosResponse<SignInRes> = await Axios.post(
      `api/signin`,
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
    return;
  } catch (error) {
    if (error.message === 'Request failed with status code 404') {
      alert('로그인 정보가 유효하지 않습니다.');
    } else {
      alert('에러가 발생했습니다!');
    }
    throw error;
  }
};
