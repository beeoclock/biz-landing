import {Component, inject, OnInit} from '@angular/core';
import {environment} from "../environment/environment";
import {TranslateService} from "@ngx-translate/core";
import {SocialShareSeoService} from "../common/cdk/social-share.seo.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    host: {
        'class': 'flex flex-col'
    }
})
export class AppComponent implements OnInit {

    private readonly translateService = inject(TranslateService);
    private readonly socialShareSeoService = inject(SocialShareSeoService);

    public readonly host = [environment.config.host, this.translateService.currentLang];

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


}
