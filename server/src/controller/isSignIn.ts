import { Request, Response } from 'express';
import { configs } from '../utils/configs';
import { extractJWT } from '../utils/extractJWT';
import { TokenForAuth } from '../interface/serversideSpecific';
import { UserService } from '../service/UserService';

// 로그인 상태인지 확인

export async function isSignIn(request: Request, response: Response): Promise<void> {
  try {
    const auth = extractJWT('auth', request) as TokenForAuth;
    const { id } = auth;

    const userService = new UserService();

    if (id && (await userService.isValidUser(id))) {
      response.status(200).send();
      return;
    }
    response.status(404).send();
  } catch (error) {
    debugger;
    if (error.message === 'cannot find token in cookie [auth]') {
      response
        .clearCookie('auth', {
          httpOnly: true,
          domain: configs.CLIENT_DOMAIN,
          path: '/',
        })
        .status(404)
        .send();
      return;
    }
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
