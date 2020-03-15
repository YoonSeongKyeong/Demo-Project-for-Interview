import {
  ConfigOfSetCookie,
  ValidateSetCookieOutput,
  ValidateSetCookieInput,
} from '../interface/serversideSpecific';
import { configs, setConfigure } from './configs';
setConfigure();

const configOfSetCookie: ConfigOfSetCookie = {
  'Max-Age': undefined,
  Domain: configs.CLIENT_DOMAIN,
  Path: '/',
  Secure: false,
  HttpOnly: true,
  SameSite: undefined,
};

export const validateSetCookie = ({
  cookieObj,
  isExpired,
}: ValidateSetCookieInput): ValidateSetCookieOutput => {
  if (configOfSetCookie['Max-Age'] !== cookieObj['Max-Age']) {
    throw new Error(
      `${'Max-Age'} is not same: Expected <${configOfSetCookie['Max-Age']}>, but got <${
        cookieObj['Max-Age']
      }>`,
    );
  }
  if (configOfSetCookie['Domain'] !== cookieObj['Domain']) {
    throw new Error(
      `${'Domain'} is not same: Expected <${configOfSetCookie['Domain']}>, but got <${
        cookieObj['Domain']
      }>`,
    );
  }
  if (configOfSetCookie['Path'] !== cookieObj['Path']) {
    throw new Error(
      `${'Path'} is not same: Expected <${configOfSetCookie['Path']}>, but got <${
        cookieObj['Path']
      }>`,
    );
  }
  if (configOfSetCookie['Secure'] !== cookieObj['Secure']) {
    throw new Error(
      `${'Secure'} is not same: Expected <${configOfSetCookie['Secure']}>, but got <${
        cookieObj['Secure']
      }>`,
    );
  }
  if (configOfSetCookie['HttpOnly'] !== cookieObj['HttpOnly']) {
    throw new Error(
      `${'HttpOnly'} is not same: Expected <${configOfSetCookie['HttpOnly']}>, but got <${
        cookieObj['HttpOnly']
      }>`,
    );
  }
  if (configOfSetCookie['SameSite'] !== cookieObj['SameSite']) {
    throw new Error(
      `${'SameSite'} is not same: Expected <${configOfSetCookie['SameSite']}>, but got <${
        cookieObj['SameSite']
      }>`,
    );
  }
  if (isExpired) {
    if (!cookieObj.Expires) {
      throw new Error(`cannot test isExpired: no Expires value found in cookie object`);
    }
    if (
      !!isExpired
        ? cookieObj.Expires.getTime() > Date.now()
        : cookieObj.Expires.getTime() < Date.now()
    ) {
      throw new Error(
        `expected cookie to be ${isExpired ? 'Expired' : 'Not Expired'}, but cookie is ${
          isExpired ? 'Not Expired Yet' : 'Already Expired'
        }, Expire Info: ${cookieObj.Expires}`,
      );
    }
  }
  return true;
};
