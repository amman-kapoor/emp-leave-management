import { LightningElement, api } from "lwc";

export default class EmployeeTile extends LightningElement {
  @api employee;

  handleOpenRecordClick() {
    const selectEvent = new CustomEvent("employeeview", {
      detail: this.employee.Id
    });
    this.dispatchEvent(selectEvent);
  }
}
