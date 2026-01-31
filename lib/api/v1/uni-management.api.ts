import { apiClient } from "@/lib/config/client";
import { DepartmentResponse, FacultyResponse } from "@/lib/types/v1.response.types";

export const uniManagementApi = {
    getAllFaculties: (page: number, limit: number) => apiClient.getPaginated<FacultyResponse>(`/v1/uni-management/faculty?page=${page}&limit=${limit}`),
    getAllDepartments: (page: number, limit: number, facultyId?: string) => apiClient.getPaginated<DepartmentResponse>(`/v1/uni-management/department?page=${page}&limit=${limit}${facultyId ? `&facultyId=${facultyId}` : ''}`),
}