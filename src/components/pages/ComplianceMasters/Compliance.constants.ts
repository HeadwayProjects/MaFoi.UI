export function GetComplianceBreadcrumb(page: string) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'compliance', label: 'Compliance Management', path: '/complianceManagement/complianceSchedule' },
        { id: page, label: page }
    ]
}