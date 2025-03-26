import {inject, Injectable, PLATFORM_ID} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {formatToLast10MinuteISO} from "@src/common/tools";
import {environment} from "@src/environments/environment";
import {lastValueFrom, Observable} from "rxjs";

@Injectable()
export class ApiAdapter<RESPONSE> {

  private readonly origin = `${environment.apiBaseUrl}`;

  protected readonly httpClient = inject(HttpClient);
  protected readonly platformId = inject(PLATFORM_ID);

  /**
   * The cache buster is used to force the browser to make a request to the server instead of using a cached response.
   * As we have hydration, we need to force the browser to make a request to the server to get the latest data.
   * @protected
   */
  protected readonly cacheBuster = formatToLast10MinuteISO(Date.now());

  protected prepareUrl(path: string): string {
    return `${this.origin}${path}`;
  }

  public execute$(): Observable<RESPONSE> {
    throw new Error('Method not implemented.');
  }

  public executeAsync(): Promise<RESPONSE> {
    return lastValueFrom(this.execute$());
  }

}
