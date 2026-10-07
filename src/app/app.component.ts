import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  imports: [RouterOutlet, SidebarComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
}
