import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { User } from '../../core/models';
import { formatDate } from '../../core/utils';

interface UserForm {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

const emptyForm = (): UserForm => ({
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: 'user',
  isActive: true,
});

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly formatDate = formatDate;

  users: User[] = [];
  form: UserForm = emptyForm();
  editing: User | null = null;
  showForm = false;
  error = '';
  busy = false;

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void> {
    try {
      this.users = await firstValueFrom(this.api.getUsers());
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'โหลดผู้ใช้ไม่สำเร็จ';
    }
  }

  openCreate(): void {
    this.editing = null;
    this.form = emptyForm();
    this.showForm = true;
    this.error = '';
  }

  openEdit(u: User): void {
    this.editing = u;
    this.form = {
      username: u.username,
      password: '',
      fullName: u.fullName,
      email: u.email || '',
      role: u.role,
      isActive: u.isActive,
    };
    this.showForm = true;
    this.error = '';
  }

  closeForm(): void {
    this.showForm = false;
  }

  async onSubmit(): Promise<void> {
    this.busy = true;
    this.error = '';
    try {
      if (this.editing) {
        await firstValueFrom(
          this.api.updateUser(this.editing.id, {
            fullName: this.form.fullName,
            email: this.form.email,
            role: this.form.role,
            isActive: this.form.isActive,
            password: this.form.password || null,
          }),
        );
      } else {
        await firstValueFrom(
          this.api.createUser({
            username: this.form.username,
            password: this.form.password,
            fullName: this.form.fullName,
            email: this.form.email,
            role: this.form.role,
          }),
        );
      }
      this.showForm = false;
      await this.load();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ';
    } finally {
      this.busy = false;
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('ลบผู้ใช้นี้?')) return;
    try {
      await firstValueFrom(this.api.deleteUser(id));
      await this.load();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'ลบไม่สำเร็จ';
    }
  }
}
