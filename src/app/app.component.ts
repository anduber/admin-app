import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './shared/ui/button/button.component';
import { TextFieldComponent } from './shared/ui/text-field/text-field.component';

@Component({
  imports: [RouterOutlet, ReactiveFormsModule, ButtonComponent, TextFieldComponent],
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
