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

import { Component } from "@angular/core";
import { AlertController, IonicPage, ModalController, NavController } from "ionic-angular";
import { CoreLoggerProvider } from "@providers/logger";
import { CoreSitesProvider, CoreSiteBasicInfo, CoreLoginSiteInfo, CoreSiteCheckResponse } from "@providers/sites";
import { CoreDomUtilsProvider } from "@providers/utils/dom";
import { CorePushNotificationsProvider } from "@core/pushnotifications/providers/pushnotifications";
import { CoreLoginHelperProvider } from "../../providers/helper";
import { CoreFilterProvider } from "@core/filter/providers/filter";
import { Links } from "@syncology/configs";
import { CoreAppProvider } from "@providers/app";
import { CoreUrl } from "@singletons/url";
import { TranslateService } from "@ngx-translate/core";
import { CoreEventsProvider } from "@providers/events";
import { CoreCustomURLSchemesProvider } from "@providers/urlschemes";
import { CoreTextUtilsProvider } from "@providers/utils/text";
import { CoreUrlUtilsProvider } from "@providers/utils/url";
import { CoreUtilsProvider } from "@providers/utils/utils";

/**
 * Extended data for UI implementation.
 */
type CoreLoginSiteInfoExtended = CoreLoginSiteInfo & {
  noProtocolUrl?: string; // Url wihtout protocol.
  country?: string; // Based on countrycode.
};

/**
 * Page that displays the list of stored sites.
 */
@IonicPage({ segment: "core-login-sites" })
@Component({
  selector: "page-core-login-sites",
  templateUrl: "sites.html"
})
export class CoreLoginSitesPage {
  showDelete: boolean;
  protected logger;
  showKeyboard = false;
  sites: CoreLoginSiteInfoExtended[] = [];

  constructor(
    protected navCtrl: NavController,
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
    logger: CoreLoggerProvider,
  ) {
    this.logger = logger.getInstance("CoreLoginSitesPage");
  }

  /**
   * View loaded.
   */
  // ionViewDidLoad(): void {
  //   this.sitesProvider
  //     .getSortedSites()
  //     .then(sites => {
  //       if (sites.length == 0) {
  //         this.loginHelper.goToAddSite(true);
  //       }

  //       // Remove protocol from the url to show more url text.
  //       this.sites = sites.map(site => {
  //         site.siteUrl = site.siteUrl.replace(/^https?:\/\//, "");
  //         site.badge = 0;
  //         this.pushNotificationsProvider
  //           .getSiteCounter(site.id)
  //           .then(counter => {
  //             site.badge = counter;
  //           });

  //         return site;
  //       });

  //       this.showDelete = false;
  //       this.login(this.sites[0].id);
  //     })
  //     .catch(() => {
  //       // Shouldn't happen.
  //     });
  // }

  /**
   * Go to the page to add a site.
   */
  add(): void {
    this.loginHelper.goToAddSite(false, true);
  }

  /**
   * Delete a site.
   *
   * @param e Click event.
   * @param index Position of the site.
   */
  // deleteSite(e: Event, index: number): void {
  //   e.stopPropagation();

  //   const site = this.sites[index],
  //     siteName = site.siteName;

  //   this.filterProvider
  //     .formatText(
  //       siteName,
  //       { clean: true, singleLine: true, filter: false },
  //       [],
  //       site.id
  //     )
  //     .then(siteName => {
  //       this.domUtils
  //         .showDeleteConfirm("core.login.confirmdeletesite", {
  //           sitename: siteName
  //         })
  //         .then(() => {
  //           this.sitesProvider
  //             .deleteSite(site.id)
  //             .then(() => {
  //               this.sites.splice(index, 1);
  //               this.showDelete = false;

  //               // If there are no sites left, go to add site.
  //               this.sitesProvider.hasSites().then(hasSites => {
  //                 if (!hasSites) {
  //                   this.loginHelper.goToAddSite(true, true);
  //                 }
  //               });
  //             })
  //             .catch(error => {
  //               this.logger.error("Error deleting site " + site.id, error);
  //               this.domUtils.showErrorModalDefault(
  //                 error,
  //                 "core.login.errordeletesite",
  //                 true
  //               );
  //             });
  //         })
  //         .catch(() => {
  //           // User cancelled, nothing to do.
  //         });
  //     });
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
   * Show an error that aims people to solve the issue.
   *
   * @param url The URL the user was trying to connect to.
   * @param error Error to display.
   */
  protected showLoginIssue(url: string, error: any): void {
    error = this.domUtils.getErrorMessage(error);

    if (error == this.translate.instant("core.cannotconnecttrouble")) {
      const found = this.sites.find((site) => site.url == url);

      if (!found) {
        error += " " + this.translate.instant("core.cannotconnectverify");
      }
    }

    let message = "<p>" + error + "</p>";
    if (url) {
      const fullUrl = this.urlUtils.isAbsoluteURL(url) ? url : "https://" + url;
      message +=
        '<p padding><a href="' + fullUrl + '" core-link>' + url + "</a></p>";
    }

    const buttons = [
      {
        text: this.translate.instant("core.needhelp"),
        handler: (): void => {
          this.showHelp();
        }
      },
      {
        text: this.translate.instant("core.tryagain"),
        role: "cancel"
      }
    ];

    this.domUtils.showAlertWithOptions({
      title: this.translate.instant("core.cannotconnect"),
      message,
      buttons
    });
  }

  /**
   * Process login to a site.
   *
   * @param response Response obtained from the site check request.
   * @param foundSite The site clicked, if any, from the found sites list.
   *
   * @return Promise resolved after logging in.
   */
  protected async login(
    response: CoreSiteCheckResponse,
    urlPath: string,
    foundSite?: CoreLoginSiteInfoExtended
  ): Promise<void> {
    return this.sitesProvider
      .checkRequiredMinimumVersion(response.config)
      .then(() => {
        // this.domUtils.triggerFormSubmittedEvent(this.formElement, true);

        if (response.warning) {
          this.domUtils.showErrorModal(response.warning, true, 4000);
        }

        if (this.loginHelper.isSSOLoginNeeded(response.code)) {
          // SSO. User needs to authenticate in a browser.
          this.loginHelper.confirmAndOpenBrowserForSSOLogin(
            response.siteUrl,
            response.code,
            response.service,
            response.config && response.config.launchurl
          );
        } else {
          const pageParams = {
            urlPath,
            siteUrl: response.siteUrl,
            siteConfig: response.config
          };
          if (foundSite) {
            pageParams["siteName"] = foundSite.name;
            pageParams["logoUrl"] = foundSite.imageurl;
          }

          this.navCtrl.push("CoreLoginCredentialsPage", pageParams);
        }
      })
      .catch(() => {
        // Ignore errors.
      });
  }

  /**
   * Try to connect to a site.
   *
   * @param e Event.
   * @param url The URL to connect to.
   * @param foundSite The site clicked, if any, from the found sites list.
   */
  connect(url: string, urlPath: string, foundSite?: CoreLoginSiteInfoExtended): void {
    this.appProvider.closeKeyboard();

    if (!url) {
      this.domUtils.showErrorModal("core.login.siteurlrequired", true);

      return;
    }

    if (!this.appProvider.isOnline()) {
      this.domUtils.showErrorModal("core.networkerrormsg", true);

      return;
    }

    url = url.trim();

    if (url.match(/^(https?:\/\/)?campus\.example\.edu/)) {
      this.showLoginIssue(
        null,
        this.translate.instant("core.login.errorexampleurl")
      );

      return;
    }

    const modal = this.domUtils.showModalLoading();

    // Not a demo site.
    this.sitesProvider
      .checkSite(url)
      .catch(error => {
        // Attempt guessing the domain if the initial check failed
        const domain = CoreUrl.guessMoodleDomain(url);

        if (domain && domain != url) {
          return this.sitesProvider.checkSite(domain).catch(secondError => {
            // Try to use the first error.
            return Promise.reject(error || secondError);
          });
        }

        return Promise.reject(error);
      })
      .then(result => this.login(result, urlPath, foundSite))
      .catch(error => this.showLoginIssue(url, error))
      .finally(() => modal.dismiss());
  }

  /**
   * Login in a site.
   *
   * @param siteId The site ID.
   */
  // login(siteId: string): void {
  //   const modal = this.domUtils.showModalLoading();

  //   this.sitesProvider
  //     .loadSite(siteId)
  //     .then(loggedIn => {
  //       if (loggedIn) {
  //         return this.loginHelper.goToSiteInitialPage();
  //       }
  //     })
  //     .catch(error => {
  //       this.logger.error("Error loading site " + siteId, error);
  //       this.domUtils.showErrorModalDefault(error, "Error loading site.");
  //     })
  //     .finally(() => {
  //       modal.dismiss();
  //     });
  // }

  /**
   * Toggle delete.
   */
  toggleDelete(): void {
    this.showDelete = !this.showDelete;
  }

  connectToUrl(urlPath: string): void {
    let url = Links.SYNCOLOGY_LMS_URL.replace("://", `://${urlPath}.`);
    this.connect(url, urlPath);
  }
}
