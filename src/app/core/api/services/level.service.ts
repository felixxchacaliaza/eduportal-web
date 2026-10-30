// src/app/core/api/services/level.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Level } from '../models/interfaces/level.interface';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.levels;

  public async getLevels(): Promise<Level[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Level[]>>(this.endpoint)
    );
    return res.data;
  }

  public async getLevelById(id: string): Promise<Level> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Level>>(`${this.endpoint}/${id}`)
    );
    return res.data;
  }

  public async createLevel(payload: Partial<Level>): Promise<Level> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<Level>>(this.endpoint, payload)
    );
    return res.data;
  }

  public async updateLevel(id: string, payload: Partial<Level>): Promise<Level> {
    const res = await firstValueFrom(
      this.http.put<ApiResponse<Level>>(`${this.endpoint}/${id}`, payload)
    );
    return res.data;
  }
}
