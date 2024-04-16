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

    public async deleteHoliday(id:any) {
        const url =  `/api/Holiday/Delete?Id=${id}`
        return await api.del(url)
    }

    public async addHoliday(data: any) {
        const url = `/api/Holiday/Add`
        return await api.post(url, data)
    }

    public async uploadHoliday(data: any) {
        const url = `/api/Holiday/Import`
        return await api.post(url, data, null, true, { responseType: 'blob' })
    }

    public async editHoliday(data: any) {
        const url = `/api/Holiday/Update`
        return await api.put(url, data)
    }

    public async fetchLeaveConfiguration(data: any) {
        const url = `/api/Leave/GetAll`
        return await api.post(url, data)
    }

    public async deleteLeaveConfiguration(id:any) {
        const url =  `/api/Leave/Delete?Id=${id}`
        return await api.del(url)
    }

    public async addLeaveConfiguration(data: any) {
        const url = `/api/Leave/Add`
        return await api.post(url, data)
    }

    public async uploadLeaveConfiguration(data: any) {
        const url = `/api/Leave/Import`
        return await api.post(url, data, null, true, { responseType: 'blob' })
    }

    public async editLeaveConfiguration(data: any) {
        const url = `/api/Leave/Update`
        return await api.put(url, data)
    }
}