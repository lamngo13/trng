import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Import CommonModule to use *ngIf and *ngFor
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tempRandomNumbers: number[] = [];
  randomNumbers: number[] = [];

  @ViewChild('timestampButton') timestampButton!: ElementRef;

  generateNumbers(): void {
    this.randomNumbers = [...this.tempRandomNumbers]; // Clone the array
  }

  copyToClipboard(): void {
    const text = this.randomNumbers.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy.');
    });
  }

  get_timestamp(): void {
    let time_one = new Date().toISOString();
    console.log("time_one: ", time_one);

    // Extract last digit before 'Z'
    let lastDigit = parseInt(time_one[time_one.length - 2], 10);
    if (!isNaN(lastDigit)) {
      this.tempRandomNumbers.push(lastDigit);
    }

    this.moveButtonRandomly();
  }

  moveButtonRandomly(): void {
    if (this.timestampButton) {
      const button = this.timestampButton.nativeElement;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const randomX = Math.max(10, Math.random() * (viewportWidth - 100)); // Keep within bounds
      const randomY = Math.max(10, Math.random() * (viewportHeight - 50));

      button.style.position = 'absolute';
      button.style.left = `${randomX}px`;
      button.style.top = `${randomY}px`;
    }
  }
}
