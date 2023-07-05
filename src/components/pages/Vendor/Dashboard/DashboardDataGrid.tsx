import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { sortBy } from "underscore";
import Todo from "./ToDo";
import ActivitiesByStatus from "./ActivitiesByStatus";
import ActivityPerformance from "./ActivityPerformance";
import { useGetUserCompanies } from "../../../../backend/query";

function DashboardDataGrid() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [company, setCompany] = useState<any>(null);
    const [associateCompany, setAssociateCompany] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);
    const { userCompanies, isFetching } = useGetUserCompanies();

    useEffect(() => {
        setAssociateCompanies([]);
        setLocations([]);
        setAssociateCompany(null);
        setLocation(null);
        if (company) {
            const associateCompanies = (company.company.associateCompanies || []).map((associateCompany: any) => {
                return {
                    label: associateCompany.associateCompany.name,
                    value: associateCompany.associateCompany.id,
                    associateCompany: associateCompany.associateCompany,
                    locations: associateCompany.locations
                };
            });
            const sorted = sortBy(associateCompanies, 'label');
            setAssociateCompanies(sorted);
            setAssociateCompany((sorted || [])[0] || null);
        }
    }, [company]);

    useEffect(() => {
        setLocations([]);
        setLocation(null);
        if (associateCompany) {
            const locations = (associateCompany.locations || []).map((location: any) => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
            setLocation((sorted || [])[0] || null);
        }
    }, [associateCompany])


    useEffect(() => {
        if (!isFetching && userCompanies) {
            const companies = userCompanies.map((company: any) => {
                return { value: company.id, label: company.name, company }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies(sorted);
            setCompany(sorted[0]);
        }
    }, [isFetching])

    return (
        <div>
            <div className="my-3 row m-0 filters">
                <div className="col-12">
                    <div className="d-flex flex-row card shadow m-0">
                        <div className="p-2">
                            <label className="filter-label"><small>Company</small></label>
                            <Select options={companies} onChange={setCompany}
                                placeholder='Company' value={company} className="select-control" />
                        </div>
                        <div className="p-2">
                            <label className="filter-label"><small>Associate Company</small></label>
                            <Select options={associateCompanies} onChange={setAssociateCompany}
                                placeholder='Associate Company' value={associateCompany} className="select-control" />
                        </div>
                        <div className="p-2">
                            <label className="filter-label"><small>Location</small></label>
                            <Select options={locations} onChange={setLocation}
                                placeholder='Location' value={location} className="select-control" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row m-0">
                <div className="col-md-12">
                    {/* Current Performance */}
                    <ActivityPerformance current={true} selectedCompany={(company || {}).value} selectedLocation={(location || {}).value}
                        selectedAssociateCompany={(associateCompany || {}).value} />
                </div>
            </div>
            <div className="row m-0 mt-4">
                <div className="col-md-6">
                    {/* To-Do */}
                    <Todo upcoming={false} selectedCompany={(company || {}).value} selectedLocation={(location || {}).value}
                        selectedAssociateCompany={(associateCompany || {}).value} />
                </div>
                <div className="col-md-6">
                    {/* Upcomiing */}
                    <Todo upcoming={true} selectedCompany={(company || {}).value} selectedLocation={(location || {}).value}
                        selectedAssociateCompany={(associateCompany || {}).value} />
                </div>
            </div>
            <div className="row m-0 mt-4">
                <div className="col-md-6">
                    {/* Overdue and Pending */}
                    <ActivitiesByStatus tabs={['Overdue', 'Pending']} selectedCompany={(company || {}).value} selectedLocation={(location || {}).value}
                        selectedAssociateCompany={(associateCompany || {}).value}>
                        <span className="mx-2">
                            <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.4921 12.5835C18.1221 12.5835 14.5834 16.1302 14.5834 20.5002C14.5834 24.8702 18.1221 28.4168 22.4921 28.4168C26.87 28.4168 30.4167 24.8702 30.4167 20.5002C30.4167 16.1302 26.87 12.5835 22.4921 12.5835ZM25.1046 24.2289L21.7084 20.8247V16.5418H23.2917V20.1756L26.2288 23.1127L25.1046 24.2289Z" fill="#2965AD" />
                                <mask id="path-2-inside-1_633_4157" fill="white">
                                    <rect width="17.6604" height="22.566" rx="0.3" />
                                </mask>
                                <rect width="17.6604" height="22.566" rx="0.3" stroke="#2965AD" strokeWidth="4" mask="url(#path-2-inside-1_633_4157)" />
                                <path d="M7.35833 10.0569C7.35833 10.3468 7.30123 10.6338 7.19029 10.9017C7.07935 11.1695 6.91675 11.4128 6.71176 11.6178C6.50677 11.8228 6.26341 11.9854 5.99558 12.0964C5.72774 12.2073 5.44068 12.2644 5.15078 12.2644C4.86089 12.2644 4.57382 12.2073 4.30599 12.0964C4.03816 11.9854 3.7948 11.8228 3.58981 11.6178C3.38482 11.4128 3.22222 11.1695 3.11128 10.9017C3.00034 10.6338 2.94324 10.3468 2.94324 10.0569C2.94324 9.47138 3.17582 8.90989 3.58981 8.49589C4.00381 8.0819 4.56531 7.84931 5.15078 7.84931C5.73626 7.84931 6.29776 8.0819 6.71176 8.49589C7.12575 8.90989 7.35833 9.47138 7.35833 10.0569ZM6.13192 10.0569C6.13192 9.79665 6.02855 9.5471 5.84455 9.3631C5.66055 9.1791 5.411 9.07573 5.15078 9.07573C4.89057 9.07573 4.64102 9.1791 4.45702 9.3631C4.27302 9.5471 4.16965 9.79665 4.16965 10.0569C4.16965 10.3171 4.27302 10.5666 4.45702 10.7506C4.64102 10.9346 4.89057 11.038 5.15078 11.038C5.411 11.038 5.66055 10.9346 5.84455 10.7506C6.02855 10.5666 6.13192 10.3171 6.13192 10.0569ZM5.15078 17.6606C5.73626 17.6606 6.29776 17.4281 6.71176 17.0141C7.12575 16.6001 7.35833 16.0386 7.35833 15.4531C7.35833 14.8676 7.12575 14.3061 6.71176 13.8921C6.29776 13.4781 5.73626 13.2455 5.15078 13.2455C4.56531 13.2455 4.00381 13.4781 3.58981 13.8921C3.17582 14.3061 2.94324 14.8676 2.94324 15.4531C2.94324 16.0386 3.17582 16.6001 3.58981 17.0141C4.00381 17.4281 4.56531 17.6606 5.15078 17.6606ZM5.15078 16.4342C4.89057 16.4342 4.64102 16.3309 4.45702 16.1469C4.27302 15.9629 4.16965 15.7133 4.16965 15.4531C4.16965 15.1929 4.27302 14.9433 4.45702 14.7593C4.64102 14.5753 4.89057 14.472 5.15078 14.472C5.411 14.472 5.66055 14.5753 5.84455 14.7593C6.02855 14.9433 6.13192 15.1929 6.13192 15.4531C6.13192 15.7133 6.02855 15.9629 5.84455 16.1469C5.66055 16.3309 5.411 16.4342 5.15078 16.4342ZM3.55644 5.39648C3.39381 5.39648 3.23784 5.46109 3.12284 5.57609C3.00784 5.69109 2.94324 5.84706 2.94324 6.00969C2.94324 6.17232 3.00784 6.3283 3.12284 6.4433C3.23784 6.55829 3.39381 6.6229 3.55644 6.6229H14.1036C14.2662 6.6229 14.4222 6.55829 14.5372 6.4433C14.6522 6.3283 14.7168 6.17232 14.7168 6.00969C14.7168 5.84706 14.6522 5.69109 14.5372 5.57609C14.4222 5.46109 14.2662 5.39648 14.1036 5.39648H3.55644ZM8.33946 10.1795C8.33946 9.84101 8.61418 9.5663 8.95267 9.5663H14.1036C14.2662 9.5663 14.4222 9.6309 14.5372 9.7459C14.6522 9.8609 14.7168 10.0169 14.7168 10.1795C14.7168 10.3421 14.6522 10.4981 14.5372 10.6131C14.4222 10.7281 14.2662 10.7927 14.1036 10.7927H8.95267C8.61418 10.7927 8.33946 10.518 8.33946 10.1795ZM8.95267 14.7172C8.79004 14.7172 8.63407 14.7818 8.51907 14.8968C8.40407 15.0118 8.33946 15.1678 8.33946 15.3304C8.33946 15.4931 8.40407 15.6491 8.51907 15.7641C8.63407 15.879 8.79004 15.9437 8.95267 15.9437H14.1036C14.2662 15.9437 14.4222 15.879 14.5372 15.7641C14.6522 15.6491 14.7168 15.4931 14.7168 15.3304C14.7168 15.1678 14.6522 15.0118 14.5372 14.8968C14.4222 14.7818 14.2662 14.7172 14.1036 14.7172H8.95267Z" fill="#2965AD" />
                            </svg>

                        </span>
                    </ActivitiesByStatus>
                </div>
                <div className="col-md-6">
                    {/* Rejected and Audited */}
                    <ActivitiesByStatus tabs={['Rejected', 'Approved']} selectedCompany={(company || {}).value} selectedLocation={(location || {}).value}
                        selectedAssociateCompany={(associateCompany || {}).value}>
                        <span className="mx-2">
                            <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.5 12.7812C20.9734 12.7812 19.481 13.2339 18.2117 14.0821C16.9424 14.9302 15.953 16.1357 15.3688 17.5462C14.7846 18.9566 14.6317 20.5086 14.9296 22.0059C15.2274 23.5031 15.9625 24.8785 17.042 25.958C18.1215 27.0375 19.4969 27.7726 20.9942 28.0704C22.4914 28.3683 24.0434 28.2154 25.4538 27.6312C26.8643 27.047 28.0698 26.0576 28.9179 24.7883C29.7661 23.519 30.2188 22.0266 30.2188 20.5C30.2166 18.4535 29.4027 16.4915 27.9556 15.0444C26.5085 13.5973 24.5465 12.7834 22.5 12.7812ZM25.2951 22.4549C25.3502 22.5101 25.394 22.5756 25.4239 22.6477C25.4537 22.7197 25.4691 22.797 25.4691 22.875C25.4691 22.953 25.4537 23.0303 25.4239 23.1023C25.394 23.1744 25.3502 23.2399 25.2951 23.2951C25.2399 23.3502 25.1744 23.394 25.1023 23.4239C25.0303 23.4537 24.953 23.4691 24.875 23.4691C24.797 23.4691 24.7197 23.4537 24.6477 23.4239C24.5756 23.394 24.5101 23.3502 24.4549 23.2951L22.5 21.3394L20.5451 23.2951C20.4899 23.3502 20.4244 23.394 20.3523 23.4239C20.2803 23.4537 20.203 23.4691 20.125 23.4691C20.047 23.4691 19.9697 23.4537 19.8977 23.4239C19.8256 23.394 19.7601 23.3502 19.7049 23.2951C19.6498 23.2399 19.606 23.1744 19.5761 23.1023C19.5463 23.0303 19.5309 22.953 19.5309 22.875C19.5309 22.797 19.5463 22.7197 19.5761 22.6477C19.606 22.5756 19.6498 22.5101 19.7049 22.4549L21.6606 20.5L19.7049 18.5451C19.5935 18.4337 19.5309 18.2826 19.5309 18.125C19.5309 17.9674 19.5935 17.8163 19.7049 17.7049C19.8163 17.5935 19.9674 17.5309 20.125 17.5309C20.2826 17.5309 20.4337 17.5935 20.5451 17.7049L22.5 19.6606L24.4549 17.7049C24.5101 17.6498 24.5756 17.606 24.6477 17.5761C24.7197 17.5463 24.797 17.5309 24.875 17.5309C24.953 17.5309 25.0303 17.5463 25.1023 17.5761C25.1744 17.606 25.2399 17.6498 25.2951 17.7049C25.3502 17.7601 25.394 17.8256 25.4239 17.8977C25.4537 17.9697 25.4691 18.047 25.4691 18.125C25.4691 18.203 25.4537 18.2803 25.4239 18.3523C25.394 18.4244 25.3502 18.4899 25.2951 18.5451L23.3394 20.5L25.2951 22.4549Z" fill="#2965AD" />
                                <mask id="path-2-inside-1_633_4180" fill="white">
                                    <rect width="17.6604" height="22.566" rx="0.3" />
                                </mask>
                                <rect width="17.6604" height="22.566" rx="0.3" stroke="#2965AD" strokeWidth="4" mask="url(#path-2-inside-1_633_4180)" />
                                <path d="M7.35833 10.0569C7.35833 10.3468 7.30123 10.6338 7.19029 10.9017C7.07935 11.1695 6.91675 11.4128 6.71176 11.6178C6.50677 11.8228 6.26341 11.9854 5.99558 12.0964C5.72774 12.2073 5.44068 12.2644 5.15078 12.2644C4.86089 12.2644 4.57382 12.2073 4.30599 12.0964C4.03816 11.9854 3.7948 11.8228 3.58981 11.6178C3.38482 11.4128 3.22222 11.1695 3.11128 10.9017C3.00034 10.6338 2.94324 10.3468 2.94324 10.0569C2.94324 9.47138 3.17582 8.90989 3.58981 8.49589C4.00381 8.0819 4.56531 7.84931 5.15078 7.84931C5.73626 7.84931 6.29776 8.0819 6.71176 8.49589C7.12575 8.90989 7.35833 9.47138 7.35833 10.0569ZM6.13192 10.0569C6.13192 9.79665 6.02855 9.5471 5.84455 9.3631C5.66055 9.1791 5.411 9.07573 5.15078 9.07573C4.89057 9.07573 4.64102 9.1791 4.45702 9.3631C4.27302 9.5471 4.16965 9.79665 4.16965 10.0569C4.16965 10.3171 4.27302 10.5666 4.45702 10.7506C4.64102 10.9346 4.89057 11.038 5.15078 11.038C5.411 11.038 5.66055 10.9346 5.84455 10.7506C6.02855 10.5666 6.13192 10.3171 6.13192 10.0569ZM5.15078 17.6606C5.73626 17.6606 6.29776 17.4281 6.71176 17.0141C7.12575 16.6001 7.35833 16.0386 7.35833 15.4531C7.35833 14.8676 7.12575 14.3061 6.71176 13.8921C6.29776 13.4781 5.73626 13.2455 5.15078 13.2455C4.56531 13.2455 4.00381 13.4781 3.58981 13.8921C3.17582 14.3061 2.94324 14.8676 2.94324 15.4531C2.94324 16.0386 3.17582 16.6001 3.58981 17.0141C4.00381 17.4281 4.56531 17.6606 5.15078 17.6606ZM5.15078 16.4342C4.89057 16.4342 4.64102 16.3309 4.45702 16.1469C4.27302 15.9629 4.16965 15.7133 4.16965 15.4531C4.16965 15.1929 4.27302 14.9433 4.45702 14.7593C4.64102 14.5753 4.89057 14.472 5.15078 14.472C5.411 14.472 5.66055 14.5753 5.84455 14.7593C6.02855 14.9433 6.13192 15.1929 6.13192 15.4531C6.13192 15.7133 6.02855 15.9629 5.84455 16.1469C5.66055 16.3309 5.411 16.4342 5.15078 16.4342ZM3.55644 5.39648C3.39381 5.39648 3.23784 5.46109 3.12284 5.57609C3.00784 5.69109 2.94324 5.84706 2.94324 6.00969C2.94324 6.17232 3.00784 6.3283 3.12284 6.4433C3.23784 6.55829 3.39381 6.6229 3.55644 6.6229H14.1036C14.2662 6.6229 14.4222 6.55829 14.5372 6.4433C14.6522 6.3283 14.7168 6.17232 14.7168 6.00969C14.7168 5.84706 14.6522 5.69109 14.5372 5.57609C14.4222 5.46109 14.2662 5.39648 14.1036 5.39648H3.55644ZM8.33946 10.1795C8.33946 9.84101 8.61418 9.5663 8.95267 9.5663H14.1036C14.2662 9.5663 14.4222 9.6309 14.5372 9.7459C14.6522 9.8609 14.7168 10.0169 14.7168 10.1795C14.7168 10.3421 14.6522 10.4981 14.5372 10.6131C14.4222 10.7281 14.2662 10.7927 14.1036 10.7927H8.95267C8.61418 10.7927 8.33946 10.518 8.33946 10.1795ZM8.95267 14.7172C8.79004 14.7172 8.63407 14.7818 8.51907 14.8968C8.40407 15.0118 8.33946 15.1678 8.33946 15.3304C8.33946 15.4931 8.40407 15.6491 8.51907 15.7641C8.63407 15.879 8.79004 15.9437 8.95267 15.9437H14.1036C14.2662 15.9437 14.4222 15.879 14.5372 15.7641C14.6522 15.6491 14.7168 15.4931 14.7168 15.3304C14.7168 15.1678 14.6522 15.0118 14.5372 14.8968C14.4222 14.7818 14.2662 14.7172 14.1036 14.7172H8.95267Z" fill="#2965AD" />
                            </svg>
                        </span>
                    </ActivitiesByStatus>
                </div>
            </div>
        </div>
    );

}

export default DashboardDataGrid;
