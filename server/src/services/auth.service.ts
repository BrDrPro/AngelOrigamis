import { Admin } from '../models/admin.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

export default class AuthService {
  static async login(email: string, password: string) {
    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) return null;

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) return null;

      const token = jwt.sign(
        { id: admin.id, email: admin.email }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      return { token };
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  }
}