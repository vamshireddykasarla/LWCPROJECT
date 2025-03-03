// AccountChild2.js
import { LightningElement, api, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountClass.getAccounts';
import { publish, MessageContext } from 'lightning/messageService';
import Marvel from '@salesforce/messageChannel/Marvel__c';

export default class AccountChild2 extends LightningElement {
    @api searchtextchild2;  // Receiving the searchText from the parent
    @wire(MessageContext)
    messageContext;

    // You can use `searchtextchild2` directly in your template or logic
    columns=[
        {label : 'Id', fieldName:'Id'},
        {label : 'Name',fieldName:'Name'},
        {label:'Actions', fieldName:'Actions', type:'button', typeAttributes:
            {label:'View Contacts',
            value:'view_contacts'
        }}
    ];
    rows=[
        {Id:'12', Name:'Test1'},
        {Id:'23', Name:'Test2'},
        {Id:'39', Name:'Test3'},
        {Id:'45', Name:'Test4'},
        {Id:'56', Name:'Test5'}
    ]
    columnId;
    columnName;
    handleRowAction(event){
        if(event.detail.action.value === 'view_contacts'){
            this.columnId = event.detail.row.Id;
            this.columnName = event.detail.row.Name;
            console.log('Row Id: '+this.columnId);
            console.log('Row Name: '+this.columnName);

            //publisher method so that we can communicate with unrelated components
            const payload={
                accountId:event.detail.row.Id,
                accountName:event.detail.row.Name
            };
            //messagecontext object is created using wire decroater publis has 3 attributes one is message context 
            //and one is payload 2nd is channel name and 3rd is payload
           publish(this.messageContext,Marvel,payload);
        }
    }
    @wire(getAccounts,{searchText:'$searchtextchild2'}) 
    accountsDetails;
    //[] defines an array
    //defines a object {}label and name of the coloumn
}
