import Vue from 'vue';
import Component from 'vue-class-component';
import { IWidget } from '@csnext/cs-core';
import './intro-widget.css';
import { AppState } from '../..';
import { IntroWidgetOptions } from './intro-widget-options';

@Component({
  name: 'cs-intro-widget',
  template: require('./intro-widget.html'),
  props: {
    widget: null
  }
} as any)
export class CsIntroWidget extends Vue {
  public widget?: IWidget;

  public app = AppState.Instance;

  public get options(): IntroWidgetOptions | undefined {
    if (!this.widget || !this.widget.options) {
      return undefined;
    }
    return this.widget.options as IntroWidgetOptions;
  }

  constructor() {
    super();
  }
}
