import {Component, HostListener, inject, LOCALE_ID, OnInit, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {isPlatformBrowser, isPlatformServer, NgClass, NgOptimizedImage} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {bootstrapCheck, bootstrapThreeDots, bootstrapXLg} from "@ng-icons/bootstrap-icons";
import {IMenuItem} from "../common/interface/i.menu-item";
import {MenuUseCase} from "./enum/menu-use-case.enum";
import {environment} from "../environments/environment";
import {CurrencyCodePipe} from "../common/pipe/currency.pipe";

type Currency = 'PLN' | 'DKK' | 'USD';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIcon,
    NgClass,
    CurrencyCodePipe
  ],
  viewProviders: [
    provideIcons({bootstrapXLg, bootstrapThreeDots, bootstrapCheck}),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
  host: {
    'class': 'flex flex-col'
  },
})


export class AppComponent implements OnInit {
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

  private readonly localeId = inject(LOCALE_ID);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly socialShareSeoService = inject(SocialShareSeoService);
  private readonly isBrowser: boolean;

  public readonly demoAccountUrl = new URL(environment.config.demoAccount.panelUrl);

  public readonly host = [environment.config.host, this.localeId];
  public readonly consultationLink = environment.config.consultationLink;
  public isMobileMenuOpen = false;
  public aspectRatio: number | null = null;
  public subscriptionType: 'monthly' | 'annual' = 'monthly';
  public currencyCode: Currency = $localize`:@@currencyCode:USD` as Currency;

  pricing = {
    free: {
      monthly: { PLN: 0, DKK: 0, USD: 0 },
      annual: { PLN: 0, DKK: 0, USD: 0 }
    },
    basic: {
      monthly: { PLN: 59, DKK: 45, USD: 55 },
      annual: { PLN: 53, DKK: 40, USD: 49 },
      discountBasic: { PLN: 59, DKK: 45, USD: 55 }
    },
    pro: {
      monthly: { PLN: 189, DKK: 140, USD: 89 },
      annual: { PLN: 169, DKK: 125, USD: 80 },
      discountPro: { PLN: 189, DKK: 140, USD: 89}
    }
  };

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
    this.setCurrencyByLocale();
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

  private setCurrencyByLocale() {
    const localeToCurrency: Record<string, Currency> = {
      'pl': 'PLN',
      'da': 'DKK',
    };
    const languageCode = this.localeId.split('-')[0];
    this.currencyCode = localeToCurrency[languageCode] || 'USD';
  }
}
