import {ChangeDetectionStrategy, Component, effect, inject, LOCALE_ID, PLATFORM_ID, signal,} from '@angular/core';
import {DecimalPipe, isPlatformBrowser, isPlatformServer, NgClass} from '@angular/common';
import {CurrencyCodePipe} from '@src/common/pipe/currency.pipe';
import {NgIcon} from '@ng-icons/core';
import {TariffsService} from './tariffs.service';
import {FeatureTranslatePipe} from '@src/common/pipe/feature-translate.pipe';
import {environment} from "@src/environments/environment";
import {CurrencyCodeEnum} from "@src/core/enum/currency-code.enum";
import {ITariffPlan} from "@src/common/interface/i.tariffs";
import {TypeTariffPlanEnum} from "@src/core/enum/type.tariff-plan.enum";
import {BillingCycleEnum} from "@src/core/enum/billing-cycle.enum";
import {CountryCodeEnum} from "@src/core/enum/country-code.enum";
import {LanguageCodeEnum} from "@src/core/enum/language-code.enum";

@Component({
    selector: 'app-tariffs',
    standalone: true,
    templateUrl: './tariffs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CurrencyCodePipe,
        NgIcon,
        NgClass,
        DecimalPipe,
        FeatureTranslatePipe,
    ],
})
export class TariffsComponent {
    private readonly tariffsService = inject(TariffsService);
    private readonly localeId = inject(LOCALE_ID);
    private readonly platformId = inject(PLATFORM_ID);

    public readonly items = signal<ITariffPlan.DTO[]>([]);

    public readonly typeTariffPlanEnum = TypeTariffPlanEnum;
    public readonly billingCycleEnum = BillingCycleEnum;

    public readonly subscriptionType = signal(BillingCycleEnum.yearly);

    public currencyCode: CurrencyCodeEnum = CurrencyCodeEnum.USD;
    public crmLogin = `${environment.apiCrmUrl}/identity`;

    public getGuessedCountryCode() {

        if (isPlatformServer(this.platformId)) {
            return {
                language: LanguageCodeEnum.pl,
                country: CountryCodeEnum.PL,
            }
        }

        // Визначаємо мову браузера
        const language: string = navigator.language || (navigator as any).userLanguage;

        // Витягуємо код країни з мови, наприклад "pl-PL" → "PL"
        const parts = language.split('-');
        const country = parts.length > 1 ? parts[1].toUpperCase() : CountryCodeEnum.PL;

        return {language, country} as {
            language: LanguageCodeEnum,
            country: CountryCodeEnum,
        };
    }

    public constructor() {
        effect(() => {
            this.prepareItems();
        });
        if (isPlatformBrowser(this.platformId)) {
            const locale = this.localeId[0] + this.localeId[1];
            if (locale.startsWith('pl')) {
                this.currencyCode = CurrencyCodeEnum.PLN;
            } else if (locale.startsWith('da')) {
                this.currencyCode = CurrencyCodeEnum.EUR;
            } else {
                this.currencyCode = CurrencyCodeEnum.USD;
            }
        }

    }

    public setSubscriptionType(type: BillingCycleEnum) {
        this.subscriptionType.set(type);
        this.prepareItems();
    }

    private prepareItems() {
        this.items.set([]);

        const {country, language} = this.getGuessedCountryCode();

        this.tariffsService.tariffsResource.value().forEach((item) => {
            const priceForSubscriptionTypeAndCountry = this.takePriceForParams({
                item,
                subscriptionType: this.subscriptionType(),
                country,
                language,
            });
            if (!priceForSubscriptionTypeAndCountry.length) {
                return;
            }
            const price = this.chooseOnlyTheMostSuitablePrice(priceForSubscriptionTypeAndCountry, country);
            if (!price) {
                return;
            }
            const prices = [price];
            const dto = {
                ...item,
                prices,
            };
            this.items.update((list) => {
                list.push(dto);
                return list;
            });
        });

        this.items.update((list) => {
            list.reverse();
            return list;
        });

    }

    /**
     * The more specific the country, the better
     * @param prices
     * @param country
     * @private
     */
    private chooseOnlyTheMostSuitablePrice(prices: ITariffPlan.IPrice[], country: CountryCodeEnum): ITariffPlan.IPrice | undefined {
        let foundPrice = undefined;

        for (const price of prices) {
            if (price.country === country) {
                foundPrice = price;
                break;
            }
            if (foundPrice) {
                if (regionsPriority[price.region] < regionsPriority[foundPrice.region]) {
                    foundPrice = price;
                }
            } else {
                foundPrice = price;
            }
        }

        return foundPrice;
    }

    private takePriceForParams(params: {
        item: ITariffPlan.DTO;
        subscriptionType: BillingCycleEnum;
        country: CountryCodeEnum;
        language: LanguageCodeEnum;
    }) {
        const {item, subscriptionType, country, language} = params;
        return item.prices.reduce((acc, price) => {
            if (this.currencyCode !== price.currency) {
                return acc;
            }
            const takeCurrentSubscriptionType = price.values.filter((value) => {
                return value.billingCycle === subscriptionType;
            });
            const languageVersions = price.languageVersions.filter((languageVersion) => {
                return languageVersion.language === language;
            })
            if (takeCurrentSubscriptionType.length) {
                acc.push({
                    ...price,
                    values: takeCurrentSubscriptionType,
                    languageVersions,
                });
            }
            return acc;
        }, <ITariffPlan.IPrice[]>[]);
    }

    public getSpecialistLimitLabel(type: TypeTariffPlanEnum): string {
        const tariffs = this.items();
        const limit = this.getTariff(type, tariffs)?.specialistLimit;
        if (limit === null || limit === undefined) {
            return $localize`:@@unlimitedUsers:Members` + ' ∞';
        }
        return `${$localize`:@@specialists:Members`} ${limit}`;
    }


    public getTariff(type: TypeTariffPlanEnum, tariffs: ITariffPlan.DTO[]): ITariffPlan.DTO | undefined {
        return tariffs?.find(t => t.type?.toLowerCase() === type.toLowerCase());
    }

}

enum RegionEnum {
    EU = 'EU',
    WORLD = 'WORLD',
}

const regionsWithCountryCodeRecord = {
    [RegionEnum.EU]: [
        CountryCodeEnum.PL,
        CountryCodeEnum.DK,
    ],
    [RegionEnum.WORLD]: [
        CountryCodeEnum.UA,
        CountryCodeEnum.GB,
    ],
}

const regionsPriority = {
    [RegionEnum.EU]: 0,
    [RegionEnum.WORLD]: 1,
};
