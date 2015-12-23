/*
    This is the first view of the application. The logic for all the other rooms is very similar
    so only this room component is documented.
*/


import {Page, NavController, Popup} from 'ionic-framework/ionic';

import {StorageService} from "../services/storage-service";
import {Usernames} from "../services/username-service";

@Page({
    templateUrl: 'app/getting-started/getting-started.html',
    providers: [StorageService, Usernames]
})
export class GettingStartedPage {
    
    //socket.io socket
    socket: any;
    
    //this array holds all the chats for this page
    messages: any[];
    
    //randomly picked username for the user
    username: string;

    constructor(nav: NavController, private storage: StorageService, popup: Popup, private usernames: Usernames) {
        
        //using the same server here as the Firefox OS client
        this.socket = io.connect("https://freechat-firefox.herokuapp.com");
        
        //popup from ionic
        this.popup = popup;

        //get chats if there are some saved, if not just set chats array (this.messages) to an empty array
        if (localStorage.getItem("chats") === null) {
            this.messages = [];
        }
        else {
            this.messages = JSON.parse(localStorage.getItem("chats"));
        }
        
        //randomly pick username for each user from an array of potential usernames
        //we store this in localstorage and only do it once, until localstorage gets cleared
        if (localStorage.getItem("username") === null) {
            let potentialUsernames = this.usernames.usernames;
            this.username = potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
            localStorage.setItem("username", this.username);
            
            //tell user the username thats been picked
            this.popup.alert({
                title: "Random Username",
                template: "Your completely random username is" + " " + this.username
            }).then(() => {
                console.log("alert closed");
            })
        }
        else {
            this.username = localStorage.getItem("username");
        }
        
        //socket.io stuff begins
        
        //when we recieve a message we push it to this.messages and re-save the array
        this.socket.on("message", (data) => {
            if (data.message) {
                this.messages.push(data);
                this.storage.saveChats(this.messages);
            }
            else {
                console.log("error", data);
            }
        })

        //when other users submit chats we show a notification
        this.socket.on("messageAdded", (data) => {
            cordova.plugins.notification.local.schedule({
                title: "New Message",
                message: data.user + " " + ":" + " " + data.message
            });
            
            //new Notification(data.user + " " + "says" + " " + data.message);
        })
        
        //when somebody else joins we show a notification
        this.socket.on("userLogged", () => {
            cordova.plugins.notification.local.schedule({
                title: "New User",
                message: "A new user has joined chat"
            });
            
            //new Notification("A new user has joined chat");
        })
    }
    
    //submit a chat, this triggers this.socket.on("message") above
    send(chat: string) {
        this.socket.emit("send", { message: chat, user: this.username });
    }

}
