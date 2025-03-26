import {MenuUseCase} from "@src/core/enum/menu-use-case.enum";

export interface IMenuItem {
  id: number;
  name: string;
  link: string;
  useCase: MenuUseCase;
}
