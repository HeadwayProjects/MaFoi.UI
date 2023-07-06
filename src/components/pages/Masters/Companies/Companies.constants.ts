export function GetCompaniesBreadcrumb(page: string) {
    return [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'companies', label: 'Companies', path: '/companies/list' },
        { id: page, label: page }
    ]
}


export const COMPANY_REQUEST = {
    code: '',
    datePosted: '0001-01-01T00:00:00',
    name: '',
    logo: '',
    email: '',
    contactNumber: '',
    companyType: '',
    businessType: '',
    pan: '',
    ccEmailAlert: '',
    tan: '',
    websiteUrl: '',
    companyAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonDesignation: '',
    contactPersonMobile: '',
    establishmentType: '',
    pF_Ac_No: '',
    pF_Establishment_Code: '',
    pF_Deduction_Percent: '',
    pF_Base_Limit: '',
    pF_Establishment_Id: '',
    esiC_Ac_No: '',
    esiC_CutOff_Limit: '',
    esiC_Deduction_Percent: '',
    esiC_Contribution: '',
    esiC_FullName: '',
    esiC_Designation: '',
    esiC_Place: '',
    parentCompanyId: '',
    isParent: false,
    isActive: false,
    isCopied: '',
    pan_fullname: '',
    pan_surname: '',
    pan_designation: '',
    pan_mobile: '',
    pan_email: '',
    pan_place: '',
    gstn_no: ''
};

export const COMPANY_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
}

export const BUSINESS_TYPES = ['IT', 'ITES', 'NonIT'];
export const COMPANY_STATUSES = [COMPANY_STATUS.ACTIVE, COMPANY_STATUS.INACTIVE];