import { child_course } from './../mychildren/child_courses.model';
import { Component, OnDestroy, ViewChildren, QueryList, Optional } from '@angular/core';
import { child } from '@core/courses/components/mychildren/child.model';
import { CoreBlockComponent } from "@core/block/components/block/block";
import { CoreCoursesDashboardProvider } from '@core/courses/providers/dashboard';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CoreSitesProvider } from '@providers/sites';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
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
  courses: any[] = [];
  child_courses: child_course[] = [];

  constructor(
    private dashboardProvider: CoreCoursesDashboardProvider,
    private domUtils: CoreDomUtilsProvider,
    private navParams: NavParams,
    private sitesProvider: CoreSitesProvider,
    private coursesProvider: CoreCoursesProvider,
    @Optional() private navCtrl: NavController,
    private courseHelper: CoreCourseHelperProvider

  ) {
    this.child = navParams.get('child');
    this.childId = Number(this.child.child_id); 
    this.userId = this.sitesProvider.getCurrentSiteUserId();;
    console.log('Hello ChilddetailComponent Component');
  }

  ngOnInit(): void {
   this.loadDashboardContent();
   this.get_student_courses();
}


get_student_courses(){
    return this.coursesProvider.getCoursesByField('ids', this.child.child_courses_ids).then((courses) => {
      debugger
      const currentSite = this.sitesProvider.getCurrentSite();
      for(var child_course_key in courses){
        courses[child_course_key]['courseImage'] = courses[child_course_key]['overviewfiles'][0]['fileurl']+"?token="+currentSite.getToken();
      }

      this.courses = courses;
      debugger;
    }).catch((error) => {
        this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcourses', true);
    });
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
            .getDashboardBlocks(2482)
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
     * Open a course.
     *
     * @param course The course to open.
     */
   openCourse(course: any): void {
   var pageParams: any = {
      sectionId: 10
        };
        this.courseHelper.openCourse(this.navCtrl, course, pageParams);
   
}

    /**
   * Component being destroyed.
   */
     ngOnDestroy(): void {
      this.isDestroyed = true;
      this.updateSiteObserver && this.updateSiteObserver.off();
    }

}
