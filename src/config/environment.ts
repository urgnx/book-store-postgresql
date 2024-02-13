import dotenvParseVariables from 'dotenv-parse-variables';
import dotMustache from 'dotenv-mustache';
import { config as dotenvConfig } from 'dotenv';

export const configEnv = dotenvConfig();
export const rawEnv = process.env;

const parsedEnv = dotenvParseVariables((configEnv as any)?.parsed);
const mustacheEnv = dotMustache(parsedEnv);
export const env = mustacheEnv;

export const NODE_ENV = env.NODE_ENV ?? 'production';
export const isProduction = NODE_ENV === 'production';
