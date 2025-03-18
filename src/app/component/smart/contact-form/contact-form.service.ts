import {inject, Injectable, resource, signal} from "@angular/core";
import {ContactFormForm} from "./contact-form.form";
import {SendContactFormDto} from "../../../../common/interface/i.contact-form";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Injectable()
export class ContactFormService {

  public readonly contactForm = new ContactFormForm();

  public successfullySentCallback = () => {
  };

  public failedSentCallback = () => {
  };

  private readonly apiUrl = 'https://api-dev.beeoclock.com/client/api/v1/contact';

  public readonly lastValidFormValue = signal<SendContactFormDto | null>(null);
  private readonly httpClient = inject(HttpClient);

  private readonly lastSuccessfulSent = resource({
    request: () => ({
      body: this.lastValidFormValue(),
    }),
    loader: async ({request: {body}}) => {

      if (body) {

        const request$ = this.httpClient.post(this.apiUrl, body);

        return lastValueFrom(request$).then(() => {
          this.successfullySentCallback();
        }).catch(() => {
          this.failedSentCallback();
        }).finally(() => {
          return body;
        });

      }

      return body;

    }
  });

}
