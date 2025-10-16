
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-orders-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './orders-shell.component.html',
  styleUrls: ['./orders-shell.component.scss']
})
export class OrdersShellComponent {
  private readonly session = inject(SessionService);

  readonly userName = computed(() => this.session.snapshot?.name ?? '');
  readonly userRole = computed(() => this.session.snapshot?.role ?? '');
}
