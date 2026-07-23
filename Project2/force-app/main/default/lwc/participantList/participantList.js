import { LightningElement, api } from "lwc";
import getParticipants from "@salesforce/apex/ParticipantController.getParticipants";
import saveParticipants from "@salesforce/apex/ParticipantController.saveParticipants";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ParticipantList extends LightningElement {
  @api recordId;
  participants = [];
  draftValues = [];
  isLoading = false;
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
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  connectedCallback() {
    this.loadParticipants();
  }

  handleSave(event) {
    this.draftValues = event.detail.draftValues;
    this.isLoading =true;
    saveParticipants({
      participants: this.draftValues
    })
      .then((result) => {
        this.isLoading = false;
        this.participants = result;
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
}
