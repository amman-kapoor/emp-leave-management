import { LightningElement, wire } from "lwc";
import getMyLeaves from "@salesforce/apex/LeaveRequestController.getMyLeaves";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import LEAVE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/LeaveListUpdate__c";
import { refreshApex } from "@salesforce/apex";

export default class RejectedLeaves extends LightningElement {
  rejectedLeaves = [];
  subscription = null;
  leaveStatus = "Rejected";
  wiredResult;

  @wire(MessageContext)
  messageContext;

  @wire(getMyLeaves, { leaveStatus: "$leaveStatus" })
  loadApprovedLeaves(result) {
    if (result.data) {
      this.rejectedLeaves = result.data;
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
    return this.rejectedLeaves.length < 1;
  }
}
