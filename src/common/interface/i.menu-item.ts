import {MenuUseCase} from "../../app/enum/menu-use-case.enum";

export interface IMenuItem {
  id: number;
  name: string;
  link: string;
  useCase: MenuUseCase;
}
