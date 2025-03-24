import {ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CurrencyCodePipe} from "../../../common/pipe/currency.pipe";
import {NgIcon} from "@ng-icons/core";
import {DecimalPipe, isPlatformBrowser, NgClass} from "@angular/common";
import {TariffsService} from "./tariffs.service";
import {PriceValue, TariffPlanDto} from "../../../common/interface/i.tariffs";
import {FeatureTranslatePipe} from "../../../common/pipe/feature-translate.pipe";
import {TariffType} from "../../enum/tariff-type.enum";

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyCodePipe,
    NgIcon,
    NgClass,
    FeatureTranslatePipe,
    DecimalPipe,
  ],
  providers: [TariffsService]
})
export class TariffsComponent implements OnInit {

  private readonly tariffsService = inject(TariffsService);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly tariffs = this.tariffsService.tariffsResource.value;
  public subscriptionType: 'monthly' | 'annual' = 'annual';
  public currencyCode = 'USD';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const locale = navigator.language;
      if (locale.startsWith('pl')) {
        this.currencyCode = 'PLN';
      } else if (locale.startsWith('da')) {
        this.currencyCode = 'EUR';
      } else {
        this.currencyCode = 'USD';
      }
    }
  }

  public toggleSubscription(type: 'monthly' | 'annual') {
    this.subscriptionType = type;
  }

  public getTariff(type: TariffType): TariffPlanDto | undefined {
    const tariffs = this.tariffsService.tariffsResource.value();
    return tariffs?.find(t => t.type.toLowerCase() === type.toLowerCase());
  }

  public getPrice(type: TariffType): PriceValue | undefined {
    const tariff = this.getTariff(type);
    const priceBlock = tariff?.prices.find(p => p.currency === this.currencyCode);
    return priceBlock?.values.find(v => v.billingCycle === (this.subscriptionType === 'annual' ? 'yearly' : 'monthly'));
  }

  public getDiscount(type: TariffType): number | null {
    const price = this.getPrice(type);
    return price && price.discountPercentage > 0 ? price.beforeDiscount : null;
  }

  public getFeatures(type: TariffType): string[] {
    return this.getTariff(type)?.features ?? [];
  }

  public getSpecialistLimitLabel(type: TariffType): string {
    const limit = this.getTariff(type)?.specialistLimit;
    if (limit === null) {
      return $localize`:@@unlimitedUsers:Members`;
    }
    return `${$localize`:@@specialists:Members`} ${limit}`;
  }

  public getMonthlyPriceIfAnnual(type: TariffType): number {
    const price = this.getPrice(type)?.afterDiscount ?? 0;
    return this.subscriptionType === 'annual' ? price / 12 : price;
  }

  protected readonly TariffType = TariffType;
}
