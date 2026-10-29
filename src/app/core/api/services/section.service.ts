import { inject, Injectable } from "@angular/core";
import { Section } from '../models/interfaces/grade-section.interface';
import { HttpClient } from "@angular/common/http";
import { API_ENDPOINTS } from "../endpoints";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../models/interfaces/api-response.interface";

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.sections;



    public async getSections(): Promise<Section[]> {
        const res = await firstValueFrom(this.http.get<ApiResponse<Section[]> | Section[]>(API_ENDPOINTS.sections));
        return Array.isArray(res) ? res : res.data;
      }
  }