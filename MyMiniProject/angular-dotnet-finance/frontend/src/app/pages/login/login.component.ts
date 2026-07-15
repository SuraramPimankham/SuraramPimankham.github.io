import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = 'admin';
  password = 'admin123';
  error = '';
  busy = false;

  async ngOnInit(): Promise<void> {
    await this.auth.ensureInitialized();
    if (this.auth.user()) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit(): Promise<void> {
    this.error = '';
    this.busy = true;
    try {
      await this.auth.login(this.username, this.password);
      this.router.navigate(['/']);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ';
    } finally {
      this.busy = false;
    }
  }
}
