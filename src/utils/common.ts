import dayjs from "dayjs";
import { hasUserAccess } from "../backend/auth";
import { ACTIVITY_STATUS } from "../components/common/Constants";
import { USER_PRIVILEGES } from "../components/pages/UserManagement/Roles/RoleConfiguration";
import { ACTIVITY_TYPE } from "./constants";

export function preventDefault(event: any) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export function getValue(obj: any, key: string, type?: any) {
  if (!obj || !key) {
    return null
  }
  let value = { ...obj };
  const keys = (key || '').split('.');
  keys.forEach(_key => {
    value = (value || {})[_key];
  });
  if (type === 'BOOLEAN') {
    return value === true ? 'Yes' : (value === false ? 'No' : '')
  }
  return value;
}

export function filterData(obj: any, _search: string, keys: any[]) {
  _search = _search.toLowerCase();
  return Boolean(keys.find(x => {
    return getValue(obj, x).toLowerCase().includes(_search);
  }));
}

export function MaskEmail(email: string) {
  return (email || '').replace(/^(.)(.*)(.@.*)$/,
    (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
}

export function download(fileName: string, filePath: string) {
  if (fileName && filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = "_blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function downloadFileContent({ name, type, content }: any) {
  const blob = new Blob([content], { type })
  const URL = window.URL || window.webkitURL;
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function reduceArraytoObj(arr: any[], key = 'columnName', value = 'value') {
  if ((arr || []).length === 0) {
    return {}
  }
  const _obj: any = {};
  (arr || []).forEach(obj => {
    _obj[obj[key]] = obj[value];
  });
  return _obj;
}

export function humanReadableFileSize(size: number) {
  var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return ((size / Math.pow(1024, i)).toFixed(2) as any) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export function humanReadableNumber(number: number) {
  // var i = number === 0 ? 0 : Math.floor(Math.log(number) / Math.log(1000));
  // return (number / Math.pow(1000, i)).toFixed(2) * 1 + ' ' + ['', 'K'][i];
  return number < 1000 ? number : `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getMinMonthYear() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 5);
  date.setMonth(3);
  date.setDate(1);
  return date;
}

export function getMaxMonthYear() {
  const date = new Date();
  const month = date.getMonth();
  if (month > 2) {
    date.setFullYear(date.getFullYear() + 1);
  }
  date.setMonth(2);
  date.setDate(31);
  return date;
}

export function checkVendorActivityStatus(activity: any) {
  if (!hasUserAccess(USER_PRIVILEGES.SUBMITTER_ACTIVITIES_UPLOAD)) {
    return { editable: false }
  }
  const dueDate = new Date(activity.dueDate);
  dueDate.setHours(23);
  dueDate.setMinutes(59);
  dueDate.setSeconds(59);
  dueDate.setMilliseconds(999);
  if (activity.published) {
    return {
      editable: false
    }
  }
  if (activity.auditted !== ACTIVITY_TYPE.AUDIT) {
    return {
      editable: false,
      type: 'warning',
      message: `This activity is for ${activity.auditted}. You are not allowed to edit this activity.`
    }
  }
  if (activity.status === ACTIVITY_STATUS.PENDING) {
    return { editable: true };
  }

  if (activity.status === ACTIVITY_STATUS.ACTIVITY_SAVED) {
    if (new Date() < dueDate) {
      return { editable: true }
    } else {
      return {
        editable: false,
        type: 'warning',
        message: 'This activity is expired. No further edits allowed.'
      }
    }
  }

  if (activity.status === ACTIVITY_STATUS.OVERDUE) {
    return {
      editable: false,
      type: 'danger',
      message: `This activity is expired and cannot be edited further. Contact Admin to extend the due date.`
    }
  }

  if (activity.status === ACTIVITY_STATUS.SUBMITTED) {
    return {
      editable: false,
      type: 'success',
      message: 'Congatulations! This activity is submitted for Auditting.'
    }
  }

  if (activity.status === ACTIVITY_STATUS.AUDITED) {
    return {
      editable: false,
      type: 'success',
      message: 'Congatulations! This activity is Approved.'
    }
  }

  if (activity.status === ACTIVITY_STATUS.REJECTED) {
    if (activity.lock) {
      return {
        editable: false,
        type: 'danger',
        message: 'Oops! This activity is rejected for not meeting the expected compliance.'
      }
    } else {
      if (new Date() < dueDate) {
        return {
          editable: true,
          type: 'warning',
          message: 'This activity is Rejected. However, you are requested by the Auditor to update and resubmit the form.'
        }
      } else {
        return {
          editable: false,
          type: 'danger',
          message: 'Oops! This activity is rejected and the resubmission request expired.'
        }
      }
    }
  }
  return { editable: false }
}

export function checkAuditorActivityStatus(activity: any) {
  if (!hasUserAccess(USER_PRIVILEGES.REVIEWER_ACTIVITIES_AUDIT)) {
    return { editable: false };
  }
  const { auditted: auditType, status, published } = activity || {};
  if (published) {
    return {
      editable: false,
      message: 'This activity is publised. No modifications allowed. Download audit report for more details.',
      type: 'info'
    }
  }
  if (auditType === ACTIVITY_TYPE.NO_AUDIT) {
    return {
      editable: false,
      type: 'info',
      message: `This activity doesn't required any action.`
    };
  } else if (auditType === ACTIVITY_TYPE.AUDIT) {
    if (status === ACTIVITY_STATUS.AUDITED) {
      return {
        editable: false,
        type: 'success',
        message: 'This activity is approved. No modifications allowed.'
      }
    } else if (status === ACTIVITY_STATUS.REJECTED) {
      return {
        editable: true,
        message: 'This activity is rejected and waiting for user confirmation',
        type: 'warning'
      }
    } else if (status === ACTIVITY_STATUS.SUBMITTED) {
      return {
        editable: true
      }
    }
  } else if (auditType === ACTIVITY_TYPE.PHYSICAL_AUDIT) {
    // if (status === ACTIVITY_STATUS.AUDITED) {
    //   return {
    //     editable: false,
    //     type: 'success',
    //     message: 'This activity is approved. No modifications allowed.'
    //   }
    // } else if (status === ACTIVITY_STATUS.REJECTED) {
    //   return {
    //     editable: false,
    //     type: 'danger',
    //     message: 'This activity is rejected. No modifications allowed.'
    //   }
    // } else if (status === ACTIVITY_STATUS.SUBMITTED || status === ACTIVITY_STATUS.OVERDUE) {
    //   return {
    //     editable: true
    //   }
    // }
    return {
      editable: true
    }
  }
  return {
    editable: false
  }
}

export function copyArray(arr: any[]) {
  if ((arr || []).length === 0) {
    return [];
  }
  return JSON.parse(JSON.stringify(arr));
}

export function copyObject(obj: any) {
  if (!obj) {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
}

export function toBackendDateFormat(date: Date) {
  if (!date) return null;
  // return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
  return dayjs(date).local().toISOString();
}