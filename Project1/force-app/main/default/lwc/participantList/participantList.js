import { LightningElement,api } from 'lwc';
import getParticipants from '@salesforce/apex/ParticipantController.getParticipants';

export default class ParticipantList extends LightningElement {
    @api recordId;
    participants =[];
     columns = [
    { label: 'Name', fieldName: 'Name',type:'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
    { label: 'GPA', fieldName: 'GPA__c', type: 'number' },
    { label: 'Passed', fieldName: 'Passed__c', type: 'boolean' }
];
    loadParticipants(){
        getParticipants({ training: this.recordId })
            .then(result => {
                this.participants = result;
            })
            .catch(error => {
                console.error(error);
            });
    };
    connectedCallback(){
        this.loadParticipants();
    }

}