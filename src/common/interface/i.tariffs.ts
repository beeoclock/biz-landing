import {TypeTariffPlanEnum} from "@src/core/enum/type.tariff-plan.enum";
import {StateEnum} from "@src/core/enum/state.enum";
import {CurrencyCodeEnum} from "@src/core/enum/currency-code.enum";
import {RegionCodeEnum} from "@src/core/enum/region-code.enum";
import {CountryCodeEnum} from "@src/core/enum/country-code.enum";
import {LanguageCodeEnum} from "@src/core/enum/language-code.enum";
import {BillingCycleEnum} from "@src/core/enum/billing-cycle.enum";

export namespace ITariffPlan {

  export interface ILanguageVersion {
    title: string;
    description: string;
    language: LanguageCodeEnum;
  }

  export interface IValue {
    billingCycle: BillingCycleEnum;
    beforeDiscount: number;
    afterDiscount: number;
    discountPercentage: number;
  }

  export interface IPrice {
    values: IValue[];
    country?: CountryCodeEnum;
    region: RegionCodeEnum;
    currency: CurrencyCodeEnum;
    languageVersions: ILanguageVersion[];
    createdAt: string;
    updatedAt: string;
  }

  export interface IPluginAttachment {
    includeAll: boolean;
    excludeAll: boolean;
    includeList: string[];
    excludeList: string[];
  }

  export interface DTO {
    type: TypeTariffPlanEnum;
    prices: IPrice[];
    isPerSpecialist: boolean;
    specialistLimit: number | null;
    features: string[];
    pluginAttachment: IPluginAttachment;

    _id: string;
    createdAt: string;
    updatedAt: string;
    object: 'TariffPlanDto';
    state: StateEnum;

    stateHistory: {
      state: StateEnum;
      setAt: string;
    }[];
  }

}
