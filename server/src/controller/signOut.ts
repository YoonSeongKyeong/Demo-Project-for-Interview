import { Request, Response } from 'express';
import { configs } from '../utils/configs';

// 로그아웃

export async function signOut(request: Request, response: Response): Promise<void> {
  try {
    response
      .clearCookie('auth', {
        httpOnly: true,
        domain: configs.CLIENT_DOMAIN,
        path: '/',
      })
      .status(200)
      .send();
  } catch (error) {
    console.log('ERROR: ' + error.message);
    response.status(500).send(error.message);
  }
}
