import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {GameService} from "./services/game.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule
  ],
  template: `
    <header class="w-full h-[100vh] relative bg-[url('https://images.unsplash.com/photo-1608942025318-1191eeade556?q=80&w=1155&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-no-repeat bg-cover bg-center
flex justify-center items-center text-center">
      <div class="relative w-[450px]  bg-[rgb(0,0,0,0.85)] rounded-2xl m-auto flex flex-col items-center p-[60px] ">
        <div class="showcase-top">
          <h1 class="text-white text-3xl">{{ title }}</h1>
        </div>
        <div class="w-full mt-8 text-white">
          <form (ngSubmit)="submitForm()">
            <div class="info">
              <input class="w-full bg-[#343434] h-[50px] rounded-md p-8 mb-[30px]" type="text" placeholder="Game link" id="link" name="gameLink" [(ngModel)]="gameLink"> <br>
              <input class="w-full bg-[#343434] h-[50px] rounded-md p-8 mb-[30px]" type="text" placeholder="Score" id="score" name="score" [(ngModel)]="score"> <br>
              <input class="w-full bg-[#343434] h-[50px] rounded-md p-8 mb-[30px]" type="text" placeholder="Time" id="time" name="time" [(ngModel)]="time">
            </div>
            <div class="btn">
              <button class="w-full h-[50px] rounded-md font-bold cursor-pointer bg-[#007bff] shadow-2xl" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </header>
  `,
})
export class AppComponent {
  title = 'gamee';
  gameLink: string = '';
  score: string = '';
  time: string = '';

  constructor(private gameService: GameService) {
  }
  submitForm() {
    console.log('Game Link:', this.gameLink);
    console.log('Score:', this.score);
    console.log('Time:', this.time);

    this.gameService.getToken(this.gameLink)
      .subscribe(token => {
        this.gameService.getGameId(this.gameLink)
          .subscribe(gameId => {
            const hashSum = this.gameService.getChecksum(this.score, this.time, this.gameLink);
            this.gameService.sendScore(parseInt(this.score), parseInt(this.time), hashSum, token, this.gameLink, gameId)
              .subscribe(response => {
                console.log(response)
              })
          })
      });
  }
}
