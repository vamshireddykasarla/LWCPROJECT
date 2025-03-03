// AccountParent.js
import { LightningElement, track } from 'lwc';

export default class AccountParent extends LightningElement {
    @track searchTextParent;  // Holds the search key received from the child

    handleEvent(event) {
        this.searchTextParent = event.detail;  // Corrected to use 'searchKey'
        console.log('Message received in accountParent: ' + this.searchTextParent);
    }
}
