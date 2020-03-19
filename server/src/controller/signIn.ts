import { Request, Response } from 'express';
import { SignInReq, SignInRes } from '../interface/api';
import { UserService } from '../service/UserService';
import { signJWTForAuth } from '../utils/signJWT';
import { configs } from '../utils/configs';

// 로그인

export async function signIn(request: Request, response: Response): Promise<void> {
  let reqBody: SignInReq;
  let resBody: SignInRes;

  const userService = new UserService();
  try {
    const { email, password } = request.body; // interface 외의 정보 제거
    reqBody = { email, password };
    // UserService를 이용해서 로그인 정보를 받아온다.
    const tokenForAuth = await userService.signIn(reqBody);
    resBody = { isSuccess: true };

    response
      .cookie('auth', signJWTForAuth(tokenForAuth), {
        expires: new Date(Date.now() + 900000000000),
        httpOnly: true,
        domain: configs.CLIENT_DOMAIN,
        path: '/',
      })
      .status(200)
      .json(resBody);
  } catch (error) {
    if (error.message === 'Invalid SignIn Info') {
      resBody = { isSuccess: false };
      response.status(404).json(resBody);
    }
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
