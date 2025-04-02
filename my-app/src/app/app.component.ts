import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tempRandomNumbers: number[] = [];
  randomNumbers: number[] = [];
  
  @ViewChild('timestampButton') timestampButton!: ElementRef;
  
  private prevX: number | null = null;
  private prevY: number | null = null;

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

  get_timestamp(event: MouseEvent | TouchEvent): void {
    let time_one = new Date().toISOString();
    console.log("time_one: ", time_one);

    // Extract last digit before 'Z'
    let lastDigit = parseInt(time_one[time_one.length - 2], 10);
    if (!isNaN(lastDigit)) {
      this.tempRandomNumbers.push(lastDigit);
    }

    // Get mouse/touch position
    const { clientX, clientY } = this.getEventCoordinates(event);

    if (this.prevX !== null && this.prevY !== null) {
      // Compute absolute differences
      let diffX = Math.abs(clientX - this.prevX);
      let diffY = Math.abs(clientY - this.prevY);

      // Extract last digit
      let lastDigitX = diffX % 10;
      let lastDigitY = diffY % 10;

      // Append to tempRandomNumbers
      this.tempRandomNumbers.push(lastDigitX, lastDigitY);
    }

    // Update previous position
    this.prevX = clientX;
    this.prevY = clientY;

    // Move button
    this.moveButtonRandomly();
  }

  moveButtonRandomly(): void {
    if (this.timestampButton) {
      const button = this.timestampButton.nativeElement;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const randomX = Math.max(10, Math.random() * (viewportWidth - 100));
      const randomY = Math.max(10, Math.random() * (viewportHeight - 50));

      button.style.position = 'absolute';
      button.style.left = `${randomX}px`;
      button.style.top = `${randomY}px`;
    }
  }

  private getEventCoordinates(event: MouseEvent | TouchEvent): { clientX: number; clientY: number } {
    if (event instanceof MouseEvent) {
      return { clientX: event.clientX, clientY: event.clientY };
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: 0, clientY: 0 };
  }
}
