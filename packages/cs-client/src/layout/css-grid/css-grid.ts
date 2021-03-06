import Vue from 'vue';
import Component from 'vue-class-component';
import {
  IDashboard,
  ILayoutManagerConfig,
  GridDashboardOptions,
  IWidget} from '@csnext/cs-core';
import { LayoutManager } from '../..';

import './css-grid.css';
import { GridWidgetOptions } from './css-grid-widget-options';

@Component({
  template: require('./css-grid.html'),
  props: {
    dashboard: null
  }
} as any)
export class CssGrid extends Vue {
  public dashboard?: IDashboard;

  public gridStyle() {
    if (!this.dashboard) {
      return;
    }
    const style = {} as any;
    const options = this.dashboard.options as GridDashboardOptions;

    return { 'grid-template-columns': 'repeat(auto-fill, minmax(250px,1fr))' };
  }

  public gridWidgetClass(widget: IWidget) {
    const style: any = {};
    const options = widget.options as GridWidgetOptions;
    if (options.columnStart) {
      style['grid-column-start'] = options.columnStart;
    }
    if (options.columnEnd) {
      style['grid-column-end'] = options.columnEnd;
    }
    if (options.rowStart) {
      style['grid-row-start'] = options.rowStart;
    }
    if (options.rowEnd) {
      style['grid-row-end'] = options.rowEnd;
    }
    return style;
  }
}

LayoutManager.add({
  id: 'css-grid',
  name: 'css-grid page',
  component: CssGrid
} as ILayoutManagerConfig);
