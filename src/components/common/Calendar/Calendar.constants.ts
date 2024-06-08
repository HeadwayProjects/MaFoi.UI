export enum CalendarType {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month'
}

export type CalendarProps = {
    type?: CalendarType,
    minDate?: Date,
    maxDate?: Date,
    selectedDate?: any;
    data?: { styleClass?: string, count?: number, date?: Date }[],
    handleChange?: any;
    onDateSelection?: any;
}