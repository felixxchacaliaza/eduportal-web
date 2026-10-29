import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { GradeSection, Section, Classroom } from '../models/interfaces/grade-section.interface';
import { ApiResponse } from '../models/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GradeSectionService {
  private readonly http = inject(HttpClient);

  public async getGradeSections(params?: { academicYear?: string; grade?: string; enabled?: boolean }): Promise<GradeSection[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<GradeSection[]> | GradeSection[]>(API_ENDPOINTS.gradeSections, { params: params as any })
    );
    return Array.isArray(res) ? res : res.data;
  }

  public async getSections(): Promise<Section[]> {
    const res = await firstValueFrom(this.http.get<ApiResponse<Section[]> | Section[]>(API_ENDPOINTS.sections));
    return Array.isArray(res) ? res : res.data;
  }

  public async getClassrooms(): Promise<Classroom[]> {
    const res = await firstValueFrom(this.http.get<ApiResponse<Classroom[]> | Classroom[]>(API_ENDPOINTS.classrooms));
    return Array.isArray(res) ? res : res.data;
  }

  public async createGradeSection(payload: Partial<GradeSection>): Promise<GradeSection> {
    const res = await firstValueFrom(this.http.post<ApiResponse<GradeSection> | GradeSection>(API_ENDPOINTS.gradeSections, payload));
    return (res as ApiResponse<GradeSection>).data || (res as GradeSection);
  }

  public async updateGradeSection(id: string, payload: Partial<GradeSection>): Promise<GradeSection> {
    const res = await firstValueFrom(this.http.put<ApiResponse<GradeSection> | GradeSection>(`${API_ENDPOINTS.gradeSections}/${id}`, payload));
    return (res as ApiResponse<GradeSection>).data || (res as GradeSection);
  }

  public async deleteGradeSection(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_ENDPOINTS.gradeSections}/${id}`));
  }
}