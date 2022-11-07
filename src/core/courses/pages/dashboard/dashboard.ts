// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Component,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList
} from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";
import { CoreEventsProvider } from "@providers/events";
import { CoreSitesProvider } from "@providers/sites";
import { CoreDomUtilsProvider } from "@providers/utils/dom";
import { CoreTabsComponent } from "@components/tabs/tabs";
import { CoreBlockDelegate } from "@core/block/providers/delegate";
import { CoreBlockComponent } from "@core/block/components/block/block";
import { CoreSiteHomeProvider } from "@core/sitehome/providers/sitehome";
import { CoreSiteHomeIndexComponent } from "@core/sitehome/components/index/index";
import { CoreCoursesProvider } from "../../providers/courses";
import { CoreCoursesDashboardProvider } from "../../providers/dashboard";
import { CoreCoursesMyCoursesComponent } from "../../components/my-courses/my-courses";
import { CoreCourseProvider } from "@core/course/providers/course";
import { CoreCourseHelperProvider } from "@core/course/providers/helper";
import { CoreCourseModulePrefetchDelegate } from "@core/course/providers/module-prefetch-delegate";
import { CoreSite } from "@classes/site";
import { CoreDbProvider } from '../../../../providers/db';
import { SQLiteDB, SQLiteDBTableSchema } from '@classes/sqlitedb';
import { Strings } from '../../../../syncology/configs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


/**
 * Page that displays the dashboard.
 */
@IonicPage({ segment: "core-courses-dashboard" })
@Component({
  selector: "page-core-courses-dashboard",
  templateUrl: "dashboard.html"
})
export class CoreCoursesDashboardPage implements OnDestroy {
  @ViewChild(CoreTabsComponent)
  tabsComponent: CoreTabsComponent;
  @ViewChild(CoreSiteHomeIndexComponent)
  siteHomeComponent: CoreSiteHomeIndexComponent;
  @ViewChildren(CoreBlockComponent)
  blocksComponents: QueryList<CoreBlockComponent>;
  @ViewChild(CoreCoursesMyCoursesComponent)
  mcComponent: CoreCoursesMyCoursesComponent;

  hasOfflineRatings: boolean;
  firstSelectedTab: number;
  siteHomeEnabled = false;
  tabsReady = false;
  searchEnabled: boolean;
  tabs = [];
  siteName: string;
  blocks: any[];
  announcementsBlock: any;
  dashboardEnabled = false;
  userId: number;
  dashboardLoaded = false;
  announcementsEnabled: boolean;
  announcementsLoaded = false;
  childrenLoaded = false;
  section: any;
  siteHomeId: number;
  currentSite: CoreSite;
  forum: any;
  availabilityMessage: string;
  canAddDiscussion = false;

  downloadEnabled: boolean;
  downloadEnabledIcon = "square-outline"; // Disabled by default.
  downloadCourseEnabled: boolean;
  downloadCoursesEnabled: boolean;

  protected trackPosts = false;
  protected canPin = false;
  protected isDestroyed;
  protected updateSiteObserver;
  protected db: SQLiteDB;
  protected DBNAME = 'MoodleMobile';

  protected coreAppSchema: SQLiteDBTableSchema = {
    name: 'schema_news_tracker',
    columns: [
      {
          name: 'key',
          type: 'TEXT',
          primaryKey: true
      },
      {
          name: 'value',
          type: 'INTEGER'
      }
  ]
};

  constructor(
    private navCtrl: NavController,
    private coursesProvider: CoreCoursesProvider,
    private sitesProvider: CoreSitesProvider,
    private siteHomeProvider: CoreSiteHomeProvider,
    private eventsProvider: CoreEventsProvider,
    private dashboardProvider: CoreCoursesDashboardProvider,
    private domUtils: CoreDomUtilsProvider,
    private courseProvider: CoreCourseProvider,
    private blockDelegate: CoreBlockDelegate,
    private courseHelper: CoreCourseHelperProvider,
    private prefetchDelegate: CoreCourseModulePrefetchDelegate,
    protected dbProvider: CoreDbProvider,
    private alertCtrl: AlertController,
    private http: HttpClient

  ) {
    this.db = dbProvider.getDB(this.DBNAME);
    this.db.createTableFromSchema(this.coreAppSchema);

    this.currentSite = sitesProvider.getCurrentSite();
    this.siteHomeId = this.currentSite.getSiteHomeId();
    this.loadSiteName();
  }

  /**
   * View loaded.
   */
  ionViewDidLoad(): void {
    console.log("eh da ion view did load");
    document.addEventListener(
      "resume",
      () => {
        this.refreshDashboard(null);
        this.refreshMyCourses(null);
        this.get_children();
      },
      false
    );
    this.searchEnabled = !this.coursesProvider.isSearchCoursesDisabledInSite();
    this.downloadCourseEnabled = !this.coursesProvider.isDownloadCourseDisabledInSite();
    this.downloadCoursesEnabled = !this.coursesProvider.isDownloadCoursesDisabledInSite();

    // Refresh the enabled flags if site is updated.
    this.updateSiteObserver = this.eventsProvider.on(
      CoreEventsProvider.SITE_UPDATED,
      () => {
        this.searchEnabled = !this.coursesProvider.isSearchCoursesDisabledInSite();
        this.downloadCourseEnabled = !this.coursesProvider.isDownloadCourseDisabledInSite();
        this.downloadCoursesEnabled = !this.coursesProvider.isDownloadCoursesDisabledInSite();

        this.switchDownload(this.downloadEnabled);

        this.loadSiteName();
      },
      this.sitesProvider.getCurrentSiteId()
    );

    const promises = [];

    promises.push(
      this.siteHomeProvider.isAvailable().then(enabled => {
        // Always hide sitehome tab (changed for syncology standard)
        this.siteHomeEnabled = false;
      })
    );

    promises.push(this.loadDashboardContent());

    ////promises.push(this.loadAnnouncements());

    // Decide which tab to load first.
    Promise.all(promises).finally(() => {
      if (this.siteHomeEnabled && this.dashboardEnabled) {
        const site = this.sitesProvider.getCurrentSite(),
          displaySiteHome = site.getInfo() && site.getInfo().userhomepage === 0;

        this.firstSelectedTab = displaySiteHome ? 0 : 1;
      } else {
        this.firstSelectedTab = 0;
      }
      this.announcementsLoaded = true;
      this.tabsReady = true;
    });
  }

  /**
   * User entered the page.
   */
  ionViewDidEnter(): void {
    this.tabsComponent && this.tabsComponent.ionViewDidEnter();
  }

  /**
   * User left the page.
   */
  ionViewDidLeave(): void {
    this.tabsComponent && this.tabsComponent.ionViewDidLeave();
  }

  /**
   * Go to search courses.
   */
  openSearch(): void {
    this.navCtrl.push("CoreCoursesSearchPage");
  }

  /**
   * Load the site name.
   */
  protected loadSiteName(): void {
    this.siteName = Strings.APP_NAME ? Strings.APP_NAME : this.sitesProvider.getCurrentSite().getSiteName();
  }

  /**
   * Convenience function to fetch the announcements.
   *
   * @return Promise resolved when done.
   */
  protected loadAnnouncements(): Promise<any> {
    this.announcementsEnabled = false;

    const config = this.currentSite.getStoredConfig() || { numsections: 1 };

    if (config.frontpageloggedin) {
      // Items with index 1 and 3 were removed on 2.5 and not being supported in the app.
      const frontpageItems = [
          "news", // News items.
          false,
          "categories", // List of categories.
          false,
          "categories", // Combo list.
          "enrolled-course-list", // Enrolled courses.
          "all-course-list", // List of courses.
          "course-search" // Course search box.
        ],
        items = config.frontpageloggedin.split(",");

      items.forEach(itemNumber => {
        // Get the frontpage item "name".
        const item = frontpageItems[parseInt(itemNumber, 10)];
        if (!item) {
          return;
        }
        if (item === "news") this.announcementsEnabled = true;
      });
    }

    return this.courseProvider
      .getSections(this.siteHomeId, false, true)
      .then(sections => {
        // Check "Include a topic section" setting from numsections.
        this.section = config.numsections
          ? sections.find(section => section.section == 1)
          : false;
        if (this.section) {
          this.section.hasContent = this.courseHelper.sectionHasContent(
            this.section
          );
          this.announcementsLoaded =
            this.courseHelper.addHandlerDataForModules(
              [this.section],
              this.siteHomeId,
              undefined,
              undefined,
              true
            ) || this.announcementsLoaded;
        }

        // Add log in Moodle.
        this.courseProvider
          .logView(
            this.siteHomeId,
            undefined,
            undefined,
            this.currentSite && this.currentSite.getInfo().sitename
          )
          .catch(() => {
            // Ignore errors.
          });
      })
      .catch(error => {
        this.domUtils.showErrorModalDefault(
          error,
          "core.course.couldnotloadsectioncontent",
          true
        );
      });
  }

  /**
   * Convenience function to fetch the dashboard data.
   *
   * @return Promise resolved when done.
   */
  protected loadDashboardContent(): Promise<any> {
    return this.dashboardProvider
      .isAvailable()
      .then(available => {
        if (available) {
          this.userId = this.sitesProvider.getCurrentSiteUserId();
         this.get_children()
          return this.dashboardProvider
            .getDashboardBlocks()
            .then(blocks => {
              this.blocks = blocks;
              for(var block of blocks) {
                if (block.name === "news_items") this.announcementsBlock = block;
              }
            })
            .catch(error => {
              this.domUtils.showErrorModal(error);

              // Cannot get the blocks, just show dashboard if needed.
              this.loadFallbackBlocks();
            });
        } else if (!this.dashboardProvider.isDisabledInSite()) {
          // Not available, but not disabled either. Use fallback.
          this.loadFallbackBlocks();
        } else {
          // Disabled.
          this.blocks = [];
        }
      })
      .finally(() => {
        this.dashboardEnabled = this.blockDelegate.hasSupportedBlock(
          this.blocks
        );
        this.dashboardLoaded = true;
      });
  }

  /**
   * Refresh the dashboard data.
   *
   * @param refresher Refresher.
   */
   async get_children(){
   this.get_children_data().subscribe(data=>{
    console.log("alihaider",data)
    if(!data){
      this.childrenLoaded=false
    }else {
      this.childrenLoaded=true

    }
   debugger

   })
   }

   get_children_data(): Observable<any>{
    let userid = this.sitesProvider.getCurrentSiteUserId();;
    let url = `https://national.future-schools.co/webservice/rest/server.php?wstoken=6cfa7f60bf579ba0d59b779bad638364&wsfunction=get_child&moodlewsrestformat=json&parentid=${userid}`
    var response =this.http.get(url);
    return response
  }
  refreshDashboard(refresher: any): void {
    // Refresh announcements
    this.refreshAnnouncements();

    const promises = [];

    promises.push(this.dashboardProvider.invalidateDashboardBlocks());

    // Invalidate the blocks.
    this.blocksComponents.forEach(blockComponent => {
      promises.push(
        blockComponent.invalidate().catch(() => {
          // Ignore errors.
        })
      );
    });

    Promise.all(promises).finally(() => {
      this.loadDashboardContent().finally(() => {
        if (refresher) refresher.complete();
      });
    });
  }

  /**
   * Refresh announcements, the dashboard data and My Courses.
   *
   * @param refresher Refresher.
   */
  refreshMyCourses(refresher: any): void {
    // Refresh announcements
    this.refreshAnnouncements();
    // First, refresh dashboard blocks, maybe a new block was added and now we can display the dashboard.
    this.dashboardProvider
      .invalidateDashboardBlocks()
      .finally(() => {
        return this.loadDashboardContent();
      })
      .finally(() => {
        if (!this.dashboardEnabled) {
          // Dashboard still not enabled. Refresh my courses.
          this.mcComponent && this.mcComponent.refreshCourses(refresher);
        } else {
          this.tabsComponent.selectTab(1);
          if (refresher) refresher.complete();
        }
      });
  }

  /**
   * Refresh the announcements.
   */
  refreshAnnouncements(): void {
    const promises = [];

    promises.push(this.courseProvider.invalidateSections(this.siteHomeId));
    promises.push(
      this.currentSite.invalidateConfig().then(() => {
        // Config invalidated, fetch it again.
        return this.currentSite.getConfig().then(config => {
          this.currentSite.setConfig(config);
        });
      })
    );

    if (this.section && this.section.modules) {
      // Invalidate modules prefetch data.
      promises.push(
        this.prefetchDelegate.invalidateModules(
          this.section.modules,
          this.siteHomeId
        )
      );
    }

    Promise.all(promises).finally(() => {
      return this.loadAnnouncements();
    });
  }

  /**
   * Toggle download enabled.
   */
  toggleDownload(): void {
    this.switchDownload(!this.downloadEnabled);
  }

  /**
   * Convenience function to switch download enabled.
   *
   * @param enable If enable or disable.
   */
  protected switchDownload(enable: boolean): void {
    this.downloadEnabled =
      (this.downloadCourseEnabled || this.downloadCoursesEnabled) && enable;
    this.downloadEnabledIcon = this.downloadEnabled
      ? "checkbox-outline"
      : "square-outline";
    this.eventsProvider.trigger(
      CoreCoursesProvider.EVENT_DASHBOARD_DOWNLOAD_ENABLED_CHANGED,
      { enabled: this.downloadEnabled }
    );
  }

  /**
   * Load fallback blocks to shown before 3.6 when dashboard blocks are not supported.
   */
  protected loadFallbackBlocks(): void {
    this.blocks = [
      {
        name: "myoverview",
        visible: true
      },
      {
        name: "timeline",
        visible: true
      }
    ];
  }

  /**
   * Component being destroyed.
   */
  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.updateSiteObserver && this.updateSiteObserver.off();
  }
}
