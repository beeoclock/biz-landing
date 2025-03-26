import {inject, Injectable, resource} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {TariffPlanDto,TariffApiResponse} from "../../../common/interface/i.tariffs";


@Injectable()
export class TariffsService {
  private readonly apiUrl = 'https://api-dev.beeoclock.com/tariff-plan/api/v1/paged?orderBy=createdAt&orderDir=desc&pageSize=3&page=1';
  private readonly httpClient = inject(HttpClient);

  public readonly tariffsResource = resource<TariffPlanDto[], void>({
    loader: async () => {
      const res$ = this.httpClient.get<TariffApiResponse>(this.apiUrl);
      const response = await lastValueFrom(res$);
      return response.items;
    }
  });

}
