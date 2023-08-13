export function GetComplianceBreadcrumb(page: string) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'compliance', label: 'Compliance Management', path: '/compliance/schedule' },
        { id: page, label: page }
    ]
}