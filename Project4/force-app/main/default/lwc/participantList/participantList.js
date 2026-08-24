import { LightningElement, api } from "lwc";
import getParticipants from "@salesforce/apex/ParticipantController.getParticipants";
import saveParticipants from "@salesforce/apex/ParticipantController.saveParticipants";
import deleteParticipant from "@salesforce/apex/ParticipantController.deleteParticipant";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import LightningConfirm from "lightning/confirm";

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
    {
      label: "Name",
      fieldName: "participantUrl",
      type: "url",
      typeAttributes: { label: { fieldName: "Name" }, target: "_blank" }
    },
    { label: "Email", fieldName: "Email__c", type: "email", editable: true },
    { label: "Status", fieldName: "Status__c", type: "text" },
    { label: "GPA", fieldName: "GPA__c", type: "number", editable: true },
    { label: "Passed", fieldName: "Passed__c", type: "boolean" },
    {
      label: "Actions",
      fieldName: "Actions",
      type: "button",
      typeAttributes: { label: "Delete", name: "delete" }
    }
  ];
  loadParticipants() {
    this.isLoading = true;
    getParticipants({ training: this.recordId })
      .then((result) => {
        result.forEach((record) => {
          record.participantUrl = "/" + record.Id;
        });
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
      participants: this.draftValues,
      trainingId: this.recordId
    })
      .then((results) => {
        this.isLoading = false;
        this.participants = results.map((result) => ({
          ...result,
          participantUrl: "/" + result.Id
        }));
        this.searchedParticipants = this.participants;
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
  filteredParticipants() {
    let key = this.searchText.toLowerCase();
    if (!key) {
      this.searchedParticipants = [...this.participants];
      return;
    }
    this.searchedParticipants = this.participants.filter(
      (participant) =>
        participant.Name?.toLowerCase().includes(key) ||
        participant.Email__c?.toLowerCase().includes(key)
    );
  }
  async handleRowAction(event) {
    const action = event.detail.action.name;
    const row = event.detail.row;
    console.log(row);

    if (action === "delete") {
      const confirmed = await LightningConfirm.open({
        message: "Are you sure you want to delete this participant?",
        label: "Confirm deletion?",
        theme: "error"
      });
      if (!confirmed) {
        return;
      }
      if (confirmed) {
        deleteParticipant({ participantId: row.Id, trainingId: this.recordId })
          .then((results) => {
            this.participants = results.map((result) => ({
              ...result,
              participantUrl: "/" + result.Id
            }));
            this.searchedParticipants = this.participants;
            this.showToast("Success!", "Participant is Deleted.", "success");
          })
          .catch((error) => {
            this.showToast("Error!", "Participant is not deleted.", "error");
            console.error("Error saving records " + error);
          });
      }
    }
  }
}
