import { IMenu } from './menu';

export class WidgetOptions {
  public datasource?: string;
  public card?: boolean;
  public class?: string;
  public width?: number;
  public height?: number;
  public margin?: number;
  public x?: number;
  public y?: number;
  public background?: boolean;
  public canRemove?: boolean;
  public canEdit?: boolean;
  public menus?: IMenu[];
  public widgetBorder?: string;
}
