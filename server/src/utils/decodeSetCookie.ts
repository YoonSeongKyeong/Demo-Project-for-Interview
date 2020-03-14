import {
  DecodeSetCookieInput,
  DecodeSetCookieOutput,
  DecodeSetCookieForm,
} from '../interface/serversideSpecific';
import { extractJWTForTest } from './extractJWT';

export const decodeSetCookie = async (
  setCookieSrcStrings: DecodeSetCookieInput,
): Promise<DecodeSetCookieOutput> => {
  const setCookieObj: DecodeSetCookieOutput = {};
  setCookieSrcStrings.forEach(async srcStr => {
    const propertyList = srcStr.split(';').map(str => str.trim());
    const mainkeyValue = propertyList.shift()?.split('=');
    if (mainkeyValue === undefined) {
      throw new Error('Invalid Set-Cookie : name does not exist');
    }
    const nameOfCookie = mainkeyValue[0];
    const cookieForm: DecodeSetCookieForm = {
      Payload: await extractJWTForTest(nameOfCookie, mainkeyValue[1]),
      Secure: false,
      HttpOnly: false,
    };
    propertyList.forEach(str => {
      const propKeyValue = str.split('=');
      if (propKeyValue[0] === 'Secure') {
        cookieForm.Secure = true;
      } else if (propKeyValue[0] === 'HttpOnly') {
        cookieForm.HttpOnly = true;
      } else if (propKeyValue[0] === 'Expires') {
        cookieForm.Expires = new Date(propKeyValue[1]);
      } else if (propKeyValue[0] === 'Max-Age') {
        cookieForm['Max-Age'] = parseInt(propKeyValue[1]);
      } else if (propKeyValue[0] === 'Domain') {
        cookieForm.Domain = propKeyValue[1];
      } else if (propKeyValue[0] === 'Path') {
        cookieForm.Path = propKeyValue[1];
      } else if (propKeyValue[0] === 'SameSite') {
        cookieForm.SameSite = propKeyValue[1];
      }
    });
    setCookieObj[nameOfCookie] = cookieForm;
  });
  return setCookieObj;
};
