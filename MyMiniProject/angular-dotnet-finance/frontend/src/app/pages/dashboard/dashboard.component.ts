import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DashboardSummary } from '../../core/models';
import { formatDate, money } from '../../core/utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly money = money;
  readonly formatDate = formatDate;

  data: DashboardSummary | null = null;
  error = '';
  maxCat = 1;
  maxMonth = 1;

  async ngOnInit(): Promise<void> {
    try {
      const data = await firstValueFrom(this.api.dashboard());
      this.data = data;
      this.maxCat = Math.max(...data.byCategory.map((c) => c.total), 1);
      this.maxMonth = Math.max(...data.byMonth.flatMap((m) => [m.income, m.expense]), 1);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'โหลดแดชบอร์ดไม่สำเร็จ';
    }
  }
}
