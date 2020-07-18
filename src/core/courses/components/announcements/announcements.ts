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

import { Component, Injector, OnInit, OnDestroy, DoCheck, Input, KeyValueDiffers } from "@angular/core";
import { Events } from 'ionic-angular';
import { CoreBlockDelegate } from '../../../block/providers/delegate';
import { Subscription } from 'rxjs';
import { CoreEventsProvider } from '@providers/events';
import { CoreBlockComponent } from "@core/block/components/block/block";
import { CoreDbProvider } from '../../../../providers/db';
import { SQLiteDB } from '@classes/sqlitedb';

/**
 * Component that displays dashboard announcements.
 */
@Component({
  selector: "core-dashboard-announcements",
  templateUrl: "core-dashboard-announcements.html"
})
export class CoreDashboardAnnouncementComponent extends CoreBlockComponent implements OnInit, OnDestroy, DoCheck {
    
    @Input() announcementsLoaded: boolean;

    data: any = {}; // Data to pass to the component.
    numOfKnownPosts = 0;
    class: string; // CSS class to apply to the block.
    loaded = false;
    protected db: SQLiteDB;
    protected DBNAME = 'MoodleMobile';

    blockSubscription: Subscription;

    protected differ: any; // To detect changes in the data input.

    constructor(protected dbProvider: CoreDbProvider, protected injector: Injector, protected blockDelegate: CoreBlockDelegate, differs: KeyValueDiffers,
        protected eventsProvider: CoreEventsProvider, events: Events) {
      super(injector, blockDelegate, differs, eventsProvider, events);
      this.db = dbProvider.getDB(this.DBNAME);
  }

  /**
   * Component being initialized.
   */
  ngOnInit(): void {
      super.ngOnInit();
      this.db.getRecord('schema_news_tracker', {key: 'numOfPosts'}).then(entry => {
        console.log(entry, "eh da local db");
        if (entry && entry.value) {
            this.numOfKnownPosts = entry.value;
        }
        
      }).catch(err => {
        console.log(err, "eh da error local db")
      });
  }

  /**
     * Detect and act upon changes that Angular can’t or won’t detect on its own (objects and arrays).
     */
    ngDoCheck(): void {
        super.ngDoCheck();
    }

    /**
     * On destroy of the component, clear up any subscriptions.
     */
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
