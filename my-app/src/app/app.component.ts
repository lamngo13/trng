import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Import CommonModule to use *ngIf and *ngFor
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  randomNumbers: number[] = [];

  generateNumbers(): void {
    this.randomNumbers = this.createRandomNumbers();
  }

  createRandomNumbers(): number[] {
    // You implement this part
    return [1,2,65435,7];
  }

  copyToClipboard(): void {
    const text = this.randomNumbers.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy.');
    });
  }
}