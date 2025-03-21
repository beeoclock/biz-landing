import {Component, inject, LOCALE_ID} from '@angular/core';
import {CurrencyCodePipe} from "../../../common/pipe/currency.pipe";
import {NgIcon} from "@ng-icons/core";
import {NgClass} from "@angular/common";
import {TariffsService} from "./tariffs.service";
import {PriceValue, TariffPlanDto} from "../../../common/interface/i.tariffs";

@Component({
  selector: 'app-tariffs',
  imports: [
    CurrencyCodePipe,
    NgIcon,
    NgClass
  ],
  templateUrl: './tariffs.component.html',
  providers: [TariffsService]
})
export class TariffsComponent {

  private readonly localeId = inject(LOCALE_ID);
  private readonly tariffsService = inject(TariffsService);
  public readonly tariffs = this.tariffsService.tariffsResource.value
  public subscriptionType: 'monthly' | 'annual' = 'annual';
  public readonly currencyCode: string = this.localeId.startsWith('pl') ? 'PLN' : 'USD';

  public toggleSubscription(type: 'monthly' | 'annual') {
    this.subscriptionType = type;
  }

  public getTariff(type: string): TariffPlanDto | undefined {
    const tariffs = this.tariffsService.tariffsResource.value();
    return tariffs?.find((t: { type: string; }) => t.type.toLowerCase() === type.toLowerCase());
  }

  public getPrice(type: string): PriceValue | undefined {
    const tariff = this.getTariff(type);
    const priceBlock = tariff?.prices.find(p => p.currency === this.currencyCode);

    return priceBlock?.values.find(v => v.billingCycle === (this.subscriptionType === 'annual' ? 'yearly' : 'monthly'));
  }

  public getDiscount(type: string): number | null {
    const price = this.getPrice(type);
    return price && price.discountPercentage > 0 ? price.beforeDiscount : null;
  }
}
