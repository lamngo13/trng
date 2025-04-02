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

  async measurePing(url: string, timeout: number = 5000): Promise<number | string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const start = performance.now();

    try {
        await fetch(url, { method: "GET", mode: "no-cors", signal: controller.signal });
    } catch (error) {
        if ((error as Error).name === "AbortError") {
            return "Timeout exceeded";
        }
        return `Error: ${(error as Error).message}`;
    } finally {
        clearTimeout(timeoutId);
    }

    const end = performance.now();
    const diff = end - start;
    console.log(`Ping time: ${diff}ms`);
    const numStr = diff.toString();
    const numericDigits = numStr.replace(".", "").length;

    //j for debugging
    console.log("numStr: ", numStr);
    console.log("numericDigits: ", numericDigits);


    //return error if the number of digits is less than 5
    if (numericDigits < 5) {
        return "Error: Less than 5 digits";
    }
    //grab the final 2 digits
    const lastTwoDigits = numStr.slice(-2);
    //convert lastTwoDigits to a number
    const lastTwoDigitsNum = parseInt(lastTwoDigits);
    return lastTwoDigitsNum;




    return end - start;
        //maybe grab the last digit or smth
    //here we can also check for an error - in case that its like < 5 digits or something
    //TODO figure out how to retry the whole function or whatever
}


  async createRandomNumbers(): Promise<number[]> {
    // You implement this part
    let arrayToReturn: number[] = [];
    let numbers_added = 0;
    while (numbers_added < 10) {
      const pingResult = await this.measurePing("https://www.google.com");
      if (typeof pingResult === 'number') {
        numbers_added++;
        arrayToReturn.push(pingResult);
      }
      else {
        console.log(pingResult);
      }
      
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

  get_timestamp(): void {
    let time_one = new Date().toISOString();
    //time one example: time_one:  2025-04-02T15:55:57.056Z
    console.log("time_one: ", time_one);
    let time_two = Date.now();
    console.log("time_two: ", time_two);
    let time_three = performance.now();
    console.log("time_three: ", time_three);
    let time_four = process.hrtime();
    console.log("time_four: ", time_four);
  }
}