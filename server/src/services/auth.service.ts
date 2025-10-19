import { Admin } from '../models/admin.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';

export default class AuthService {
  static async login(email: string, password: string) {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return null;

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return null;

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
}