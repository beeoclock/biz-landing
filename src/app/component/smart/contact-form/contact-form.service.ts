import {inject, Injectable, resource, signal} from "@angular/core";
import {ContactFormForm} from "./contact-form.form";
import {SendContactFormDto} from "../../../../common/interface/i.contact-form";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {environment} from "../../../../environments/environment"


@Injectable()
export class ContactFormService {

  public readonly contactForm = new ContactFormForm();

  public successfullySentCallback = () => {
  };

  public failedSentCallback = (error:string[]) => {
  };

  private readonly apiUrl = `${environment.apiBaseUrl}/client/api/v1/contact`;

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
          return body;
        }).catch((error) => {
          this.failedSentCallback(error.error.message);
          return body;
        });

      }

      return body;

    }
  });

}
