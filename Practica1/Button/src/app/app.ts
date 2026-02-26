import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styles: `
    button {
      background: linear-gradient(90deg, #F0060B 0%, #CC26D5 52.6%, #7702FF 100%);
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    button:active {
      opacity: 0.8;
    }
  `
})
export class App {
  protected readonly title = signal('Button');
}
