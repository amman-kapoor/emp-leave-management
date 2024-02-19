import { LightningElement, track, wire } from "lwc";
import getLeaveRequests from "@salesforce/apex/LeaveRequestController.getLeaveRequests";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import LEAVE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/LeaveListUpdate__c";
import { refreshApex } from "@salesforce/apex";

export default class LeaveRequests extends LightningElement {
  @track isModalOpen = false;
  leaveRequests = [];
  subscription = null;
  wiredResult;

  @wire(MessageContext)
  messageContext;

  @wire(getLeaveRequests)
  loadLeaveRequest(result) {
    this.wiredResult = result;
    if (result.data) {
      this.leaveRequests = result.data;
    }
  }

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      LEAVE_LIST_UPDATE_MESSAGE,
      (message) => {
        this.handleLeaveListUpdate(message);
      }
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // eslint-disable-next-line no-unused-vars
  handleLeaveListUpdate(_message) {
    refreshApex(this.wiredResult);
  }

  get noRecordFound() {
    return this.leaveRequests.length < 1;
  }

  openModal() {
    this.isModalOpen = true;
  }

  handleModalClose() {
    this.isModalOpen = false;
  }
}
