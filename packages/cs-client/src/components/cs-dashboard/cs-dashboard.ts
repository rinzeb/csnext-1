import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import {
  IProject,
  IDashboard,
  IWidget,
  MessageBusService
} from '@csnext/cs-core';
import {
  CsApp,
  AppState,
  Logger,
  guidGenerator,
  LayoutManager,
  DashboardManager
} from '../../';

@Component({
  name: 'cs-dashboard',
  template: require('./cs-dashboard.html'),
  props: {
    dashboard: null
  }
} as any)
export class CsDashboard extends Vue {
  public dashboard?: IDashboard;
  public app = AppState.Instance;

  @Watch('dashboard')
  public dashboardChanged(n: IDashboard, o: IDashboard) {
    this.initDashboard(n);
  }

  @Watch('dashboard.widgets', { immediate: true })
  public widgetsChanged(n: IWidget[], old: any) {
    if (n && n.length > 0) {
      n.forEach(w => {
        this.initWidget(w);
      });
    }
  }

  public checkWidgetId(widget: IWidget) {
    if (widget && !widget.id) {
      widget.id = 'widget-' + guidGenerator();
    }
  }

  public initWidget(widget: IWidget) {
    // init widget
    if (!widget) { return; }
    if (widget._initalized) {
      return;
    }
    if (!widget.events) {
      widget.events = new MessageBusService();
    }
    if (!widget.options) {
      widget.options = {};
    }
    if (!widget.data) {
      widget.data = {};
    }
    if (this.dashboard) {
      widget._dashboard = this.dashboard;
    }
    widget._project = AppState.Instance.project;
    this.checkWidgetId(widget);
    this.checkDefaultWidgetOptions(widget);

    // load datasource, if configured
    if (widget.datasource !== undefined) {
      this.app.loadDatasource(widget.datasource).then(d => {
        this.$nextTick(() => {
          Vue.set(widget, 'content', d);
        });
      });
    } else if (this.dashboard && this.dashboard.content) {
      Vue.set(widget, 'content', this.dashboard.content);
    }
    widget._initalized = true;
  }

  /** init dashboard: load datasources, init widgets and init manager  */
  public initDashboard(dashboard: IDashboard) {
    if (!dashboard.events) {
      dashboard.events = new MessageBusService();
    }
    if (dashboard.hideFromNavigation === undefined) {
      dashboard.hideFromNavigation = false;
    }

    if (!dashboard.options) {
      dashboard.options = {};
    }
    if (dashboard.options) { dashboard.options._dashboard = dashboard; }

    if (this.app.project.menus && dashboard.isMain) {
      const dashboardEditButton = this.app.project.menus.find(
        mi => mi.id === CsApp.DASHBOARD_EDIT_ID
      );
      if (dashboardEditButton) {
        dashboardEditButton.visible =
          dashboardEditButton && dashboard.options.EditButton;
      }
    }
    // if this is a main dashboard, set it as active dashboard on appstate
    if (dashboard.isMain) {
      this.app.activeDashboard = this.dashboard;
      this.app.bus.publish('dashboard.main', 'init', this.dashboard);
    }

    // init widgets
    if (this.dashboard && this.dashboard.widgets) {
      this.dashboard.widgets.forEach(w => {
        this.initWidget(w);
      });
    }

    // init dashboard manager
    if (dashboard.manager && !dashboard._manager) {
      if (
        DashboardManager.dashboardManagers.hasOwnProperty(dashboard.manager)
      ) {
        // instantiate manager
        dashboard._manager = DashboardManager.dashboardManagers[
          dashboard.manager
        ].getInstance();
        if (dashboard._manager) {
          // start manager
          dashboard._manager.start(dashboard);
        }
      }
    }
    if (dashboard._manager && dashboard._manager.dashboardLoaded) {
      dashboard._manager.dashboardLoaded(dashboard);
    }

    // load default datasource, if configured
    if (dashboard.datasource) {
      this.app
        .loadDatasource(dashboard.datasource)
        .catch(e => {
          if (!this.dashboard) {
            return;
          }
          Logger.error(
            'dashboard datasource',
            'error loading datasource ' + this.dashboard.datasource
          );
        })
        .then(d => {
          if (!this.dashboard) {
            return;
          }
          this.dashboard.content = d;

          // if there are widgets without dashboards, use dashboard content, note: only works for widgets that are initially defined
          if (this.dashboard.widgets) {
            this.dashboard.widgets.forEach(w => {
              if (!w.datasource && this.dashboard && this.dashboard.content) {
                Vue.set(w, 'content', this.dashboard.content);
              }
            });
          }

          // if dashboard manager availabe, trigger data loaded event
          if (this.dashboard._manager && this.dashboard._manager.dataLoaded) {
            this.dashboard._manager.dataLoaded(d);
          }
        });
    }
  }

  public created() {
    if (!this.dashboard) {
      return;
    }
    this.initDashboard(this.dashboard);
  }

  /** dashboard will be closed. */
  public beforeDestroy() {
    // call stop function for manager
    if (this.dashboard && this.dashboard._manager) {
      this.dashboard._manager.stop(this.dashboard);
    }
  }

  public get component(): Vue {
    if (this.dashboard) {
      // use default single layout, if no layout has been specified
      if (!this.dashboard.layout) {
        this.dashboard.layout = 'grid';
      }

      // lookup layout manager
      if (LayoutManager.layoutManagers.hasOwnProperty(this.dashboard.layout)) {
        return LayoutManager.layoutManagers[this.dashboard.layout].component;
      }
    }
    return new Vue();
  }

  private checkDefaultWidgetOptions(widget: IWidget) {
    if (
      !widget.options ||
      !widget._dashboard ||
      !widget._dashboard.defaultWidgetOptions
    ) {
      return;
    }
    if (widget._dashboard && widget._dashboard.defaultWidgetOptions) {
      for (const key in widget._dashboard.defaultWidgetOptions) {
        if (!widget.options.hasOwnProperty(key)) {
          widget.options[key] = widget._dashboard.defaultWidgetOptions[key];
        }
      }
    }
  }
}
