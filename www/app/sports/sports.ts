import {Page, NavController, Popup} from 'ionic-framework/ionic';

import {StorageService} from "../services/storage-service";
import {Usernames} from "../services/username-service";

@Page({
    templateUrl: 'app/sports/sports.html',
    providers: [StorageService, Usernames]
})
export class SportsPage {

    socket: any;
    messages: any[];
    username: string;

    constructor(nav: NavController, private storage: StorageService) {
        this.socket = io.connect("https://freechat-firefox.herokuapp.com/Sports");
        
        if (localStorage.getItem("sportsChats") === null) {
            this.messages = [];
        }
        else {
            this.messages = JSON.parse(localStorage.getItem("sportsChats"));
        }

        
        this.username = localStorage.getItem("username");
        

        this.socket.on("sportsMessage", (data) => {
            if (data.message) {
                this.messages.push(data);
                localStorage.setItem("sportsChats", JSON.stringify(this.messages));
            }
            else {
                console.log("error", data);
            }
        })

        this.socket.on("newSportsUser", () => {
            cordova.plugins.notification.local.schedule({
                title: "Welcome",
                message: "Welcome to the Sports Room!"
            });
            
			//new Notification("Welcome to the Sports Room!");
		})

		this.socket.on("sportsUserLogged", () => {
            cordova.plugins.notification.local.schedule({
                title: "New User",
                message: "Someone joined the Sports Room!"
            });
            
			//new Notification("Someone joined the Sports Room!");
		})

		this.socket.on("sportsMessageAdded", (data) => {
            cordova.plugins.notification.local.schedule({
                title: "New Message",
                message: data.user + " " + ":" + " " + data.message
            });
            //new Notification(data.user + " " + "says" + " " + data.message);
        })
    }

    send(chat: string) {
        this.socket.emit("sportsSend", { message: chat, user: this.username });
    }

}