import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {SendContactFormDto} from "../../../../common/interface/i.contact-form";
import JSConfetti from "js-confetti";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {AppService} from "../../../app.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIcon} from "@ng-icons/core";
import {ContactFormService} from "./contact-form.service";
import intlTelInput, {Iti} from 'intl-tel-input';

@Component({
  selector: 'contact-form-component',
  standalone: true,
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    NgIcon,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass
  ],
  providers: [
    ContactFormService,
  ],
  host: {
    class: 'max-w-[1080px] flex-col justify-start items-end gap-5 inline-flex shadow-md rounded-2xl phone:shadow-none relative'
  }
})
export class ContactFormComponent implements AfterViewInit {

  public readonly email = 'support@beeoclock.com'
  public readonly isPopupOpen = signal(false);

  @ViewChild('phoneInput', {static: false})
  phoneInput!: ElementRef;

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef<HTMLTextAreaElement>;

  private readonly appService = inject(AppService);
  private readonly contactFormService = inject(ContactFormService);

  public intlTelInput: Iti | null = null;
  private jsConfetti: JSConfetti | undefined;

  public get contactForm() {
    return this.contactFormService.contactForm;
  }

  public ngAfterViewInit(): void {
    this.appService.runInBrowser(() => {
      this.contactFormService.successfullySentCallback = () => {
        this.isPopupOpen.set(true);
        this.contactForm.reset();
        this.showConfetti();
      };
      this.contactFormService.failedSentCallback = (error: string[]) => {
        alert(error.join('\n'));
      };
      this.jsConfetti = new JSConfetti();

      this.intlTelInput = intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'auto',
        strictMode: true,
        separateDialCode: true,
        countryOrder: ['dk', 'pl', 'ua'],
        // @ts-ignore
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/21.1.3/js/utils.js',
        geoIpLookup: (callback: (arg0: string) => any) => {
          fetch("https://freeipapi.com/api/json")
            .then(res => res.json())
            .then(data => callback(data.countryCode))
            .catch(() => callback("us"));
        }
      })
      this.autoResize();
    });
  }

  private showConfetti() {
    if (this.jsConfetti) {
      this.jsConfetti.addConfetti({
        emojis: ['🎉', '✨', '🐝', '🐝'],
        confettiRadius: 15,
        confettiNumber: 100,
      }).then();
    }
  }

  public closePopup() {
    this.isPopupOpen.set(false);
  }

  public isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    if (!control) return false;

    if (control.hasError('required')) {
      return control.touched;
    }

    return control.invalid && control.dirty;
  }

  public onSubmit() {
    if (this.intlTelInput) {
      const nationalNumber = this.phoneInput.nativeElement.value.trim();

      if (nationalNumber !== '') {
        const countryData = this.intlTelInput.getSelectedCountryData();

        let sanitizedNumber = nationalNumber;
        if (sanitizedNumber.startsWith('+' + countryData.dialCode)) {
          sanitizedNumber = sanitizedNumber.replace('+' + countryData.dialCode, '').trim();
        }

        const fullNumber = '+' + countryData.dialCode + sanitizedNumber;
        this.contactForm.patchValue({ phone: fullNumber });
      }
    }

    if (this.contactForm.valid) {
      const data = {
        object: 'SendContactFormDto',
        ...this.contactForm.value
      } as SendContactFormDto;
      this.contactFormService.lastValidFormValue.set(data);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  public autoResize() {
    if (this.messageTextarea) {
      const textarea = this.messageTextarea.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  public sanitizePhoneInput() {
    const phoneControl = this.contactForm.get('phone');
    if (phoneControl) {
      phoneControl.setValue(phoneControl.value.replace(/\D/g, ''), { emitEvent: false });
    }
  }

  public preventNonNumeric(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

}
