import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  /**
   * 1. Listar todas las áreas curriculares (Promesa con async / await)
   * GET /api/areas (areaRoutes.get('/', AreaController.getAreas))
   */
  public async getAreas(): Promise<Area[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Area[]>>(this.endpoint)
    );
    return response.data;
  }

  /**
   * 2. Obtener área curricular por ID o CODE (Promesa con async / await)
   * GET /api/areas/:id
   */
  public async getAreaById(id: string): Promise<Area> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Area>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }
}

