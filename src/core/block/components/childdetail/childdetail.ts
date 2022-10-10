import { Component, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { child } from '@core/block/components/mychildren/child.model';
import { CoreBlockComponent } from "@core/block/components/block/block";
import { CoreCoursesDashboardProvider } from '@core/courses/providers/dashboard';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavParams } from 'ionic-angular';
import { CoreSitesProvider } from '@providers/sites';
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
  childId: number;
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
    private sitesProvider: CoreSitesProvider,
  ) {
    this.child = navParams.get('child');
    this.childId = Number(this.child.child_id); 
    this.userId = this.sitesProvider.getCurrentSiteUserId();;
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
            .getDashboardBlocks(this.userId)
            .then(blocks => {
              debugger;
              this.blocks = blocks;
              for(var i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].name == "myoverview"){
                  
                }
               console.log(this.blocks[i]);
              }
    
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
