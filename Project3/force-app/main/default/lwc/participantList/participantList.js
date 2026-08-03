import { LightningElement, api } from "lwc";
import getParticipants from "@salesforce/apex/ParticipantController.getParticipants";
import saveParticipants from "@salesforce/apex/ParticipantController.saveParticipants";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ParticipantList extends LightningElement {
  @api recordId;
  participants = [];
  searchedParticipants = [];
  draftValues = [];
  isLoading = false;
  searchText = "";
  connectedCallback() {
    this.loadParticipants();
  }
  columns = [
    { label: "Name", fieldName: "Name", type: "text", editable: true },
    { label: "Email", fieldName: "Email__c", type: "email", editable: true },
    { label: "Status", fieldName: "Status__c", type: "text" },
    { label: "GPA", fieldName: "GPA__c", type: "number", editable: true },
    { label: "Passed", fieldName: "Passed__c", type: "boolean" }
  ];
  loadParticipants() {
    this.isLoading = true;
    getParticipants({ training: this.recordId })
      .then((result) => {
        this.participants = result;
        this.searchedParticipants = result;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  handleSave(event) {
    this.draftValues = event.detail.draftValues;
    this.isLoading = true;
    saveParticipants({
      participants: this.draftValues
    })
      .then((result) => {
        this.isLoading = false;
        this.participants = result;
        this.searchedParticipants = result;
        this.draftValues = [];
        this.showToast("Success!", "Participants saved.", "success");
      })
      .catch((error) => {
        this.isLoading = false;
        this.showToast("Error!", "Participants not saved.", "error");
        console.error("Error saving records " + error);
      });
  }
  handleCancel() {
    this.draftValues = [];
  }
  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });

    this.dispatchEvent(evt);
  }
  handleSearchEvent(event) {
    this.searchText = event.detail;
    this.filteredParticipants();
  }
  filteredParticipants(){
    let key = this.searchText.toLowerCase();
    if(!key){
      this.searchedParticipants = [...this.participants];
      return;
    }
    this.searchedParticipants=  this.participants.filter(participant=>
      participant.Name?.toLowerCase().includes(key) ||
      participant.Email__c?.toLowerCase().includes(key)
    );
  }
}
