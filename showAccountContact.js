import { LightningElement,track,wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import Marvel from '@salesforce/messageChannel/Marvel__c';
import getContact from '@salesforce/apex/AccountClass.getContact';

export default class ShowAccountContact extends LightningElement {
    connectedCallback(){
        this.handleSubscribe();
        console.log('ShowAccountContact connectedCallback');
    }
    disconnectedCallback(){
        this
        .handleUnsubscribe();
        console.log('ShowAccountContact disconnectedCallback');
    }
    @wire(MessageContext)
    messageContext;
    subscription = null;
    accountId;
    accountName;
    title='Contacts';
    @track contacts;
    @track hasContacts;
    handleSubscribe(){
        if(!this.subscription){
            this.subscription = subscribe(this.messageContext, Marvel, 
                (message) => 
                    {
                    this.accountId=message.accountId;   
                    this.accountName=message.accountName;
                    this.title=this.accountName +"'S Contact";
                    this.getContacts();
                    console.log('ShowAccountContact handleSubscribe');
                    console.log('Account Id: '+this.accountId);
                    console.log('Account Name: '+this.accountName);

            });
        }
    }
    //there are two methods to read salesforce data one is wire and imperative method
    //but we are using imperitive method this time we will have two key word async and await
    async getContacts(){
        try{
            const result = await getContact({accountId:this.accountId});
            this.contacts = result;
            this.hasContacts=this.contacts.length>0?true:false;

            console.log('ShowAccountContact getContacts');
            console.log('Contacts: '+JSON.stringify(this.contacts));
        }
        catch(error){
            console.error('Error in getting contacts: '+error);
        }}
    handleUnsubscribe(){
        if(this.subscription){
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }
}