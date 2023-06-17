import { ACTIVITY_STATUS } from "../components/common/Constants";
import { ACTIVITY_TYPE } from "./constants";

export function preventDefault(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export function getValue(obj, key) {
  if (!obj || !key) {
    return null
  }
  let value = { ...obj };
  const keys = (key || '').split('.');
  keys.forEach(_key => {
    value = (value || {})[_key];
  });
  return value;
}

export function filterData(obj, _search, keys) {
  _search = _search.toLowerCase();
  return Boolean(keys.find(x => {
    return getValue(obj, x).toLowerCase().includes(_search);
  }));
}

export function MaskEmail(email) {
  return (email || '').replace(/^(.)(.*)(.@.*)$/,
    (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
}

export function download(fileName, filePath) {
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

export function downloadFileContent({ name, type, content }) {
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

export function reduceArraytoObj(arr, key = 'columnName', value = 'value') {
  if ((arr || []).length === 0) {
    return {}
  }
  const _obj = {};
  (arr || []).forEach(obj => {
    _obj[obj[key]] = obj[value];
  });
  return _obj;
}

export function humanReadableFileSize(size) {
  var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
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

export function checkVendorActivityStatus(activity) {
  const dueDate = new Date(activity.dueDate);
  dueDate.setHours(23);
  dueDate.setMinutes(59);
  dueDate.setSeconds(59);
  dueDate.setMilliseconds(999);
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
        message: 'This acivity is expired. No further edits allowed.'
      }
    }
  }

  if (activity.status === ACTIVITY_STATUS.OVERDUE) {
    return {
      editable: false,
      type: 'danger',
      message: `This acivity is expired and cannot be edited further. Contact Admin to extend the due date.`
    }
  }

  if (activity.status === ACTIVITY_STATUS.SUBMITTED) {
    return {
      editable: false,
      type: 'success',
      message: 'Congatulations! This acivity is submitted for Auditting.'
    }
  }

  if (activity.status === ACTIVITY_STATUS.AUDITED) {
    return {
      editable: false,
      type: 'success',
      message: 'Congatulations! This acivity is Approved.'
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

export function checkAuditorActivityStatus(activity) {
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