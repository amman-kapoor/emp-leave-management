import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import EMPLOYEE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/EmployeeListUpdate__c";

export default class EmployeeMap extends LightningElement {
  mapMarkers = [];
  subscription = null;
  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      EMPLOYEE_LIST_UPDATE_MESSAGE,
      (message) => {
        this.handleEmployeeListUpdate(message);
      }
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleEmployeeListUpdate(message) {
    this.mapMarkers = message.employees.map((employee) => {
      const Latitude = employee.Location__Latitude__s;
      const Longitude = employee.Location__Longitude__s;
      return {
        location: { Latitude, Longitude },
        title: employee.Name,
        icon: "standard:employee"
      };
    });
  }
}
