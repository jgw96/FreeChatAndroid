import {Page, NavController, Popup} from 'ionic-framework/ionic';

import {StorageService} from "../services/storage-service";
import {Usernames} from "../services/username-service";

@Page({
    templateUrl: 'app/firefoxOS/firefoxos.html',
    providers: [StorageService, Usernames]
})
export class FirefoxOSRoom {

    socket: any;
    messages: any[];
    username: string;

    constructor(nav: NavController, private storage: StorageService) {
        this.socket = io.connect("https://freechat-firefox.herokuapp.com/FirefoxOS");
        
        if (localStorage.getItem("firefoxosChats") === null) {
            this.messages = [];
        }
        else {
            this.messages = JSON.parse(localStorage.getItem("firefoxosChats"));
        }

        
        this.username = localStorage.getItem("username");
        

        this.socket.on("firefoxOSMessage", (data) => {
            if (data.message) {
                this.messages.push(data);
                localStorage.setItem("firefoxosChats", JSON.stringify(this.messages));
            }
            else {
                console.log("error", data);
            }
        })

        this.socket.on("newFirefoxOSUser", () => {
            cordova.plugins.notification.local.schedule({
                title: "Welcome",
                message: "Welcome to the Firefox OS Room!"
            });
            
			//new Notification("Welcome to the Firefox OS Room!");
		})

		this.socket.on("firefoxOSUserLogged", () => {
            cordova.plugins.notification.local.schedule({
                title: "New User",
                message: "Someone joined the Firefox OS Room!"
            });
            
			//new Notification("Someone joined the Firefox OS Room!");
		})

		this.socket.on("firefoxOSMessageAdded", (data) => {
            cordova.plugins.notification.local.schedule({
                title: "New Message",
                message: data.user + " " + ":" + " " + data.message
            });
            
            //new Notification(data.user + " " + "says" + " " + data.message);
        })
    }

    send(chat: string) {
        this.socket.emit("firefoxOSSend", { message: chat, user: this.username });
    }

}