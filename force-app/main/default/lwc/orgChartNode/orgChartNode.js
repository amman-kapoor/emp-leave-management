import { LightningElement, api } from "lwc";

export default class COrgChartNode extends LightningElement {
  @api employee;
  isCollapsed = false;

  toggleCollapse() {
    if (!this.employee.DirectReports) {
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    const event = new CustomEvent("togglecollapse", {
      detail: { employeeId: this.employee.Id, isCollapsed: this.isCollapsed }
    });
    this.dispatchEvent(event);
  }
}
