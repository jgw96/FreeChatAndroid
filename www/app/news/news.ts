import {Page, NavController, Popup} from 'ionic-framework/ionic';

import {StorageService} from "../services/storage-service";
import {Usernames} from "../services/username-service";

@Page({
    templateUrl: 'app/news/news.html',
    providers: [StorageService, Usernames]
})
export class NewsPage {

    socket: any;
    messages: any[];
    username: string;

    constructor(nav: NavController, private storage: StorageService) {
        this.socket = io.connect("https://freechat-firefox.herokuapp.com/News");
        
        if (localStorage.getItem("newsChats") === null) {
            this.messages = [];
        }
        else {
            this.messages = JSON.parse(localStorage.getItem("newsChats"));
        }

        
        this.username = localStorage.getItem("username");
        

        this.socket.on("newsMessage", (data) => {
            if (data.message) {
                this.messages.push(data);
                localStorage.setItem("newsChats", JSON.stringify(this.messages));
            }
            else {
                console.log("error", data);
            }
        })

        this.socket.on("newNewsUser", () => {
            cordova.plugins.notification.local.schedule({
                title: "Welcome",
                message: "Welcome to the News Room!"
            });
            
			//new Notification("Welcome to the News Room!");
		})

		this.socket.on("newsUserLogged", () => {
            cordova.plugins.notification.local.schedule({
                title: "New User",
                message: "Someone joined the News Room!"
            });
            
			//new Notification("Someone joined the News Room!");
		})

		this.socket.on("newsMessageAdded", (data) => {
            cordova.plugins.notification.local.schedule({
                title: "New Message",
                message: data.user + " " + ":" + " " + data.message
            });
            
            //new Notification(data.user + " " + "says" + " " + data.message);
        })
    }

    send(chat: string) {
        this.socket.emit("newsSend", { message: chat, user: this.username });
    }

}