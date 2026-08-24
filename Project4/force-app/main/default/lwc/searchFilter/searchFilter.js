import { LightningElement } from "lwc";

export default class SearchFilter extends LightningElement {
  handleChange(event) {
    const searchEvent = new CustomEvent("searchevent", {
      detail: event.target.value
    });
    this.dispatchEvent(searchEvent);
  }
}
