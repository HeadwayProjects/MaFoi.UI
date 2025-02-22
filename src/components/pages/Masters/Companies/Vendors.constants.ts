import { IVendor } from "../../../../models/vendor";

export function GetVendorBreadcrumb(page: string) {
  return [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'vendors', label: 'Vendors', path: '/vendors/list' },
    { id: page, label: page }
  ]
}


export const VENDORT_REQUEST: IVendor = {
  vendorName: '',
  stateId: '',
  cityId: '',
  email_Address: '',
  mobile_Number: '',
  signature: '',
  designation: '',
  address: '',
  contact_Person_Name: '',
  regsitration_Certificate_No: '',
  pf_Registartion_No: '',
  esiC_No: '',
  contract_Labour_Licence_No: '',
  is_ACtive: false,
};

export const VENDOR_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}

export const VENDOR_STATUSES = [VENDOR_STATUS.ACTIVE, VENDOR_STATUS.INACTIVE];