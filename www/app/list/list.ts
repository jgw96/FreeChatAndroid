import {IonicApp, Page, NavController, NavParams} from 'ionic-framework/ionic';

import {NewsPage} from "../news/news";
import {FirefoxOSRoom} from "../firefoxOS/firefoxos";
import {SportsPage} from "../sports/sports";


@Page({
  templateUrl: 'app/list/list.html'
})
export class ListPage {
    
  constructor(app: IonicApp, nav: NavController) {
    this.nav = nav;
  }

  goToNews() {
      this.nav.push(NewsPage);
  }
  
  goToFirefoxOS() {
      this.nav.push(FirefoxOSRoom);
  }
  
  goToSports() {
      this.nav.push(SportsPage);
  }
  
}
