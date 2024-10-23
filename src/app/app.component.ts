import {
  Component,
  LOCALE_ID,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import {environment} from "../environment/environment";
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {ChangeLanguageComponent} from "./component/change-language/change-language.component";
import {isPlatformBrowser, isPlatformServer, NgOptimizedImage} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {bootstrapCheck, bootstrapThreeDots, bootstrapXLg} from "@ng-icons/bootstrap-icons";
import {IMenuItem} from "../common/interface/i.menu-item";
import {MenuUseCase} from "./enum/menu-use-case.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    ChangeLanguageComponent,
    NgOptimizedImage,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({bootstrapXLg, bootstrapThreeDots, bootstrapCheck}),
    provideNgIconsConfig({
      size: '1em',
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
    { id: 7, name: $localize`Try a demo account`, link: '#', useCase: MenuUseCase.Mobile },
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
}
