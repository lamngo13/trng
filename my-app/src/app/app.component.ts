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
  holder: number[] = [];
  
  @ViewChild('timestampButton') timestampButton!: ElementRef;
  
  private prevX: number | null = null;
  private prevY: number | null = null;

  generateNumbers(): void {
    console.log("fromcprng: ", this.fromcprng);
    console.log("truRandomNumbers: ", this.truRandomNumbers);
    this.cryptographicMix().then(result => {
      this.holder = result;
      this.randomNumbers = this.holder;
      console.log("finalRandomNumbers: ", this.randomNumbers);
    }).catch(error => {
      console.error('Error in cryptographicMix:', error);
    });
  }

  expandRandom(): void {
    console.log("Expanding random numbers...");
    const randomValues = new Uint32Array(10);
    crypto.getRandomValues(randomValues);
    console.log("Random values: ", randomValues);
    
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
    this.expandRandom();
    
    let time_one = new Date().toISOString();
    let lastDigit = parseInt(time_one[time_one.length - 2], 10);
    if (!isNaN(lastDigit)) {
      this.truRandomNumbers.push(lastDigit);
    }

    const { clientX, clientY } = this.getEventCoordinates(event);

    if (this.prevX !== null && this.prevY !== null) {
      let diffX = Math.abs(clientX - this.prevX);
      let diffY = Math.abs(clientY - this.prevY);
      
      let lastDigitX = diffX % 10;
      let lastDigitY = diffY % 10;
      
      this.truRandomNumbers.push(lastDigitX, lastDigitY);
    }
    
    this.prevX = clientX;
    this.prevY = clientY;
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

  async cryptographicMix(): Promise<number[]> {
    const mixedResults: number[] = [];
    const minLength = Math.min(this.truRandomNumbers.length, Math.floor(this.fromcprng.length / 4));

    if (minLength === 0) {
        return mixedResults; // Not enough numbers to process
    }

    for (let i = 0; i < minLength; i++) {
        const truNumber = [this.truRandomNumbers[i]];
        const cprngNumbers = this.fromcprng.slice(i * 4, (i + 1) * 4);

        const combinedArray = [...truNumber, ...cprngNumbers];
        const buffer = new Uint8Array(combinedArray);

        // Hash the combined array using SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Take only the first 4 numbers from the hash to match the expected output size
        const tempNumbers = hashArray.slice(0, 4).map(num => num % 10);

        // Concatenate digits in pairs (e.g., [1, 6, 9, 0] → [16, 90])
        for (let j = 0; j < tempNumbers.length - 1; j += 2) {
            mixedResults.push(parseInt(`${tempNumbers[j]}${tempNumbers[j + 1]}`));
        }
    }

    return mixedResults;
}

}
