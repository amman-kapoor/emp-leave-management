import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { publish, MessageContext } from "lightning/messageService";
import LEAVE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/LeaveListUpdate__c";
import applyLeave from "@salesforce/apex/LeaveRequestController.applyLeave";

export default class ModalComponent extends LightningElement {
  @api isopen = false;
  objectApiName = "Leave__c";
  recordId = "";
  @wire(MessageContext) messageContext;

  connectedCallback() {}

  closeModal() {
    const modalCloseEvent = new CustomEvent("modalclose");
    this.dispatchEvent(modalCloseEvent);
  }

  handleModalClose() {}

  successHandler() {
    const message = {
      employees: "test"
    };
    publish(this.messageContext, LEAVE_LIST_UPDATE_MESSAGE, message);
    this.closeModal();
    this.showToast("Leave Applied successfully!!");
  }

  submitHandler(event) {
    event.preventDefault();
    const fields = { ...event.detail.fields };
    fields.Status__c = "Pending";
    if (new Date(fields.From__c) > new Date(fields.To__c)) {
      this.showToast(
        "From Date should not be greater then To Date",
        "Error",
        "error"
      );
    } else if (new Date() > new Date(fields.From__c)) {
      this.showToast("From Date should be less then Today", "Error", "error");
    } else {
      const leaveData = {
        User__c: fields.User__c,
        From__c: fields.From__c,
        To__c: fields.To__c,
        Reason__c: fields.Reason__c
      };
      this.applyLeave(leaveData);
    }
  }

  applyLeave(leaveData) {
    applyLeave({ leaveData: leaveData })
      .then((result) => {
        if (result.success) {
          this.successHandler();
        } else {
          console.error("Leave application failed:", result.error);
        }
      })
      .catch((error) => {
        console.error("Error applying leave:", error);
      });
  }

  showToast(message, title = "success", variant = "success") {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }
}
