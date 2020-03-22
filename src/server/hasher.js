
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRATION = 60 * 60 * 60;
const TOKEN_SECRET = 'dfgsdfdfg';

//  export const makeHash = value => bcrypt.hashSync

export const validateToken = token => jwt.verify(token,TOKEN_SECRET)

export const matchHash = (plain, hashed) => bcrypt.compareSync(plain, hashed);

export const createToken = data => jwt.sign(data, TOKEN_SECRET, {
  expiresIn: TOKEN_EXPIRATION
});
export const salt = ()=> bcrypt.genSaltSync(12);

export const createHash = (password,salt) => bcrypt.hashSync(password, salt);
