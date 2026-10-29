import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Classroom } from '../models/interfaces/grade-section.interface';
import { API_ENDPOINTS } from "../endpoints";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../models/interfaces/api-response.interface";

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.sections;

public async getClassrooms(): Promise<Classroom[]> {
    const res = await firstValueFrom(this.http.get<ApiResponse<Classroom[]> | Classroom[]>(API_ENDPOINTS.classrooms));
    return Array.isArray(res) ? res : res.data;
  }

    
  }