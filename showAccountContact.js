import { LightningElement,track,wire, api } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import Marvel from '@salesforce/messageChannel/Marvel__c';
import getContact from '@salesforce/apex/AccountClass.getContact';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


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
    isAccountSelected=false;
    @track isAddContact=false;
    @track isEditcontact=false;
    editableAccountId;
   
    //isCancelEvent=false;
    @api recordId;
    handleSubscribe(){
        if(!this.subscription){
            this.subscription = subscribe(this.messageContext, Marvel, 
                (message) => 
                    {
                    this.accountId=message.accountId;   
                    this.accountName=message.accountName;
                    this.title=this.accountName +"'S Contact";
                    this.getContact=this.contacts;
                    refreshApex(this.getContact);
                    console.log('ShowAccountContact handleSubscribe');
                    console.log('Account Id: '+this.accountId);
                    console.log('Account Name: '+this.accountName);

            });
        }
    }
    //there are two methods to read salesforce data one is wire and imperative method
    //but we are using imperitive method this time we will have two key word async and await
   @wire(getContact, { accountId: '$accountId' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            this.hasContacts = this.contacts.length > 0;
            this.isAccountSelected = true;
        } else if (error) {
            console.error('Error fetching contacts:', error);
            this.contacts = [];
            this.hasContacts = false;
        }
    }
    /*async getContacts(){
        try{
            const result = await getContact({accountId:this.accountId});
            this.contacts = result;
            this.hasContacts=this.contacts.length>0?true:false;
            this.isAccountSelected=true;

            console.log('ShowAccountContact getContacts');
            console.log('Contacts: '+JSON.stringify(this.contacts));
        }
        catch(error){
            console.error('Error in getting contacts: '+error);
        }}*/
    handleUnsubscribe(){
        if(this.subscription){
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }
    handleAddContact(event){
        this.isAddContact=true;
    }
    handleCancelEvent(event){
        this.isAddContact=false;
    }
    handleEditEvent(event){
        this.isEditcontact=true;
        this.editableAccountId=event.target.dataset.contactId;
    }
    handleCancelEditEvent(event){
        this.isEditcontact=false;
    }
    async handleSuccess(event) {
        this.isAddContact=false;
        this.isEditcontact=false;
        await this.getContacts();
    }
   async handleDelete(event){
        this.editableAccountId=event.target.dataset.contactId;
        const result = await LightningConfirm.open({
            message: 'Are you sure want to delete it?',
            variant: 'headerless',
            label: 'this is the aria-label value',
            // setting theme would have no effect
        });
        if(result){
            let deleterecord=deleteRecord(this.editableAccountId);
            this.showToast();
            this.getContacts();
        }
    }
    showToast() {
        const event = new ShowToastEvent({
            title: 'Delete',
            message:
                'Contact Success fully deleted',
        });
        this.dispatchEvent(event);
    }
    

}