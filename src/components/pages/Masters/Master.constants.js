export function GetMastersBreadcrumb(page) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'masters', label: 'Masters', path: '/masters/act' },
        { id: page, label: page }
    ]
}

export const RuleType = [
    { id: 'S', name: 'State' },
    { id: 'C', name: 'Central' }
];