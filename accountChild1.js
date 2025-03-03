// AccountChild1.js
import { LightningElement } from 'lwc';

export default class AccountChild1 extends LightningElement {
    searchKey;  // Holds the search input value

    handlechange(event) {
        this.searchKey = event.target.value;
        console.log('Message received in accountChild1: ' + this.searchKey);  // Corrected the logging
    }

    handleclick() {
        // Dispatching the custom event with the searchKey
        const searchEvent = new CustomEvent('getsearchevent', { 
            detail: this.searchKey
        });
        this.dispatchEvent(searchEvent);
    }
}
