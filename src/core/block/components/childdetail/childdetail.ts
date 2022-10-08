import { Component, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { child } from '@core/block/components/mychildren/child.model';
import { CoreBlockComponent } from "@core/block/components/block/block";
import { CoreCoursesDashboardProvider } from '@core/courses/providers/dashboard';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavParams } from 'ionic-angular';
/**
 * Generated class for the ChilddetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

// @IonicPage({ segment: "core-child-detail" })
@Component({
  selector: 'childdetail',
  templateUrl: 'childdetail.html'
})

export class ChilddetailComponent implements OnDestroy {

  text: string;
  blocks: any[];
  overviewBlock: any;
  dashboardEnabled = false;
  dashboardLoaded = false;
  child: child
  userId: number;
  downloadEnabled: boolean = true;
  downloadEnabledIcon = "square-outline"; // Disabled by default.
  downloadCourseEnabled: boolean;
  downloadCoursesEnabled: boolean;  
  @ViewChildren(CoreBlockComponent)
  blocksComponents: QueryList<CoreBlockComponent>;
  myoverview_component = "addon-block-myoverview";
  isDestroyed: boolean;
  tabsComponent: any;
  searchEnabled: boolean;
  updateSiteObserver;
  siteName: any;
  siteHomeEnabled: boolean;
  firstSelectedTab: number;
  announcementsLoaded: boolean;
  tabsReady: boolean;

  constructor(
    private dashboardProvider: CoreCoursesDashboardProvider,
    private domUtils: CoreDomUtilsProvider,
    private navParams: NavParams,
  ) {
    this.child = navParams.get('child')
    this.userId = Number(this.child.child_id); 
    console.log('Hello ChilddetailComponent Component');
  }

  ngOnInit(): void {
    this.loadDashboardContent();
}

  /**
   * Convenience function to fetch the dashboard data.
   *
   * @return Promise resolved when done.
   */
  protected loadDashboardContent(): Promise<any> {

    // const promises = [];
    //         this.blocksComponents.forEach(blockComponent => {
    //           promises.push(
    //             blockComponent.invalidate().catch(() => {
    //               // Ignore errors.
    //             })
    //           );
    //         });
    return this.dashboardProvider
            //.getDashboardBlocks(Number(this.child.child_id))
            .getDashboardBlocks(5836)
            .then(blocks => {
              this.blocks = blocks;
              
    
              console.log(this.overviewBlock);
            })
            .catch(error => {
              this.domUtils.showErrorModal(error);

              // Cannot get the blocks, just show dashboard if needed.
              this.loadFallbackBlocks();
            });
            
  }



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
