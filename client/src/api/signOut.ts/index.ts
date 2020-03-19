import Axios from '../config';

export const signOut = async () => {
  try {
    await Axios.post(
      `api/signout`,
      {
        // empty body
      },
      {
        withCredentials: true,
      }
    );
    alert('로그아웃이 완료되었습니다!');
    return;
  } catch (error) {
    alert('에러가 발생했습니다!');
    throw error;
  }
};
