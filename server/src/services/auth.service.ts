import { Admin } from '../models/admin.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtSecret';
import { isLockedOut, registerFailedAttempt, clearAttempts } from '../utils/loginAttempts';

export default class AuthService {
  static async login(email: string, password: string) {
    if (isLockedOut(email)) {
      return 'locked' as const;
    }

    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        registerFailedAttempt(email);
        return null;
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        registerFailedAttempt(email);
        return null;
      }

      clearAttempts(email);

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

  static async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const admin = await Admin.findByPk(adminId);
    if (!admin) return false;

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return false;

    const hashed = await bcrypt.hash(newPassword, 10);
    await admin.update({ password: hashed });
    return true;
  }

  static async updateName(adminId: number, name: string) {
    const admin = await Admin.findByPk(adminId);
    if (!admin) return null;

    await admin.update({ name });
    return admin;
  }
}