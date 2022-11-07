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

import { Component, ViewChild, Input, Optional } from '@angular/core';
import { Content, NavParams, NavController } from 'ionic-angular';
import { CoreGradesProvider } from '../../providers/grades';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreGradesHelperProvider } from '../../providers/helper';
import { CoreSplitViewComponent } from '@components/split-view/split-view';
import { CoreAppProvider } from '@providers/app';

/**
 * Component that displays a course grades.
 */
@Component({
    selector: 'core-grades-course',
    templateUrl: 'core-grades-course.html',
})
export class CoreGradesCourseComponent {
    @ViewChild(Content) content: Content;

    @Input() courseId: number;
    @Input() userId: number;
    @Input() gradeId?: number;
    @Input() studentId: number;

    gradesLoaded = false;
    gradesTable: any;
    //user Id for person whose grade need to be
    user_id : number;

    constructor(private gradesProvider: CoreGradesProvider, private domUtils: CoreDomUtilsProvider, navParams: NavParams,
        private gradesHelper: CoreGradesHelperProvider, @Optional() private navCtrl: NavController,
        private appProvider: CoreAppProvider, @Optional() private svComponent: CoreSplitViewComponent) {
    }

    /**
     * View loaded.
     */
    ngOnInit(): void {
        this.user_id = this.studentId > 0 ? this.studentId : this.userId;
        this.fetchData().then(() => {
            if (this.gradeId) {
                // There is the grade to load.
                this.gotoGrade(this.gradeId);
            }

            // Add log in Moodle.
            return this.gradesProvider.logCourseGradesView(this.courseId, this.user_id).catch(() => {
                // Ignore errors.
            });
        }).finally(() => {
            this.gradesLoaded = true;
        });
    }

    /**
     * Fetch all the data required for the view.
     *
     * @param refresh Empty events array first.
     * @return Resolved when done.
     */
    fetchData(refresh: boolean = false): Promise<any> {
        return this.gradesProvider.getCourseGradesTable(this.courseId, this.user_id).then((table) => {
            this.gradesTable = this.gradesHelper.formatGradesTable(table);
        }).catch((error) => {
            this.domUtils.showErrorModalDefault(error, 'Error loading grades');
        });
    }

    /**
     * Refresh data.
     *
     * @param refresher Refresher.
     */
    refreshGrades(refresher: any): void {
        this.gradesProvider.invalidateCourseGradesData(this.courseId, this.user_id).finally(() => {
            this.fetchData().finally(() => {
                refresher.complete();
            });
        });
    }

    /**
     * Navigate to the grade of the selected item.
     * @param gradeId Grade item ID where to navigate.
     */
    gotoGrade(gradeId: number): void {
        if (gradeId) {
            this.gradeId = gradeId;
            let whereToPush, pageName;

            if (this.svComponent) {
                if (this.svComponent.getMasterNav().getActive().component.name == 'CoreGradesCourseSplitPage') {
                    // Table is on left side. Push on right.
                    whereToPush = this.svComponent;
                    pageName = 'CoreGradesGradePage';
                } else {
                    // Table is on right side. Load new split view.
                    whereToPush = this.svComponent.getMasterNav();
                    pageName = 'CoreGradesCourseSplitPage';
                }
            } else {
                if (this.appProvider.isWide()) {
                    // Table is full screen and large. Load here.
                    whereToPush = this.navCtrl;
                    pageName = 'CoreGradesCourseSplitPage';
                } else {
                    // Table is full screen but on mobile. Load here.
                    whereToPush = this.navCtrl;
                    pageName = 'CoreGradesGradePage';
                }

            }
            whereToPush.push(pageName, {courseId: this.courseId, userId: this.user_id, gradeId: gradeId});
        }
    }
}
