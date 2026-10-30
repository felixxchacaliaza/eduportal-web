// src/app/core/api/services/area.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Area } from '../models/interfaces/area.interface';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.areas;

  public async getAreas(): Promise<Area[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Area[]>>(this.endpoint)
    );
    return res.data;
  }

  public async createArea(payload: Partial<Area>): Promise<Area> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<Area>>(this.endpoint, payload)
    );
    return res.data;
  }

  public async updateArea(id: string, payload: Partial<Area>): Promise<Area> {
    const res = await firstValueFrom(
      this.http.put<ApiResponse<Area>>(`${this.endpoint}/${id}`, payload)
    );
    return res.data;
  }
}
