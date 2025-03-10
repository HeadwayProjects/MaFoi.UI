import axios from "axios";
import * as api from "./request";

export class InputModuleService {

    // Companies 
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
    
    public async getStatesDetails(data: any) {
        const url = `/api/State/GetAll`
        return await api.post(url, data)
    }

    public async getActs(data: any) {
        const url = `/api/Act/GetAll`
        return await api.post(url, data)
    }

    public async getActivities(data: any) {
        const url = `/api/Activity/GetAll`
        return await api.post(url, data)
    }

    public async getRules(data: any) {
        const url = `/api/Rule/GetAll`
        return await api.post(url, data)
    }
    
    public async getForms(data: any) {
        const url = `/api/Mappings/GetActStateList`
        return await api.post(url, data)
    }

    public async getStateConfigurationDetails(fileUrl: any) {
        const url = `/api/StateRegisterConfiguration/GetStateConfigurationDetails?url=${fileUrl}`
        return await api.get(url)
    }


    //Employee Master uploads
    public async configUpload(data: any) {
        // const url = `/api/Configuration/upload`
            const url = `/api/Configuration/BulkUpload`
        return await api.post(url, data, null, true)
    }

    public async getColumns(type:string) {
        const url = `/api/Configuration/GetColumns?configurationType=${type}`
        return await api.get(url)
    }

    public async callExcelHeaderToDbColumns(data: any) {
        // const url = `/api/Configuration/ExcelHeaderToDBColumns`
         const url = `/api/Configuration/BulkExcelHeaderToDBColumns`
        return await api.post(url, data)
    }
    
    public async employeeUpload(data: any) {
        //const url = `/api/Configuration/UploadEmployeeMaster`
            const url = `/api/Configuration/BulkUploadEmployeeMaster`
        return await api.post(url, data, null, true)
    }
    
    public async employeeAttendanceUpload(data: any) {
            const url = `/api/Configuration/BulkUploadEmployeeAttendance`
        //const url = `/api/Configuration/UploadEmployeeAttendance`
        return await api.post(url, data, null, true)
    }

    public async employeeLeaveBalanceUpload(data: any) {
        //const url = `/api/Configuration/UploadEmployeeLeaveBalance`
         const url = `/api/Configuration/BulkUploadEmployeeLeaveBalance`
        return await api.post(url, data, null, true)
    }
    
    public async employeeLeaveAvailedUpload(data: any) {
         const url = `/api/Configuration/BulkUploadEmployeeLeaveAvailed`
        //const url = `/api/Configuration/UploadEmployeeLeaveAvailed`
        return await api.post(url, data, null, true)
    }

    public async employeeWageUpload(data: any) {
        
        const url = `/api/Configuration/BulkUploadEmployeeWage`
        //const url = `/api/Configuration/UploadEmployeeWage`
        return await api.post(url, data, null, true)
    }

    public async getInputModuleMappingDetails(data: any) {
        const url = `/api/Configuration/GetAll`
        return await api.post(url, data)
    }

    // Dashboard
    public async getEmployeeDashboardCounts(data: any) {
        const url = `/api/Dashboard/EmployeeDashboardCounts`
        return await api.post(url, data)
    }

    public async getEmployeeInputDashboard(data: any) {
        const url = `/api/Dashboard/EmployeeInputDashboard`
        return await api.post(url, data)
    }

    public async getEmployeeBackendCount(data: any) {
        const url = `/api/Dashboard/EmployeeBackendCount`
        return await api.post(url, data)
    }

    public async getErrorLogs(data: any) {
        const url = `/api/Configuration/GetInputErrorFileTransactions`
        return await api.post(url, data)
    }


    // Holidays list
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

    public async bulkDeleteHolidays(data: any) {
        const url = `/api/Holiday/BulkDelete`
        return await api.post(url, data)
    } 

    // Leave Configuration
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

    public async bulkDeleteLeaves(data: any) {
        const url = `/api/Leave/BulkDelete`
        return await api.post(url, data)
    } 

    // Attendance Configuration
    public async fetchAttendanceConfiguration(data: any) {
        const url = `/api/Attendance/GetAll`
        return await api.post(url, data)
    }

    public async deleteAttendanceConfiguration(id:any) {
        const url =  `/api/Attendance/Delete?Id=${id}`
        return await api.del(url)
    }

    public async addAttendanceConfiguration(data: any) {
        const url = `/api/Attendance/Add`
        return await api.post(url, data)
    }

    public async uploadAttendanceConfiguration(data: any) {
        const url = `/api/Attendance/Import`
        return await api.post(url, data, null, true, { responseType: 'blob' })
    }

    public async editAttendanceConfiguration(data: any) {
        const url = `/api/Attendance/Update`
        return await api.put(url, data)
    }

    public async bulkDeleteAttendance(data: any) {
        const url = `/api/Attendance/BulkDelete`
        return await api.post(url, data)
    } 

    // State Register
    public async fetchStateRegister(data: any) {
        const url = `/api/StateRegisterConfiguration/GetAll`
        return await api.post(url, data)
    }
    public async fetchStateRegisterDownload(data: any) {
        const url = `/api/StateRegister/GetAll`
        return await api.post(url, data)
    }
    public async fetchStateRegisterZipFileDownload(data: any) {
        const url = `/api/StateRegister/GetZipFileDownload`
        return await api.post(url, data)
    }

    public async addStateRegister(data: any) {
        const url = `/api/StateRegisterConfiguration/Add`
        return await api.post(url, data)
    }

    public async updateStateRegister(data: any) {
        const url = `/api/StateRegisterConfiguration/Update`
        return await api.post(url, data)
    }

       // State RegisterQue
       public async fetchStateRegisterQue(data: any) {
        const url = `/api/StateRegisterQue/GetAll`
        return await api.post(url, data)
    }
    public async fetchStateRegisterQueDownload(data: any) {
        const url = `/api/StateRegisterQue/GetAll`
        return await api.post(url, data)
    }
    public async fetchStateRegisterQueExcelandPdfDownload(data: any) {
        const url = `/api/StateRegister/GetExcelandPdfZipFileDownload`
        return await api.post(url, data)
    }

    public async addStateRegisterQue(data: any) {
        const url = `/api/StateRegisterConfiguration/Add`
        return await api.post(url, data)
    }

    public async updateStateRegisterQue(data: any) {
        const url = `/api/StateRegisterConfiguration/Update`
        return await api.post(url, data)
    }
    
    //Employee Master
    public async getEmployees(data: any) {
        const url = `/api/Employee/GetAll`
        return await api.post(url, data)
    }
    
    public async getEmployeesAttendance(data: any) {
        const url = `/api/Employee/GetAllEmployeeAttendance`
        return await api.post(url, data)
    }
    
    public async getEmployeesLeaveBalance(data: any) {
        const url = `/api/Employee/GetAllEmployeeLeaveBalance`
        return await api.post(url, data)
    }
    
    public async getEmployeesLeaveAvailed(data: any) {
        const url = `/api/Employee/GetAlEmployeeLeaveAvailed`
        return await api.post(url, data)
    }
    
    public async getEmployeesWage(data: any) {
        const url = `/api/Employee/GetAlEmployeeWage`
        return await api.post(url, data)
    }
    public async bulkDeleteEmployees(data: any) {
        const url = `/api/Employee/BulkDelete`
        return await api.post(url, data)
    }

    //Salary Components
    public async salaryComponentUpload(data: any) {
        const url = `/api/Configuration/UploadSalaryComponent`
        return await api.post(url, data, null, true)
    }

    public async salaryComponentConfigUpload(data: any) {
        const url = `/api/Configuration/SalaryComponentConfigurationUpload`
        return await api.post(url, data, null, true)
    }

    public async callSalaryComponentsExcelHeaderToDbColumns(data: any) {
        const url = `/api/Configuration/UpdateSalaryExcelHeadertoDBColumnsMap`
        return await api.post(url, data)
    }

    public async getSalaryComponentsDetails(data: any) {
        const url = `/api/Employee/GetAllSalaryComponent`
        return await api.post(url, data)
    }

    public async getSalaryComponentsMappingDetails(data: any) {
        const url = `/api/Configuration/GetSalaryConfigAll`
        return await api.post(url, data)
    }

    //leave credit 
    public async bulkDeleteLeaveBalance(data: any) {
        const url = `/api/Leave/EmployeeLeaveBalBulkDelete`
        return await api.post(url, data)
    }

    //leave availed

    public async bulkDeleteLeaveAvailed(data: any) {
        const url = `/api/Leave/EmployeeAvailedBulkDelete`
        return await api.post(url, data)
    }

    //Employee Attendance
    
    public async bulkDeleteEmployeeAttendance(data: any) {
        const url = `/api/Employee/EmployeeAttendanceBulkDelete`
        return await api.post(url, data)
    }

    // Employee Wage 
    public async bulkDeleteEmployeeWage(data: any) {
        const url = `/api/Employee/EmployeeWageBulkDelete`
        return await api.post(url, data)
    }


    
   //  state act rule activity mapping 
   public async deleteActStateMappingForm(id: any) {
    const url = `/api/ActStateMapping/DeleteForm?id=${id}`
    return await api.del(url) 
   }

   //delete state register comnfiguration mapping 
   public async deleteStateRegisterMapping(id:any) {

    const url =  `/api/StateRegisterConfiguration/Delete?Id=${id}`
    return await api.del(url)
}


   // Export State Register Mapping
   public async exportStateRegisterMapping(url: string) {
          const exportUrl = `/api/StateRegisterConfiguration/ExportStateRegisterMapping?url=${url}`
    //const exportUrl = `/api/StateRegisterConfiguration/ExportStateRegisterMapping?url=${encodeURIComponent(url)}`;
       //return await api.post(exporturl, null, null, true, { responseType: 'blob' })
  //  const response = await  api.post(exporturl, {}, { responseType: 'blob' });
    //return response.data; // This will be the blob
    //const response = await api.post(exportUrl, {}, { responseType: 'blob' });
    const response = await api.post(exportUrl, {}, null, true, { responseType: 'blob' })
    return response.data; // This will be the blob
}

  // import State Register Mapping
  public async importStateRegisterMapping(data: any) {
    const url = `/api/StateRegisterConfiguration/ImportStateRegisterConfigurationRequest`
    return await api.post(url, data, null, true,{ responseType: 'blob' })
}

  


}