import { Logger } from './logger';
import { IDashboardManagerConfig } from '@csnext/cs-core';

// TODO Is this the correct name, since it only stores a reference to existing dashboard managers, and doesn't do any management.
export class DashboardManager {
  // TODO Make private (only reference is in the csdashboard.ts)
  /** Available dashboard managers for layouting */
  public static dashboardManagers: { [id: string]: IDashboardManagerConfig } = {};

  /** Registration of a new dashboard manager */
  public static add(manager: IDashboardManagerConfig) {
    const managers = DashboardManager.dashboardManagers;
    if (managers && !managers.hasOwnProperty(manager.id)) {
      Logger.info('dashboard manager', 'added ' + manager.id);
      DashboardManager.dashboardManagers[manager.id] = manager;
    }
  }
}
