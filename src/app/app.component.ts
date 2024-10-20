import {Component, HostListener, inject, OnInit} from '@angular/core';
import {environment} from "../environment/environment";
import {TranslateService} from "@ngx-translate/core";
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";
import {ChangeLanguageComponent} from "./component/change-language/change-language.component";
import {NgOptimizedImage} from "@angular/common";
import {NgIcon, provideIcons, provideNgIconsConfig} from "@ng-icons/core";
import {bootstrapThreeDots, bootstrapXLg} from "@ng-icons/bootstrap-icons";

enum MenuUseCase {
  Desktop,
  Mobile,
  Both
}

interface MenuItem {
  id: number;
  name: string;
  link: string;
  useCase: MenuUseCase;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ChangeLanguageComponent,
    NgOptimizedImage,
    NgIcon,
  ],
  viewProviders: [
    provideIcons({bootstrapXLg, bootstrapThreeDots}),
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

  public readonly menuItems: MenuItem[] = [
    { id: 1, name: $localize`Services`, link: '#', useCase: MenuUseCase.Both },
    { id: 2, name: $localize`Tariffs`, link: '#', useCase: MenuUseCase.Both },
    { id: 3, name: $localize`Reviews`, link: '#', useCase: MenuUseCase.Desktop },
    { id: 4, name: $localize`FAQ`, link: '#', useCase: MenuUseCase.Both },
    { id: 5, name: $localize`About Us`, link: '#', useCase: MenuUseCase.Desktop },
    { id: 6, name: $localize`Order a consultation`, link: '#', useCase: MenuUseCase.Mobile },
    { id: 7, name: $localize`Try a demo account`, link: '#', useCase: MenuUseCase.Mobile },
    { id: 8, name: $localize`Login`, link: '#', useCase: MenuUseCase.Mobile },
  ];


  private readonly translateService = inject(TranslateService);
  private readonly socialShareSeoService = inject(SocialShareSeoService);

  public readonly demoAccountUrl = new URL(environment.config.demoAccount.panelUrl);

  public readonly host = [environment.config.host, this.translateService.currentLang];
  public readonly consultationLink = environment.config.consultationLink;
  public isMobileMenuOpen = false;

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  constructor() {
    this.demoAccountUrl.searchParams.set('login', environment.config.demoAccount.login);
    this.demoAccountUrl.searchParams.set('password', environment.config.demoAccount.password);
    console.log($localize`Login`)

  }

  public get hostString(): string {
    return environment.config.host;
  }

  public ngOnInit() {
    this.initializeSocialShareSeoService();
    this.translateService.onLangChange.subscribe((event) => {
      this.host[1] = event.lang;
      this.initializeSocialShareSeoService();
    });
  }

  public initializeSocialShareSeoService() {
    this.socialShareSeoService.setUrl(this.hostString);
    this.socialShareSeoService.setTwitterSiteCreator('@beeoclock.biz');
    this.socialShareSeoService.setAuthor('Bee O`clock');
    const {title, description, keywords, image, author} = this.translateService.instant('seo.page.main');
    this.socialShareSeoService.setTitle(title);
    this.socialShareSeoService.setDescription(description);
    this.socialShareSeoService.setKeywords(keywords);
    this.socialShareSeoService.setImage(image);
    this.socialShareSeoService.setAuthor(author);
    this.socialShareSeoService.setLocale(this.translateService.currentLang);
  }

  private closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
