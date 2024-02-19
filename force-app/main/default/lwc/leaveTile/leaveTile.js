import { LightningElement, api } from "lwc";
import approveLeaveStatus from "@salesforce/apex/LeaveRequestController.approveLeaveStatus";

export default class LeaveTile extends LightningElement {
  @api leave;
  @api type;
  numOfDays;
  fromDate;
  toDate;

  getNumOfDays = (date1, date2) => {
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const timeDifference = endDate - startDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return Math.round(daysDifference);
  };

  formatDate(inputDate) {
    const date = new Date(inputDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  connectedCallback() {
    this.numOfDays = this.getNumOfDays(this.leave.From__c, this.leave.To__c);
    this.fromDate = this.formatDate(this.leave.From__c);
    this.toDate = this.formatDate(this.leave.To__c);
  }

  approveRequest() {
    const leaveId = this.leave ? this.leave.Id : null;

    if (leaveId) {
      console.log("ammankapooor", leaveId);
      approveLeaveStatus({ leaveId: leaveId })
        .then((result) => {
          console.log("result", result);
          // Handle the result as needed
        })
        .catch((error) => {
          console.error("Error applying leave:", error);
        });
    } else {
      console.error("Leave Id is not available.");
    }
  }

  get getBackgroundColor() {
    let color;
    switch (this.type) {
      case "request":
        color = "#cccc00";
        break;
      case "approved":
        color = "#00cc00";
        break;
      case "rejected":
        color = "#ff4d4d";
        break;
      default:
        color = "#0070D2;";
        break;
    }
    return `background-color: ${color};`;
  }

  get getControls() {
    return this.type === "request";
  }

  handleOpenRecordClick() {}
}
