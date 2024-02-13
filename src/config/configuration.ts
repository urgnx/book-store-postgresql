import { env } from './environment';

export interface IConfiguration {
  auth: {
    atKey: string;
    rtKey: string;
    atExpiresIn: number;
    rtExpiresIn: number;
    options: {
      property: string;
    };
  };
}

const configuration: IConfiguration = {
  auth: {
    atKey: env.JWT_AT_KEY,
    rtKey: env.JWT_RT_KEY,
    atExpiresIn: env.JWT_AT_EXPIRES_IN ?? 900,
    rtExpiresIn: env.JWT_RT_EXPIRES_IN ?? 1209600,
    options: {
      property: 'auth',
    },
  },
};

export default configuration;
