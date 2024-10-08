import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgForOf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Dropdown, DropdownInterface, DropdownOptions} from "flowbite";
import {TranslateService} from "@ngx-translate/core";
import {LanguageCodeEnum, LanguageRecord, LANGUAGES} from "../../enum/language-code.enum";
import {DropdownComponent} from "../dropdown/dropdown.component";
import {WINDOW} from "../../token";

@Component({
  selector: 'utility-change-language-component',
  standalone: true,
  template: `

    <!--  Dropdown button  -->
    <button
      #dropdownButton
      class="
        text-white
        text-xl
        transition-all
        hover:bg-white/20
        focus:ring-4
        focus:outline-none
        focus:ring-beeColor-400
        font-medium
        rounded-lg
        px-4
        py-2.5
        text-center
        inline-flex
        items-center
        active:scale-95
        duration-100"
      type="button">
      <i class="bi bi-translate"></i>
      <!--      <span class="ms-2">-->
      <!--        {{ selectedLanguageLabel }}-->
      <!--      </span>-->
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownMenu
      class="z-10 hidden bg-white divide-y divide-beeColor-100 rounded-lg shadow w-44 dark:bg-beeDarkColor-700">

      <form [formGroup]="form">
        <ul class="p-3 space-y-1 text-sm text-beeColor-700 dark:text-beeDarkColor-200"
            aria-labelledby="dropdownDefaultButton">
          <li *ngFor="let language of languages">
            <label [for]="'language-' + language.code"
                   class="flex items-center gap-3 p-2 rounded hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 cursor-pointer w-fulltext-sm font-medium text-beeColor-900 dark:text-beeDarkColor-300">
              <input [id]="'language-' + language.code" type="radio" [value]="language.code"
                     formControlName="language"
                     class="w-4 h-4 text-blue-600 bg-beeColor-100 border-beeColor-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-beeDarkColor-800 dark:focus:ring-offset-beeDarkColor-800 focus:ring-2 dark:bg-beeDarkColor-600 dark:border-beeDarkColor-500 cursor-pointer">
              {{ language.name }}
            </label>
          </li>
        </ul>
      </form>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DropdownComponent,
    NgForOf,
    ReactiveFormsModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChangeLanguageComponent implements OnInit, AfterViewInit {

  public readonly languages = LANGUAGES;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly window = inject(WINDOW);

  public readonly form = new FormGroup({
    language: new FormControl<LanguageCodeEnum>(LANGUAGES[0].code)
  });

  @ViewChild('dropdownButton')
  public dropdownButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownMenu')
  public dropdownMenu!: ElementRef<HTMLDivElement>;

  @Input()
  @HostBinding()
  public id = 'utility-popover-btn';

  // The popover will present only on mobile size
  @Input()
  @HostBinding('class.sm:hidden')
  public smHidden = false;

  public get selectedLanguageLabel(): string {
    if (this.form.controls.language.value) {
      return LanguageRecord[this.form.controls.language.value]
    }
    return 'Not selected';
  }

  #dropdown: DropdownInterface | undefined;

  public get dropdown(): DropdownInterface | undefined {
    return this.#dropdown;
  }

  public ngOnInit(): void {

    this.form.controls.language.setValue(this.currentLanguage);
  }

  public ngAfterViewInit(): void {

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom-start',
      triggerType: 'click',
    };

    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    this.#dropdown = new Dropdown(this.dropdownMenu.nativeElement, this.dropdownButton.nativeElement, options);

    // Handle change language
    this.form.controls.language.valueChanges.subscribe((languageCode: LanguageCodeEnum | null) => {
      if (languageCode) {
        this.translateService.use(languageCode);
        this.updateUrlLanguage(languageCode);
      }
    });

  }

  private get currentLanguage(): LanguageCodeEnum {
    const {language} = this.activatedRoute.snapshot.params;
    return language ?? this.translateService.currentLang as LanguageCodeEnum;
  }

  private updateUrlLanguage(languageCode: LanguageCodeEnum): void {
    const urlObject = new URL(this.window.location.href);
    // @ts-ignore
    let queryParams = {};
    // @ts-ignore
    urlObject.searchParams.size && (queryParams = Object.fromEntries(urlObject.searchParams.entries()))

    this.router.navigate([languageCode], {
      queryParams,
      fragment: this.activatedRoute.snapshot.fragment ?? undefined,
      queryParamsHandling: 'merge',
    }).then();

  }

}
