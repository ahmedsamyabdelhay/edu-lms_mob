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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";
import { CoreComponentsModule } from "@components/components.module";
import { CoreDirectivesModule } from "@directives/directives.module";
import { CoreCourseComponentsModule } from "@core/course/components/components.module";
import { CoreBlockComponentsModule } from "@core/block/components/components.module";
import { CoreSiteHomeIndexComponent } from "./index/index";
import { CoreSiteHomeAllCourseListComponent } from "./all-course-list/all-course-list";
import { CoreSiteHomeCategoriesComponent } from "./categories/categories";
import { CoreSiteHomeCourseSearchComponent } from "./course-search/course-search";
import { CoreSiteHomeEnrolledCourseListComponent } from "./enrolled-course-list/enrolled-course-list";

@NgModule({
  declarations: [
    CoreSiteHomeIndexComponent,
    CoreSiteHomeAllCourseListComponent,
    CoreSiteHomeCategoriesComponent,
    CoreSiteHomeCourseSearchComponent,
    CoreSiteHomeEnrolledCourseListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    CoreComponentsModule,
    CoreDirectivesModule,
    CoreCourseComponentsModule,
    CoreBlockComponentsModule
  ],
  exports: [
    CoreSiteHomeIndexComponent,
    CoreSiteHomeAllCourseListComponent,
    CoreSiteHomeCategoriesComponent,
    CoreSiteHomeCourseSearchComponent,
    CoreSiteHomeEnrolledCourseListComponent
  ]
})
export class CoreSiteHomeComponentsModule {}
