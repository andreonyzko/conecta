import * as dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-troque-em-producao',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  bcryptRounds: 10,
};
