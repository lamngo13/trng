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
    this.createRandomNumbers().then(numbers => {
      this.randomNumbers = numbers;
    });
  }

  async measurePing(url: string): Promise<number> {
    const start = performance.now();
    try {
        await fetch(url, { method: "GET", mode: "no-cors" }); // `no-cors` avoids CORS errors
    } catch (error) {
        console.error("Ping failed:", error);
        //TODO add something here to handle the error
        //and retry
    }
    const end = performance.now();
    return end - start;
    //maybe grab the last digit or smth
    //here we can also check for an error - in case that its like < 5 digits or something
    //TODO figure out how to retry the whole function or whatever
}
  async createRandomNumbers(): Promise<number[]> {
    // You implement this part
    let arrayToReturn: number[] = [];
    let numbers_added = 0;
    for (let i = 0; i < 40; i++) {
      arrayToReturn.push(await this.measurePing("https://www.google.com"));
      
      // TODO add a check in case a given browser doesn't give good random numbers
      // start time
      // ping google ( 8.8.8.8)
      // end time
      // calculate the difference
      // how many decimals out should we go?
      //apend to list
        }

    return arrayToReturn;
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