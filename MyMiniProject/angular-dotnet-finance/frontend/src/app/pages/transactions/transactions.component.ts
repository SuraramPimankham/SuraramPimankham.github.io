import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Transaction, TransactionFilter, User } from '../../core/models';
import { formatDate, money, slipUrl } from '../../core/utils';

interface TransactionForm {
  type: string;
  category: string;
  title: string;
  note: string;
  amount: string;
  occurredAt: string;
  userId: string;
  clearSlip: boolean;
}

const emptyForm = (): TransactionForm => ({
  type: 'expense',
  category: '',
  title: '',
  note: '',
  amount: '',
  occurredAt: new Date().toISOString().slice(0, 10),
  userId: '',
  clearSlip: false,
});

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly money = money;
  readonly formatDate = formatDate;
  readonly slipUrl = slipUrl;

  items: Transaction[] = [];
  users: User[] = [];
  filter: TransactionFilter = { type: '', category: '' };
  form: TransactionForm = emptyForm();
  slip: File | null = null;
  editing: Transaction | null = null;
  error = '';
  busy = false;
  showForm = false;

  ngOnInit(): void {
    this.load();
    if (this.auth.isAdmin()) {
      firstValueFrom(this.api.getUsers())
        .then((users) => (this.users = users))
        .catch(() => {});
    }
  }

  async load(): Promise<void> {
    try {
      this.items = await firstValueFrom(this.api.getTransactions(this.filter));
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'โหลดรายการไม่สำเร็จ';
    }
  }

  openCreate(): void {
    this.editing = null;
    this.form = emptyForm();
    this.slip = null;
    this.showForm = true;
    this.error = '';
  }

  openEdit(t: Transaction): void {
    this.editing = t;
    this.form = {
      type: t.type,
      category: t.category,
      title: t.title,
      note: t.note || '',
      amount: String(t.amount),
      occurredAt: t.occurredAt?.slice(0, 10) || '',
      userId: String(t.userId),
      clearSlip: false,
    };
    this.slip = null;
    this.showForm = true;
    this.error = '';
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSlipChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.slip = input.files?.[0] || null;
  }

  async onSubmit(): Promise<void> {
    this.busy = true;
    this.error = '';
    try {
      const fd = new FormData();
      fd.append('type', this.form.type);
      fd.append('category', this.form.category);
      fd.append('title', this.form.title);
      fd.append('note', this.form.note || '');
      fd.append('amount', this.form.amount);
      if (this.form.occurredAt) {
        fd.append('occurredAt', new Date(this.form.occurredAt).toISOString());
      }
      if (this.auth.isAdmin() && this.form.userId) {
        fd.append('userId', this.form.userId);
      }
      if (this.form.clearSlip) {
        fd.append('clearSlip', 'true');
      }
      if (this.slip) {
        fd.append('slip', this.slip);
      }

      await firstValueFrom(this.api.saveTransaction(this.editing?.id ?? null, fd));
      this.showForm = false;
      await this.load();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ';
    } finally {
      this.busy = false;
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('ลบรายการนี้?')) return;
    try {
      await firstValueFrom(this.api.deleteTransaction(id));
      await this.load();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'ลบไม่สำเร็จ';
    }
  }
}
