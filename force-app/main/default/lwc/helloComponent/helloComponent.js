import { LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";

const FIELDS = ["User.Name"];

export default class HelloComponent extends LightningElement {
  title = "";
  currentUser;

  @wire(getRecord, { recordId: USER_ID, fields: FIELDS })
  wiredUser({ error, data }) {
    if (data) {
      // Extract the username from the response
      this.currentUser = data.fields.Name.value;
    } else if (error) {
      console.error("Error fetching current user information", error);
    }
  }

  connectedCallback() {
    this.setTitle();
  }

  setTitle() {
    this.title = this.getGreeting() + ", " + this.currentUser;
  }

  getGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good evening";
    }
    return "Good night";
  }
}
