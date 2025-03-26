import {Injectable} from "@angular/core";
import {ApiAdapter} from "@src/core/adapter/api.adapter";
import {ITariffPlan} from "@src/common/interface/i.tariffs";
import {IResponseList} from "@src/common/interface/i.response-list";


@Injectable()
export class GetTariffPlanApiAdapter extends ApiAdapter<IResponseList<ITariffPlan.DTO>> {

  public override execute$() {
    const url = this.prepareUrl('/tariff-plan/api/v1/paged');
    return this.httpClient.get<IResponseList<ITariffPlan.DTO>>(url, {
      params: {
        platformId: this.platformId.toString(),
        cacheBuster: this.cacheBuster,
        orderBy: 'createdAt',
        orderDir: 'desc',
        pageSize: '3',
        page: '1',
      },
    });
  }

}
