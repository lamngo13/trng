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
  truRandomNumbers: number[] = [];
  randomNumbers: number[] = [];
  fromcprng: number[] = [];
  
  @ViewChild('timestampButton') timestampButton!: ElementRef;
  
  private prevX: number | null = null;
  private prevY: number | null = null;

  generateNumbers(): void {
    this.randomNumbers = [...this.truRandomNumbers]; // Clone the array
    console.log("cprng numbers: ", this.fromcprng);
  }

  expandRandom(): void {
    console.log("Expanding random numbers...");
    const randomValues = new Uint32Array(10);
    crypto.getRandomValues(randomValues);
    console.log("Random values: ", randomValues);
    //write for loop to get the last digit of each number
    //and push it to truRandomNumbers
    for (let i = 0; i < randomValues.length; i++) {
      this.fromcprng.push(randomValues[i] % 10);
    }
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
    this.expandRandom(); // Call expandRandom to generate random values 
    //hopefully seeded by time, but who knows !

    //get timestamp!
    let time_one = new Date().toISOString();
    // Extract last digit before 'Z'
    let lastDigit = parseInt(time_one[time_one.length - 2], 10);
    if (!isNaN(lastDigit)) {
      this.truRandomNumbers.push(lastDigit);
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

      this.truRandomNumbers.push(lastDigitX, lastDigitY);
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
