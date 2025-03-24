import {
  Component, effect,
  ElementRef,
  HostListener,
  inject,
  LOCALE_ID,
  OnInit,
  PLATFORM_ID, signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {isPlatformBrowser, isPlatformServer, NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {
  bootstrapAt,
  bootstrapCheck,
  bootstrapCheckCircleFill,
  bootstrapDashCircle,
  bootstrapEnvelope,
  bootstrapFacebook,
  bootstrapInstagram,
  bootstrapLinkedin,
  bootstrapPlusCircle,
  bootstrapThreeDots,
  bootstrapTwitterX,
  bootstrapXLg
} from "@ng-icons/bootstrap-icons";
import {IMenuItem} from "../common/interface/i.menu-item";
import {MenuUseCase} from "./enum/menu-use-case.enum";
import {ReactiveFormsModule} from "@angular/forms";
import {getFaqItems, IFaqItem, IPricing, IPricingPlan} from "../common/interface/i.faq-item";
import {ContactFormComponent} from "./component/smart/contact-form/contact-form.component";
import {TariffsComponent} from "./component/tariffs/tariffs.component";
import LanguagesPage from "./component/languages/languages.page";
import {TariffsService} from "./component/tariffs/tariffs.service";
import {environment} from "../../environments/develop/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIcon,
    NgClass,
    NgStyle,
    ReactiveFormsModule,
    ContactFormComponent,
    TariffsComponent,
    LanguagesPage
  ],
  providers: [TariffsService],
  viewProviders: [
    provideIcons({
      bootstrapXLg,
      bootstrapThreeDots,
      bootstrapCheck,
      bootstrapEnvelope,
      bootstrapInstagram,
      bootstrapAt,
      bootstrapFacebook,
      bootstrapTwitterX,
      bootstrapCheckCircleFill,
      bootstrapPlusCircle,
      bootstrapDashCircle,
      bootstrapLinkedin
    }),
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
    {id: 1, name: $localize`Services`, link: '#services', useCase: MenuUseCase.Both},
    {id: 2, name: $localize`Tariffs`, link: '#tariffs', useCase: MenuUseCase.Both},
    // { id: 3, name: $localize`Reviews`, link: '#reviews', useCase: MenuUseCase.Desktop },
    {id: 4, name: $localize`FAQ`, link: '#faq', useCase: MenuUseCase.Both},
    {id: 5, name: $localize`Contact`, link: '#contact', useCase: MenuUseCase.Desktop},
    {
      id: 6,
      name: $localize`Order a consultation`,
      link: 'https://beeoclock.com/uk/office',
      useCase: MenuUseCase.Mobile
    },
    {
      id: 7,
      name: $localize`Try a demo account`,
      link: `${environment.apiCrmUrl}/66f9378141ed7954254c40c8/event/calendar-with-specialists`,
      useCase: MenuUseCase.Mobile
    },
    {id: 8, name: $localize`Login`, link: `${environment.apiCrmUrl}/identity`, useCase: MenuUseCase.Mobile},
  ];

  private readonly localeId = inject(LOCALE_ID);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly socialShareSeoService = inject(SocialShareSeoService);
  private readonly isBrowser: boolean;
  private readonly tariffsService = inject(TariffsService);

  public readonly demoAccountUrl = new URL(environment.config.demoAccount.panelUrl);
  public readonly host = [environment.config.host, this.localeId];
  public readonly consultationLink = environment.config.consultationLink;
  public isMobileMenuOpen = false
  public aspectRatio: number | null = null;
  public activeIndex: number | null = null;
  public faqMinHeight = '200px';
  public readonly currentYear = new Date().getFullYear();
  public readonly faqItems = signal<IFaqItem[]>([]);
  public crmRegister = `${environment.apiCrmUrl}/identity/sign-up`
  public crmLogin = `${environment.apiCrmUrl}/identity`

  @ViewChild('faqList', {static: false}) faqList!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    if (this.isBrowser) {
      this.aspectRatio = window.innerWidth / window.innerHeight;
      if (this.aspectRatio > 1 && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }

  public constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.demoAccountUrl.searchParams.set('login', environment.config.demoAccount.login);
    this.demoAccountUrl.searchParams.set('password', environment.config.demoAccount.password);

    effect(() => {
      const pricing = this.buildMonthlyPricing();
      if (pricing) {
        if (pricing) {
          this.faqItems.set(getFaqItems(pricing as unknown as IPricing));
        }
      }
    });
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
        selectedItem.scrollIntoView({block: "nearest"});
      }
    }
  }

  private buildMonthlyPricing(): Record<string, { monthly: IPricingPlan }> | null {
    const tariffs = this.tariffsService.tariffsResource.value();
    if (!tariffs) return null;

    const currencyCode = this.getCurrencyByLocale(this.localeId);

    const pricing: Record<string, { monthly: IPricingPlan }> = {};

    tariffs.forEach(tariff => {
      const price = tariff.prices.find(p =>
        p.currency === currencyCode && p.values.some(v => v.billingCycle === 'monthly')
      );

      if (price) {
        const monthlyValue = price.values.find(v => v.billingCycle === 'monthly');

        if (monthlyValue) {
          pricing[tariff.type.toLowerCase()] = {
            monthly: {
              value: monthlyValue.afterDiscount,
              currency: price.currency
            }
          };
        }
      }
    });

    return Object.keys(pricing).length ? pricing : null;
  }

  private getCurrencyByLocale(locale: string): string {
    const localeCurrencyMap: Record<string, string> = {
      'pl': 'PLN',
      'da': 'EUR',
      'en': 'USD'
    };

    return localeCurrencyMap[locale.substring(0, 2)] || 'USD';
  }
}
