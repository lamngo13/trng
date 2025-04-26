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
  truRandomNumbers: number[] = []; //REAL entropy from user interaction
  randomNumbers: number[] = []; 
  fromcprng: number[] = [];  //FAKE entropy from crypto.getRandomValues()
  holder: number[] = [];
  
  @ViewChild('timestampButton') timestampButton!: ElementRef;
  
  private prevX: number | null = null;
  private prevY: number | null = null;

  //final step - button pressed to show previously generated numbers
  generateNumbers(): void {
    console.log("YUHHH YEET YUHHH")
    console.log("fromcprng: ", this.fromcprng);
    console.log("truRandomNumbers: ", this.truRandomNumbers);
    const res = this.concatenatePairs(this.truRandomNumbers);
    console.log("res: ", res);
    //REAL TODO delete all console logs
    //TODO combine truRandomNumbers into two-digit numbers
    this.randomNumbers = res



    // this.cryptographicMix().then(result => {
    //   //'interleave' the two arrays
    //   //TODO is this the best way?
    //   //do we need strictly true entropy for everything??
    //   this.holder = result;
    //   this.randomNumbers = this.holder;
    //   //TODO I think assigning randomNumbers is the trigger
    //   console.log("finalRandomNumbers: ", this.randomNumbers);
    // }).catch(error => {
    //   console.error('Error in cryptographicMix:', error);
    // });
  }

  concatenatePairs(arr: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const next = arr[i + 1];

        // If current is a single digit (0-9) and next exists and is also a single digit
        if (current < 10 && next !== undefined && next < 10) {
            result.push(Number(`${current}${next}`));
            i++; // skip the next one because it's already used
        } else {
            result.push(current);
        }
    }
    return result;
}

  //called everytime the 'get timestamp' button is pressed
  //gets real entropy from user interaction
  get_timestamp(event: MouseEvent | TouchEvent): void {
    //everytime the user clicks the button, we appdend 3 truly random numbers to 
    //the truRandomNumbers array
    //1 from timestamp, 2 from the mouse coords
    //this.expandRandom();
    //experimental method call 
    //generates a small amount of numbers from a csprng
    //TODO idk how crypto.getRandomValues() works, so need to check on that!
    
    let time_one = new Date().toISOString();
    console.log("Timestamp: ", time_one);
    let lastDigit = parseInt(time_one[time_one.length - 2], 10);
    if (!isNaN(lastDigit)) {
      this.truRandomNumbers.push(lastDigit);
      //THIS is real entropy!
      //the source of user interaction is relatively trivial;
      //the point is that if we measure like 9 decimals out from the timestamp,
      //the last digit is big unpredictable
    }

    const { clientX, clientY } = this.getEventCoordinates(event);

    if (this.prevX !== null && this.prevY !== null) {
      let diffX = Math.abs(clientX - this.prevX);
      let diffY = Math.abs(clientY - this.prevY);
      console.log("Diff X: ", diffX);
      console.log("Diff Y: ", diffY);
      
      let lastDigitX = diffX % 10;
      let lastDigitY = diffY % 10;
      //similar concept as timestamp; the user will click the button
      //and the EXACT point at which they click the button is unpredictable
      //again measuring like 9 decimals out
      
      this.truRandomNumbers.push(lastDigitX, lastDigitY);
      console.log("truRandomNumbers: ", this.truRandomNumbers);

    }
    
    this.prevX = clientX;
    this.prevY = clientY;
    this.moveButtonRandomly();
    //move the button (NOT RANDOM lmao)
    //but again, with this much precision, the user interaction
    //lowkey doesn't matter
  }

  //function to call crypto.getRandomValues()
  //this is a cryptographically secure pseudo-random number generator
  //according to the internet - but who knows!
  //THUS
  //this is a 'fake' entropy source
  //and my goal is to interleave this with the real entropy
  //to increase the number of random numbers we can use
  //bc I'm not tryna click that much - rip carpal tunnel lmao

  expandRandom(): void {
    console.log("Expanding random numbers...");
    const randomValues = new Uint32Array(10);
    //since we generate 3 numbers from get_timestamp, and this has 10,
    //we have a digit ratio of 
    //3:10, real to fake entropy
    //TODO is that enough??

    //also I DO NOT CARE what the literature says,
    //no way I am using real entropy to generate a seed and using that seed 
    //because that is still deterministic
    //again assume adversary has infinite time and resources
    //!!!!

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



  moveButtonRandomly(): void {
    // this is so meta, but its' not random, whatev
    // user interaction doesn't matter because we measure with such precision
    const randomValues = new Uint32Array(10);
    crypto.getRandomValues(randomValues);
    console.log("Random values: ", randomValues);
    const ranx  = (randomValues[0] % 10) / 10;
    const rany  = (randomValues[1] % 10) / 10;
    console.log("ranx: ", ranx);
    console.log("rany: ", rany);

    if (this.timestampButton) {
      const button = this.timestampButton.nativeElement;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // const randomX = Math.max(10, Math.random() * (viewportWidth - 100));
      // const randomY = Math.max(10, Math.random() * (viewportHeight - 50));
      const randomX = Math.max(10, ranx * (viewportWidth - 150));
      const randomY = Math.max(10, rany * (viewportHeight - 150));

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


  //this is pure chatGPT
  //it said that SHA-256 is a good hashing algorithm
  //the purpose is to interleave real and fake entroyp arrays
  //again with the point of reducing the amount of user interaction needed
  //but is this safe ???????
  //TODO check on that
  //like assume pseudorandom numbers are known !??
  async cryptographicMix(): Promise<number[]> {
    const mixedResults: number[] = [];
    const minLength = Math.min(this.truRandomNumbers.length, Math.floor(this.fromcprng.length / 4));
    //god I have no idea what this does
    //but the tldr is do we trust that if all of psuedorandom numbers are known,
    //the SHA-256 hash is still secure?
    //the HASH function IS determinstic, so I am actually not sure still

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
