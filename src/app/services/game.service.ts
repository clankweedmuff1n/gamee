import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from "rxjs";
import {Md5} from "ts-md5";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) {
  }

  getToken(gameLink: string): Observable<string> {
    const headers = new HttpHeaders({
      'Host': 'api.service.gameeapp.com',
      'Connection': 'keep-alive',
      'Content-Length': '224',
      'client-language': 'en',
      'x-install-uuid': '0c1cd354-302a-4e76-9745-6d2d3dcf2c56',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      'sec-ch-ua-platform': 'Windows',
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Origin': 'https://prizes.gamee.com',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://prizes.gamee.com/',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9'
    });

    const body = {
      jsonrpc: '2.0',
      id: 'user.authentication.botLogin',
      method: 'user.authentication.botLogin',
      params: {
        botName: 'telegram',
        botGameUrl: gameLink,
        botUserIdentifier: null
      }
    };

    return this.http.post<any>('http://api.service.gameeapp.com', body, {headers})
      .pipe(
        map(response => {
          console.log(response.result);
          return response.result.tokens.authenticate;
        })
      );
  }

  getGameId(gameUrl: string): Observable<string> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'client-language': 'en',
      'content-length': '173',
      'Content-Type': 'application/json',
      'origin': 'https://prizes.gamee.com',
      'pragma': 'no-cache',
      'referer': 'https://prizes.gamee.com/',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    });

    const body = {
      jsonrpc: '2.0',
      id: 'game.getWebGameplayDetails',
      method: 'game.getWebGameplayDetails',
      params: {
        gameUrl: gameUrl
      }
    };

    return this.http.post<any>('https://api.service.gameeapp.com/', body, {headers})
      .pipe(
        map(response => {
          if (response && response.result && response.result.game && response.result.game.id) {
            return response.result.game.id;
          }
        })
      );
  }

  sendScore(score: number, timePlay: number, checksum: string, token: string, gameUrl: string, gameId: string): Observable<string> {
    const url = "http://api.service.gameeapp.com";
    const headers = new HttpHeaders({
      'Host': 'api.service.gameeapp.com',
      'User-Agent': 'USER_AGENT',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'X-Install-Uuid': '128942b2-e6e9-41b7-b754-5c7ba3373f8e',
      'Client-Language': 'en',
      'Content-Type': 'application/json',
      'Origin': 'https://prizes.gamee.com',
      'Referer': 'https://prizes.gamee.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Te': 'trailers',
      'Authorization': `Bearer ${token}`
    });

    const body = {
      jsonrpc: '2.0',
      id: 'game.saveWebGameplay',
      method: 'game.saveWebGameplay',
      params: {
        gameplayData: {
          gameId: gameId,
          score: score,
          playTime: timePlay,
          gameUrl: gameUrl,
          metadata: {
            gameplayId: 30
          },
          releaseNumber: 8,
          gameStateData: null,
          createdTime: '2021-12-28T03:20:24+03:30',
          checksum: checksum,
          replayVariant: null,
          replayData: null,
          replayDataChecksum: null,
          isSaveState: false,
          gameplayOrigin: 'game'
        }
      }
    };

    return this.http.post<any>(url, body, {headers}).pipe(
      map(response => {
        if (response && response.error) {
          return response.error.message + '\n' +
            response.error.data.reason + '\n' +
            'Try after ' + response.user.cheater.banStatus;
        } else if (response && response.result && response.result.surroundingRankings) {
          let resultText = '';
          const userPosInRank = response.result.surroundingRankings[0].ranking;
          for (const user of userPosInRank) {
            resultText += `${user.rank} - ${user.user.firstname} ${user.user.lastname} score: ${user.score}\n`;
          }
          return resultText;
        }
        return "";
      })
    );
  }

  getChecksum(score: string, playTime: string, url: string): any {
    const md5 = new Md5();
    const gameStateData = '';
    const str2hash = `${score}:${playTime}:${url}:${gameStateData}:crmjbjm3lczhlgnek9uaxz2l9svlfjw14npauhen`;
    return md5.appendStr(str2hash).end();
  }
}
