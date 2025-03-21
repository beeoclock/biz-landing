import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  emailValidator,
  noLeadingSpacesValidator,
  phoneNumberValidator
} from "../../../../common/validators/email-validators";

export class ContactFormForm extends FormGroup {
  public constructor() {
    super({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, emailValidator()]),
      phone: new FormControl('', [phoneNumberValidator()]),
      subject: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noLeadingSpacesValidator()]),
      message: new FormControl('', [Validators.required, Validators.minLength(10), noLeadingSpacesValidator()]),
    });
  }
}
