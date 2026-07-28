import { Op } from 'sequelize';
import { SiteVisit } from '../models/siteVisit.model';

export default class SiteVisitService {
  static async register(path?: string) {
    return SiteVisit.create({ path: path || null });
  }

  static async countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return SiteVisit.count({
      where: {
        createdAt: { [Op.gte]: startOfDay },
      },
    });
  }
}
