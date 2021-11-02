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

import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreAppProvider } from '@providers/app';
import { CoreConfigProvider } from '@providers/config';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { CoreTextUtilsProvider } from '@providers/utils/text';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreConstants } from '@core/constants';

/**
 * Component to display a "send message form".
 *
 * @description
 * This component will display a standalone send message form in order to have a better UX.
 *
 * Example usage:
 * <core-send-message-form (onSubmit)="sendMessage($event)" [placeholder]="'core.messages.newmessage' | translate"
 * [show-keyboard]="showKeyboard"></core-send-message-form>
 */
@Component({
    selector: 'core-send-message-form',
    templateUrl: 'core-send-message-form.html'
})
export class CoreSendMessageFormComponent implements OnInit {
    @Input() message: string; // Input text.
    @Input() placeholder = ''; // Placeholder for the input area.
    @Input() showKeyboard = false; // If keyboard is shown or not.
    @Input() sendDisabled = false; // If send is disabled.
    @Output() onSubmit: EventEmitter<string>; // Send data when submitting the message form.
    @Output() onResize: EventEmitter<void>; // Emit when resizing the textarea.

    @ViewChild('messageForm') formElement: ElementRef;

    protected sendOnEnter: boolean;

                  // Add Web Project URL Here
    baseApiUrl = 'http://192.168.0.174/shahid-edusync-lms/' + '/message/attachment.php';

    constructor(protected utils: CoreUtilsProvider,
            protected textUtils: CoreTextUtilsProvider,
            configProvider: CoreConfigProvider,
            protected eventsProvider: CoreEventsProvider,
            protected sitesProvider: CoreSitesProvider,
            protected appProvider: CoreAppProvider,
            protected domUtils: CoreDomUtilsProvider) {

        this.onSubmit = new EventEmitter();
        this.onResize = new EventEmitter();

        configProvider.get(CoreConstants.SETTINGS_SEND_ON_ENTER, !this.appProvider.isMobile()).then((sendOnEnter) => {
            this.sendOnEnter = !!sendOnEnter;
        });

        eventsProvider.on(CoreEventsProvider.SEND_ON_ENTER_CHANGED, (newValue) => {
            this.sendOnEnter = newValue;
        }, sitesProvider.getCurrentSiteId());
    }

    ngOnInit(): void {
        this.showKeyboard = this.utils.isTrueOrOne(this.showKeyboard);
    }

    getFiles(event) {
        const files = event.target.files;
    
        this.uploadFile(files);
    }

    uploadFile(files) {

        const API_ENDPOINT = this.baseApiUrl;
        
        const request = new (<any>window).XMLHttpRequest();
        
        const formData = new (<any>window).FormData();
      
        formData.processData = false;
        formData.contentType = false;
        formData.cache = false;

        request.open("POST", API_ENDPOINT, true);

        (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "";

        request.upload.addEventListener("progress", function (event) { 
                
            if (event.lengthComputable) {
                var percent = (event.loaded / event.total * 100 | 0);

                (<HTMLInputElement>document.getElementById('meter')).style.width = percent + '%';

                console.log(percent);
            }

        });

        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
          }
        };

        // Size in Bytes
        var sizeLimit = 40000000;

        // Size for Error Text
        var sizeText = '40';

        // Total Number of Files
        var totalFile = '10';

        if(files.length > totalFile) {

            (<HTMLInputElement>document.getElementById("message-response")).innerHTML = "Exceeded Total file limit. Only " + totalFile + " Files Allowed! Please try again.";
            
        } else {
    
            for (let i = 0; i < files.length; i++) {
                
                if(files[i].size > sizeLimit) {

                    (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Exceeded file limit. Files must be " + sizeText + "MB! Please try again.";

                    break;
                    
                } else {

                    formData.append('files[]', files[i], files[i].name)
                }
            }
        }

        request.send(formData);
        
        request.onload = function () {

            var response = JSON.parse(request.responseText);

            if(request.status === 200) {
                
                console.log(response);

                let textarea = (<HTMLInputElement>document.getElementById('message-textarea'));
                textarea.value = response;

                (<HTMLInputElement>document.getElementById('meter')).style.display = "none";

            } else if(response.data == 'save_err') {
                    
                (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Unable to Save file! Please try again.";
                
            } else {
                
                (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Some problem occured! Please try again.";
                
            }
        };
    };

    loadImageFromDevice(event) {
        
        const file = event.target.files[0];

        var data = new FormData();

        data.append('file', file, file.name);

        var xhr = new (<any>window).XMLHttpRequest();
        
        xhr.open('POST', this.baseApiUrl, true);  
        
        (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "";

        if(event.target.files[0].size > 40000000) {

            (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Exceeded file limit. Files must be 40MB! Please try again.";
       
        } else {

            xhr.upload.addEventListener("progress", function (event) { 
                    
                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total * 100 | 0);

                    (<HTMLInputElement>document.getElementById('meter')).style.width = percent + '%';

                    console.log(percent);
                }

            });

            xhr.onload = function () {
                
                var response = JSON.parse(xhr.responseText);
                
                if(xhr.status === 200 && response.status == 'ok') {
                    
                    console.log(response.data);

                    let textarea = (<HTMLInputElement>document.getElementById('message-textarea'));
                    textarea.value = response.data;

                    (<HTMLInputElement>document.getElementById('meter')).style.display = "none";

                } else if(response.status == 'save_err') {
                    
                    (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Unable to Save file! Please try again.";
                
                } else {
                
                    (<HTMLInputElement>document.getElementById('message-response')).innerHTML = "Some problem occured! Please try again.";
                }
            };
            
            xhr.send(data);
            
        }
    }

    /**
     * Form submitted.
     *
     * @param $event Mouse event.
     */
    submitForm($event: Event): void {
        $event.preventDefault();
        $event.stopPropagation();

        let value = this.message.trim();

        if (!value) {
            // Silent error.
            return;
        }

        this.message = ''; // Reset the form.

        this.domUtils.triggerFormSubmittedEvent(this.formElement, false, this.sitesProvider.getCurrentSiteId());

        value = this.textUtils.replaceNewLines(value, '<br>');
        this.onSubmit.emit(value);
    }

    /**
     * Textarea resized.
     */
    textareaResized(): void {
        this.onResize.emit();
    }

    /**
     * Enter key clicked.
     *
     * @param e Event.
     * @param other The name of the other key that was clicked, undefined if no other key.
     */
    enterClicked(e: Event, other: string): void {
        if (this.sendDisabled) {
            return;
        }

        if (this.sendOnEnter && !other) {
            // Enter clicked, send the message.
            this.submitForm(e);
        } else if (!this.sendOnEnter && !this.appProvider.isMobile()) {
            if ((this.appProvider.isMac() && other == 'meta') || (!this.appProvider.isMac() && other == 'control')) {
                // Cmd+Enter or Ctrl+Enter, send message.
                this.submitForm(e);
            }
        }
    }
}
