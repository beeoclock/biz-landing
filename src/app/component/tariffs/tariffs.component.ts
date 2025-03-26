import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {DecimalPipe, isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import { CurrencyCodePipe } from '../../../common/pipe/currency.pipe';
import { NgIcon } from '@ng-icons/core';
import { TariffsService } from './tariffs.service';
import {
  PriceValue,
  TariffPlanDto,
} from '../../../common/interface/i.tariffs';
import { FeatureTranslatePipe } from '../../../common/pipe/feature-translate.pipe';
import { TariffType } from '../../enum/tariff-type.enum';
import {environment} from "../../../environments/environment";

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
    NgIf,
  ],
  providers: [TariffsService],
})
export class TariffsComponent {
  private readonly tariffsService = inject(TariffsService);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly tariffs = computed(() => this.tariffsService.tariffsResource.value() ?? []);

  public subscriptionType: 'monthly' | 'annual' = 'annual';
  public currencyCode = 'USD';
  protected readonly TariffType = TariffType;
  public crmLogin = `${environment.apiCrmUrl}/identity`

  constructor() {
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

  public getTariff(type: TariffType, tariffs: TariffPlanDto[] | undefined): TariffPlanDto | undefined {
    if (!tariffs || !Array.isArray(tariffs)) return undefined;
    return tariffs.find(t => t?.type?.toLowerCase() === type.toLowerCase());
  }

  public getPrice(type: TariffType, tariffs: TariffPlanDto[] | undefined): PriceValue | undefined {
    if (!tariffs) return undefined;
    const tariff = this.getTariff(type, tariffs);
    if (!tariff?.prices?.length) return undefined;
    const priceBlock = tariff.prices.find(p => p.currency === this.currencyCode);
    if (!priceBlock?.values?.length) return undefined;
    return priceBlock.values.find(v => v.billingCycle === this.getBillingCycle());
  }

  private getBillingCycle(): 'monthly' | 'yearly' {
    return this.subscriptionType === 'annual' ? 'yearly' : 'monthly';
  }

  public getDiscount(type: TariffType, tariffs: TariffPlanDto[] | undefined): number | null {
    const price = this.getPrice(type, tariffs);
    return price && price.discountPercentage > 0 ? price.beforeDiscount : null;
  }

  public getFeatures(type: TariffType, tariffs: TariffPlanDto[] | undefined): string[] {
    return this.getTariff(type, tariffs)?.features ?? [];
  }

  public getSpecialistLimitLabel(type: TariffType, tariffs: TariffPlanDto[] | undefined): string {
    const limit = this.getTariff(type, tariffs)?.specialistLimit;
    if (limit === null || limit === undefined) {
      return $localize`:@@unlimitedUsers:Members`;
    }
    return `${$localize`:@@specialists:Members`} ${limit}`;
  }

  public getMonthlyPriceIfAnnual(type: TariffType, tariffs: TariffPlanDto[] | undefined): number {
    const price = this.getPrice(type, tariffs)?.afterDiscount ?? 0;
    return this.subscriptionType === 'annual' ? price / 12 : price;
  }

  public getMonthlyBeforeDiscount(type: TariffType, tariffs: TariffPlanDto[] | undefined): number {
    const price = this.getPrice(type, tariffs);
    if (!price) return 0;

    if (this.subscriptionType === 'annual') {
      return price.beforeDiscount / 12;
    }

    return price.beforeDiscount;
  }
}
