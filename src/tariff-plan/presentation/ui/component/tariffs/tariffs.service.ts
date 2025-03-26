import {inject, Injectable, resource} from "@angular/core";
import {GetTariffPlanApiAdapter} from "../../../../infrastructure/data-source/get.tariff-plan.api.adapter";
import {ITariffPlan} from "@src/common/interface/i.tariffs";


@Injectable()
export class TariffsService {

  private readonly getTariffPlanApiAdapter = inject(GetTariffPlanApiAdapter);

  public readonly tariffsResource = resource<ITariffPlan.DTO[], void>({
    defaultValue: [],
    loader: async () => {
      const response = await this.getTariffPlanApiAdapter.executeAsync();
      return response.items;
    }
  });

}
