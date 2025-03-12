import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  LOCALE_ID,
  OnInit,
  PLATFORM_ID, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {isPlatformBrowser, isPlatformServer, NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {
  bootstrapCheck,
  bootstrapThreeDots,
  bootstrapXLg,
  bootstrapPlusCircle,
  bootstrapDashCircle,
  bootstrapEnvelope, bootstrapInstagram, bootstrapAt, bootstrapFacebook, bootstrapLinkedin, bootstrapCheckCircleFill
} from "@ng-icons/bootstrap-icons";
import {IMenuItem} from "../common/interface/i.menu-item";
import {MenuUseCase} from "./enum/menu-use-case.enum";
import {environment} from "../environments/environment";
import {CurrencyCodePipe} from "../common/pipe/currency.pipe";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import intlTelInput, {Iti} from 'intl-tel-input';
import {getFaqItems} from "../common/interface/i.faq-item";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIcon,
    NgClass,
    CurrencyCodePipe,
    NgStyle,
    CurrencyCodePipe,
    ReactiveFormsModule,
  ],
  viewProviders: [
    provideIcons({
      bootstrapXLg,
      bootstrapThreeDots,
      bootstrapCheck,
      bootstrapEnvelope,
      bootstrapInstagram,
      bootstrapAt,
      bootstrapFacebook,
      bootstrapLinkedin,
      bootstrapCheckCircleFill,
      bootstrapPlusCircle,
      bootstrapDashCircle
    }),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
  host: {
    'class': 'flex flex-col'
  },
})


export class AppComponent implements OnInit, AfterViewInit {

  public MenuUseCase = MenuUseCase;
  public readonly menuItems: IMenuItem[] = [
    { id: 1, name: $localize`Services`, link: '#services', useCase: MenuUseCase.Both },
    { id: 2, name: $localize`Tariffs`, link: '#tariffs', useCase: MenuUseCase.Both },
    { id: 3, name: $localize`Reviews`, link: '#reviews', useCase: MenuUseCase.Desktop },
    { id: 4, name: $localize`FAQ`, link: '#faq', useCase: MenuUseCase.Both },
    { id: 5, name: $localize`About Us`, link: '#about-us', useCase: MenuUseCase.Desktop },
    { id: 6, name: $localize`Order a consultation`, link: '#', useCase: MenuUseCase.Mobile },
    { id: 7, name: $localize`Try a demo account`, link: 'https://panel.dev.beeoclock.com/66f9378141ed7954254c40c8/event/calendar-with-specialists', useCase: MenuUseCase.Mobile },
    { id: 8, name: $localize`Login`, link: '#', useCase: MenuUseCase.Mobile },
  ];

  private readonly formBuilder = inject(FormBuilder)
  private readonly localeId = inject(LOCALE_ID);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly socialShareSeoService = inject(SocialShareSeoService);
  private readonly isBrowser: boolean;

  public readonly demoAccountUrl = new URL(environment.config.demoAccount.panelUrl);
  public readonly host = [environment.config.host, this.localeId];
  public readonly consultationLink = environment.config.consultationLink;
  public isMobileMenuOpen = false
  public aspectRatio: number | null = null;
  public subscriptionType: 'monthly' | 'annual' = 'annual';
  public readonly currencyCode: string = this.localeId.startsWith('pl') ? 'PLN' : 'USD';
  public activeIndex: number | null = null;
  public faqMinHeight = '200px';
  public readonly email = 'support@beeoclock.com'
  public contactForm: FormGroup;
  public intlTelInput: Iti | null = null;
  public isPopupOpen = false;

  public submitted = false;
  public readonly pricing = {
    free: {
      monthly: { value: 0, currency: this.currencyCode },
      annual: { value: 0, currency: this.currencyCode }
    },
    basic: {
      monthly: { value: this.getLocalizedPrice(59, 55), currency: this.currencyCode },
      annual: { value: this.getLocalizedPrice(53, 49), currency: this.currencyCode },
      discountBasic: { value: this.getLocalizedPrice(59, 55), currency: this.currencyCode }
    },
    pro: {
      monthly: { value: this.getLocalizedPrice(189, 89), currency: this.currencyCode },
      annual: { value: this.getLocalizedPrice(169, 80), currency: this.currencyCode },
      discountPro: { value: this.getLocalizedPrice(189, 89), currency: this.currencyCode }
    }
  };
  public readonly faqItems = getFaqItems(this.pricing, this.currencyCode);

  @ViewChild('faqList', { static: false }) faqList!: ElementRef;
  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    if (this.isBrowser) {
      this.aspectRatio = window.innerWidth / window.innerHeight;
      if (this.aspectRatio > 1 && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.demoAccountUrl.searchParams.set('login', environment.config.demoAccount.login);
    this.demoAccountUrl.searchParams.set('password', environment.config.demoAccount.password);
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: [''],
      message: ['']
    });
  }

  private getLocalizedPrice(pricePLN: number, priceUSD: number): number {
    return this.currencyCode === 'PLN' ? pricePLN : priceUSD;
  }

  public get hostString(): string {
    return environment.config.host;
  }

  public ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.initializeSocialShareSeoService();
    }
    if (this.isBrowser) {
      this.aspectRatio = window.innerWidth / window.innerHeight;
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intlTelInput = intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'auto',
        strictMode: true,
        separateDialCode: true,
        countryOrder: ['dk', 'pl', 'ua'],
        // @ts-ignore
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/21.1.3/js/utils.js',
        geoIpLookup: callback => {
          fetch("https://freeipapi.com/api/json")
            .then(res => res.json())
            .then(data => callback(data.countryCode))
            .catch(() => callback("us"));
        }
      });
    }
  }

  public initializeSocialShareSeoService() {
    this.socialShareSeoService.setUrl(this.hostString);
    this.socialShareSeoService.setTwitterSiteCreator('@beeoclock.biz');
    this.socialShareSeoService.setAuthor('Bee O`clock');
    this.socialShareSeoService.setTitle($localize`:@@seo.header.title:Bee O'clock`);
    this.socialShareSeoService.setDescription($localize`:@@seo.header.description:Bee O’clock is a unique management tool allowing your customers to book and pay for your services. You can also keep track of your performance to become the best version of yourself.`);
    this.socialShareSeoService.setKeywords($localize`:@@seo.header.keywords:appointment, calendar, clients, business, management, tool, bookkeeping, tax planning, event management, delegate, time-consuming tasks, empower, professionals, reduce stress, increase productivity, eliminate distractions, frustrations, running a business`);
    this.socialShareSeoService.setImage($localize`:@@seo.header.image:https://beeoclock.com/asset/logo.png`);
    this.socialShareSeoService.setAuthor($localize`:@@seo.header.author:Bee O'clock`);
    this.socialShareSeoService.setLocale(this.localeId);
  }

  private closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public toggleSubscription(type: 'monthly' | 'annual') {
    this.subscriptionType = type;
  }

  public toggleItem(index: number): void {
    const prevIndex = this.activeIndex;
    this.activeIndex = this.activeIndex === index ? null : index;

    if (!this.faqList) {
      console.error('faqList is not initialized yet');
      return;
    }

    const element = this.faqList.nativeElement;
    const openItems = element.querySelectorAll(".grid-rows-1fr") as NodeListOf<HTMLElement>;

    if (openItems.length > 0) {
      const totalHeight = Array.from(openItems).reduce((total, item) => total + item.scrollHeight, 0);
      this.faqMinHeight = `${totalHeight + 200}px`;
    } else {
      this.faqMinHeight = "200px";
    }

    if (prevIndex !== null && prevIndex !== index) {
      const selectedItem = element.querySelector(`#faq-item-${index}`) as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }

  public get isInvalid() {
    return (controlName: string) =>
      this.contactForm.get(controlName)?.invalid && this.contactForm.get(controlName)?.touched;
  }

  public onSubmit() {
    if (this.contactForm.valid) {
      this.isPopupOpen = true;
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  public closePopup() {
    this.isPopupOpen = false;
  }
}
