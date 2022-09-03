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

import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  AlertController,
  NavParams
} from "ionic-angular";
import { CoreSite } from '@classes/site';
import { CoreAppProvider } from "@providers/app";
import { CoreEventsProvider } from "@providers/events";
import {
  CoreSitesProvider,
  CoreSiteCheckResponse,
  CoreLoginSiteInfo
} from "@providers/sites";
import {
  CoreCustomURLSchemesProvider,
  CoreCustomURLSchemesHandleError
} from "@providers/urlschemes";
import { CoreDomUtilsProvider } from "@providers/utils/dom";
import { CoreTextUtilsProvider } from "@providers/utils/text";
import { CoreUrlUtilsProvider } from "@providers/utils/url";
import { CoreUtilsProvider } from "@providers/utils/utils";
import { CoreConfig } from "@providers/config";
import { CoreConfigConstants } from "../../../../configconstants";
import { CoreLoginHelperProvider } from "../../providers/helper";
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { CoreUrl } from "@singletons/url";
import { TranslateService } from "@ngx-translate/core";
import { StatusBar } from "@ionic-native/status-bar";
import { Links, Colors } from "@syncology/configs";

/**
 * Extended data for UI implementation.
 */
type CoreLoginSiteInfoExtended = CoreLoginSiteInfo & {
    noProtocolUrl?: string; // Url wihtout protocol.
    country?: string; // Based on countrycode.
};

/**
 * Page to enter or select the site URL to connect to.
 */
@IonicPage({ segment: "core-login-site" })
@Component({
  selector: "page-core-login-site",
  templateUrl: "site.html"
})
export class CoreLoginSitePage {
  @ViewChild("siteFormEl")
  formElement: ElementRef;

  siteForm: FormGroup;
  fixedSites: CoreLoginSiteInfo[];
  filteredSites: CoreLoginSiteInfo[];
  siteSelector = 'sitefinder';
  showKeyboard = false;
  filter = "";
  sites: CoreLoginSiteInfoExtended[] = [];
  hasSites = false;
  loadingSites = false;
  searchFnc: Function;
  showScanQR: boolean;
  enteredSiteUrl: CoreLoginSiteInfoExtended;

  constructor(
    navParams: NavParams,
    protected navCtrl: NavController,
    fb: FormBuilder,
    protected appProvider: CoreAppProvider,
    protected sitesProvider: CoreSitesProvider,
    protected loginHelper: CoreLoginHelperProvider,
    protected modalCtrl: ModalController,
    protected alertCtrl: AlertController,
    protected urlUtils: CoreUrlUtilsProvider,
    protected domUtils: CoreDomUtilsProvider,
    protected eventsProvider: CoreEventsProvider,
    protected translate: TranslateService,
    protected utils: CoreUtilsProvider,
    protected urlSchemesProvider: CoreCustomURLSchemesProvider,
    protected textUtils: CoreTextUtilsProvider,
    private statusBar: StatusBar
  ) {
    this.showKeyboard = !!navParams.get("showKeyboard");
    this.showScanQR = this.utils.canScanQR() && (typeof CoreConfigConstants['displayqronsitescreen'] == 'undefined' ||
            !!CoreConfigConstants['displayqronsitescreen']);

    // set status bar to white
    this.statusBar.backgroundColorByHexString(
      Colors.LOGIN.LOGIN_STATUS_BAR_COLOR
    );

    // let url = Links.SYNCOLOGY_LMS_URL;
    // this.connect(
    //   new Event("click"),
    //   url
    // );
  }

  /**
   * The filter has changed.
   *
   * @param Received Event.
   */
  // filterChanged(event: any): void {
  //   const newValue =
  //     event.target.value && event.target.value.trim().toLowerCase();
  //   if (!newValue || !this.fixedSites) {
  //     this.filteredSites = this.fixedSites;
  //   } else {
  //     this.filteredSites = this.fixedSites.filter(site => {
  //       return (
  //         site.name.toLowerCase().indexOf(newValue) > -1 ||
  //         site.url.toLowerCase().indexOf(newValue) > -1
  //       );
  //     });
  //   }
  // }

  /**
   * Show a help modal.
   */
  showHelp(): void {
    const modal = this.modalCtrl.create(
      "CoreLoginSiteHelpPage",
      {},
      { cssClass: "core-modal-fullscreen" }
    );
    modal.present();
  }

  /**
   * Show an onboarding modal.
   */
  // showOnboarding(): void {
  //   const modal = this.modalCtrl.create(
  //     "CoreLoginSiteOnboardingPage",
  //     {},
  //     { cssClass: "core-modal-fullscreen" }
  //   );
  //   modal.present();
  // }

  /**
   * Find a site on the backend.
   *
   * @param e Event.
   * @param search Text to search.
   */
  // searchSite(e: Event, search: string): void {
  //   this.loadingSites = true;

  //   this.searchFnc(search.trim(), this.siteForm.valid);
  // }

  /**
   * Get the demo data for a certain "name" if it is a demo site.
   *
   * @param name Name of the site to check.
   * @return Site data if it's a demo site, undefined otherwise.
   */
  // getDemoSiteData(name: string): any {
  //   const demoSites = CoreConfigConstants.demo_sites;
  //   if (
  //     typeof demoSites != "undefined" &&
  //     typeof demoSites[name] != "undefined"
  //   ) {
  //     return demoSites[name];
  //   }
  // }

  /**
   * Validate Url.
   *
   * @return {ValidatorFn} Validation results.
   */
  // protected moodleUrlValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const value = control.value.trim();
  //     let valid = value.length >= 3 && CoreUrl.isValidMoodleUrl(value);

  //     if (!valid) {
  //       const demo = !!this.getDemoSiteData(value);

  //       if (demo) {
  //         valid = true;
  //       }
  //     }

  //     return valid ? null : { siteUrl: { value: control.value } };
  //   };
  // }

  /**
   * Show instructions and scan QR code.
   *
   * @todo Use it in 3.9 release instead of scanQR.
   */
  // showInstructionsAndScanQR(): void {
  //   // Show some instructions first.
  //   this.domUtils.showAlertWithOptions({
  //     title: this.translate.instant("core.login.faqwhereisqrcode"),
  //     message: this.translate.instant("core.login.faqwhereisqrcodeanswer", {
  //       $image: CoreLoginHelperProvider.FAQ_QRCODE_IMAGE_HTML
  //     }),
  //     buttons: [
  //       {
  //         text: this.translate.instant("core.cancel"),
  //         role: "cancel"
  //       },
  //       {
  //         text: this.translate.instant("core.next"),
  //         handler: (): void => {
  //           this.scanQR();
  //         }
  //       }
  //     ]
  //   });
  // }

  /**
   * Scan a QR code and put its text in the URL input.
   *
   * @return Promise resolved when done.
   */
  // async scanQR(): Promise<void> {
  //   // Scan for a QR code.
  //   const text = await this.utils.scanQR();

  //   if (text) {
  //     if (this.urlSchemesProvider.isCustomURL(text)) {
  //       try {
  //         await this.urlSchemesProvider.handleCustomURL(text);
  //       } catch (error) {
  //         if (
  //           error &&
  //           error.data &&
  //           error.data.isAuthenticationURL &&
  //           error.data.siteUrl
  //         ) {
  //           // An error ocurred, but it's an authentication URL and we have the site URL.
  //           this.treatErrorInAuthenticationCustomURL(text, error);
  //         } else {
  //           this.urlSchemesProvider.treatHandleCustomURLError(error);
  //         }
  //       }
  //     } else {
  //       // Not a custom URL scheme, put the text in the field.
  //       this.siteForm.controls.siteUrl.setValue(text);

  //       this.connect(
  //         new Event("click"),
  //         text
  //       );
  //     }
  //   }
  // }

  /**
   * Treat an error while handling a custom URL meant to perform an authentication.
   * If the site doesn't use SSO, the user will be sent to the credentials screen.
   *
   * @param customURL Custom URL handled.
   * @param error Error data.
   * @return Promise resolved when done.
   */
  // protected async treatErrorInAuthenticationCustomURL(
  //   customURL: string,
  //   error: CoreCustomURLSchemesHandleError
  // ): Promise<void> {
  //   const siteUrl = error.data.siteUrl;
  //   const modal = this.domUtils.showModalLoading();

  //   // Set the site URL in the input.
  //   this.siteForm.controls.siteUrl.setValue(siteUrl);

  //   try {
  //     // Check if site uses SSO.
  //     const response = await this.sitesProvider.checkSite(siteUrl);

  //     await this.sitesProvider.checkRequiredMinimumVersion(response.config);

  //     if (!this.loginHelper.isSSOLoginNeeded(response.code)) {
  //       // No SSO, go to credentials page.
  //       await this.navCtrl.push("CoreLoginCredentialsPage", {
  //         siteUrl: response.siteUrl,
  //         siteConfig: response.config
  //       });
  //     }
  //   } catch (error) {
  //     // Ignore errors.
  //   } finally {
  //     modal.dismiss();
  //   }

  //   // Now display the error.
  //   error.error = this.textUtils.addTextToError(
  //     error.error,
  //     "<br><br>" +
  //       this.translate.instant("core.login.youcanstillconnectwithcredentials")
  //   );

  //   this.urlSchemesProvider.treatHandleCustomURLError(error);
  // }
}
