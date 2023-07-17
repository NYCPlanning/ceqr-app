import Component from '@glimmer/component';
import ENV from 'labs-ceqr/config/environment';

const MAINTENANCE_RANGE = ENV.maintenanceTimes;
const [start, end] = MAINTENANCE_RANGE.map((string) => new Date(string));

const userReadableTime = function (time) {
  return time.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

export default class MaintenanceNoticeComponent extends Component {
  get maintenanceStart() {
    return userReadableTime(start);
  }

  get maintenanceEnd() {
    return userReadableTime(end);
  }

  get hasUpcomingMaintenance() {
    const now = new Date();

    return now < start;
  }

  get isMaintenancePeriod() {
    const now = new Date();

    return now > start && now < end;
  }
}
