import * as api from "./request";

export class InputModuleService {

    public async fetchCompaniesDetails(data: any) {
        const url = `/api/Company/GetAll`
        return await api.post(url, data);
    }

    public async fetchAssociateCompaniesDetails(data: any) {
        const url = `/api/Company/GetAll`
        return await api.post(url, data);
    }

    public async getLocations(data: any) {
        const url = `/api/Mappings/GetCompanyLocations`
        return await api.post(url, data)
    }
    
    public async fetchHolidaysList(data: any) {
        const url = `/api/Holiday/GetAll`
        return await api.post(url, data)
    }
}