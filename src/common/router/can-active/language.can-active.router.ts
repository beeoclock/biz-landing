import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {inject} from "@angular/core";
import {isSupportedLanguageCodeEnum} from "../../../app/enum/language-code.enum";

export const languageCanActiveRouter: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {

    const translateService = inject(TranslateService);

    const {language} = route.params;

    if (language) {

        if (isSupportedLanguageCodeEnum(language)) {
            translateService.use(language);
        }

    }

    return true;
};
