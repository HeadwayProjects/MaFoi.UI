export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong! Please try again.',
    ERROR: 'Error!!!',
    UPLOAD_FILE: 'Error in uploading',
    DUPLICATE: 'DUPLICATE'
};

export const API_RESULT = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
};

export const STEPPER_CONFIG = {
    completeColor: 'var(--light-green)',
    activeColor: 'var(--royal-blue)'
}

export const ACTIVITY_TYPE = {
    AUDIT: 'Audit',
    NO_AUDIT: 'No Audit',
    PHYSICAL_AUDIT: 'Physical Audit'
}

export const ACTIVITY_TYPE_ICONS = {
    [ACTIVITY_TYPE.AUDIT]: 'audit',
    [ACTIVITY_TYPE.PHYSICAL_AUDIT]: 'physical-audit',
    [ACTIVITY_TYPE.NO_AUDIT]: 'no-audit'
}

export const UI_DELIMITER = ', ';
export const API_DELIMITER = ';';
export const DEBOUNCE_TIME = 750; // Milliseconds