import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Rule } from '../models/interfaces/rule.interface';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.rules;

  public async getRules(year?: string): Promise<Rule[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    const res = await firstValueFrom(this.http.get<ApiResponse<Rule[]>>(this.endpoint, { params }));
    return res.data;
  }

  public async getRuleByKeyOrId(keyOrId: string, year?: string): Promise<Rule> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    const res = await firstValueFrom(this.http.get<ApiResponse<Rule>>(`${this.endpoint}/${keyOrId}`, { params }));
    return res.data;
  }

  public async getShifts(year: string = '2026'): Promise<string[]> {
    try {
      const rule = await this.getRuleByKeyOrId('SHIFTS', year);
      if (Array.isArray(rule.currentValue)) return rule.currentValue;
      if (Array.isArray(rule.value)) {
        const item = rule.value.find((v: any) => String(v.year) === String(year));
        if (item && Array.isArray(item.value)) return item.value;
      }
      return ['MAÑANA', 'TARDE'];
    } catch {
      return ['MAÑANA', 'TARDE'];
    }
  }
}