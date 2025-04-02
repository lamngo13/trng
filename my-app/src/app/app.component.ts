import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import process from 'process';
import hrtime from 'browser-process-hrtime'

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

  generateNumbers(): void {
      this.randomNumbers = this.tempRandomNumbers;
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
    // let time_two = Date.now();
    // console.log("time_two: ", time_two);
    // let time_three = performance.now();
    // console.log("time_three: ", time_three);
    // let time_four = hrtime();
    // console.log("time_four: ", time_four);
  }
}