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

// tslint:disable: variable-name
export class CoreConfigConstants {
    static app_id = 'tech.syncology.edusync';
    static appname = 'EduSync Mobile';
    static desktopappname = 'EduSync Desktop';
    static versioncode = 0;
    static versionname = '0.0.0';
    static cache_update_frequency_usually = 420000;
    static cache_update_frequency_often = 1200000;
    static cache_update_frequency_sometimes = 3600000;
    static cache_update_frequency_rarely = 43200000;
    static default_lang = 'en';
    static languages: any = {
        'ar': 'عربي',
        'bg': 'Български',
        'ca': 'Català',
        'cs': 'Čeština',
        'da': 'Dansk',
        'de': 'Deutsch',
        'de-du': 'Deutsch - Du',
        'el': 'Ελληνικά',
        'en': 'English',
        'en-us': 'English - United States',
        'es': 'Español',
        'es-mx': 'Español - México',
        'eu': 'Euskara',
        'fa': 'فارسی',
        'fi': 'Suomi',
        'fr': 'Français',
        'he': 'עברית',
        'hi': 'हिंदी',
        'hr': 'Hrvatski',
        'hu': 'magyar',
        'id': 'Indonesian',
        'it': 'Italiano',
        'ja': '日本語',
        'km': 'ខ្មែរ',
        'kn': 'ಕನ್ನಡ',
        'ko': '한국어',
        'lt': 'Lietuvių',
        'lv': 'Latviešu',
        'mn': 'Монгол',
        'mr': 'मराठी',
        'nl': 'Nederlands',
        'no': 'Norsk - bokmål',
        'pl': 'Polski',
        'pt': 'Português - Portugal',
        'pt-br': 'Português - Brasil',
        'ro': 'Română',
        'ru': 'Русский',
        'sl': 'Slovenščina',
        'sr-cr': 'Српски',
        'sr-lt': 'Srpski',
        'sv': 'Svenska',
        'tg': 'Тоҷикӣ',
        'tr': 'Türkçe',
        'uk': 'Українська',
        'vi': 'Vietnamese',
        'zh-cn': '简体中文',
        'zh-tw': '正體中文'
    };
    static wsservice = 'moodle_mobile_app';
    static wsextservice = 'local_mobile';
    static demo_sites: any = {
        student: {
            url: 'https://school.moodledemo.net',
            username: 'student',
            password: 'moodle'
        },
        teacher: {
            url: 'https://school.moodledemo.net',
            username: 'teacher',
            password: 'moodle'
        }
    };
    static font_sizes: any = [
        62.5,
        75.89,
        93.75
];
    static customurlscheme = 'edusyncmobile';
    static siteurl = 'http://34.127.20.20/';
    static sitename = '';
    static multisitesdisplay = '';
    static onlyallowlistedsites = false;
    static skipssoconfirmation = false;
    static forcedefaultlanguage = false;
    static privacypolicy = 'https://moodle.net/moodle-app-privacy/';
    static notificoncolor = '#f98012';
    static statusbarbg = false;
    static statusbarlighttext = false;
    static statusbarbgios = '#2062c2';
    static statusbarlighttextios = true;
    static statusbarbgandroid = '#2062c2';
    static statusbarlighttextandroid = true;
    static statusbarbgremotetheme = '#000000';
    static statusbarlighttextremotetheme = true;
    static enableanalytics = false;
    static enableonboarding = true;
    static forceColorScheme = '';
    static ioswebviewscheme = 'moodleappfs';
    static appstores: any = {
        android: 'tech.syncology.edusync',
        ios: 'id633359593',
        windows: 'moodle-desktop/9p9bwvhdc8c8',
        mac: 'id1255924440',
        linux: 'https://download.moodle.org/desktop/download.php?platform=linux&arch=64'
    };
    static compilationtime = 1634803407929;
    static lastcommit = '53d95008332a97cb07ec39f8ed21874ec0398da6';
}
