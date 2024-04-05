import {Component, inject, OnInit} from '@angular/core';
import {environment} from "../environment/environment";
import {TranslateService} from "@ngx-translate/core";

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

    public readonly host = [environment.config.host, this.translateService.currentLang];

    public get hostString(): string {
        return this.host.join('/');
    }

    public ngOnInit() {
        this.translateService.onLangChange.subscribe((event) => {
            this.host[1] = event.lang;
        });
    }


}
