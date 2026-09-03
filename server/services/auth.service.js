import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import * as usersRepository from '../repositories/users.repository';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export async function register({ username, email, password, role, display_name, phone }) {
  if (!username || !email || !password) {
    const err = new Error('Username, email, and password are required');
    err.status = 400;
    throw err;
  }

  // Only allow buyer or seller — admin accounts are created via seed/migration only
  const ALLOWED_ROLES = ['buyer', 'seller'];
  const safeRole = ALLOWED_ROLES.includes(role) ? role : 'buyer';

  const existingEmail = await usersRepository.findByEmail(email);
  if (existingEmail) {
    const err = new Error('Email is already registered');
    err.status = 409;
    throw err;
  }

  const existingUsername = await usersRepository.findByUsername(username);
  if (existingUsername) {
    const err = new Error('Username is already taken');
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await usersRepository.create({
    username,
    email,
    password_hash,
    role: safeRole,
    display_name,
    phone,
  });

  const token = generateToken(user);
  return { token, user };
}

export async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  const user = await usersRepository.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  // Strip password_hash before returning
  const { password_hash, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { token, user: safeUser };
}
