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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CoreDirectivesModule } from '@directives/directives.module';
import { CoreBlockComponent } from './block/block';
import { CoreBlockOnlyTitleComponent } from './only-title-block/only-title-block';
import { CoreBlockPreRenderedComponent } from './pre-rendered-block/pre-rendered-block';
import { CoreBlockCourseBlocksComponent } from './course-blocks/course-blocks';
import { ChilddetailComponent } from '../../courses/components/childdetail/childdetail';
import { MychildrenComponent } from '../../courses/components/mychildren/mychildren';

import { CoreComponentsModule } from '@components/components.module';
import { CoreCoursesComponentsModule } from '@core/courses/components/components.module';

@NgModule({
    declarations: [
        CoreBlockComponent,
        CoreBlockOnlyTitleComponent,
        CoreBlockPreRenderedComponent,
        CoreBlockCourseBlocksComponent,
       // ChilddetailComponent,
        //MychildrenComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        CoreDirectivesModule,
        TranslateModule.forChild(),
        CoreComponentsModule,
    ],
    providers: [
    ],
    exports: [
        CoreBlockComponent,
        CoreBlockOnlyTitleComponent,
        CoreBlockPreRenderedComponent,
        CoreBlockCourseBlocksComponent,
       // ChilddetailComponent,
        //MychildrenComponent
    ],
    entryComponents: [
        CoreBlockOnlyTitleComponent,
        CoreBlockPreRenderedComponent,
        CoreBlockCourseBlocksComponent,
        //ChilddetailComponent
    ]
})
export class CoreBlockComponentsModule {}
