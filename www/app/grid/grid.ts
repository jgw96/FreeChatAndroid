import {Page} from 'ionic-framework/ionic';


@Page({
  templateUrl: 'app/grid/grid.html'
})
export class GridPage {
    constructor() {
        
    }
    
    clearMessages() {
        localStorage.removeItem("chats");
        localStorage.removeItem("newsChats");
        localStorage.removeItem("sportsChats");
        localStorage.removeItem("firefoxosChats");
    }
}
