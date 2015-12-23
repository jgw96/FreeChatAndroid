/*
    This service needs to be rewritten and completed. Its not even a quarter of the way done.
*/

export class StorageService {
   
    constructor() {
        
    }
    
    saveChats(chats: Object[]) {
        localStorage.setItem("chats", JSON.stringify(chats))
    }
    
}