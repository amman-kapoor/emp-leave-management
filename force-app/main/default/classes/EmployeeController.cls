public with sharing class EmployeeController {
    public class EmployeeWithManager {
        @AuraEnabled public String Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String ManagerId;
        @AuraEnabled public String Designation;
        @AuraEnabled public EmployeeWithManager Manager;
        @AuraEnabled public List<EmployeeWithManager> DirectReports;
    }

    @AuraEnabled(cacheable=true scope='global')
    public static Employee__c[] getAllEmployees() {
        return [
            SELECT
                Id,
                Name,
                Email__c,
                Employee_Id__c,
                Designation__c,
                Location__Latitude__s,
                Location__Longitude__s,
                Manager__r.Name,
                Gender__c
            FROM Employee__c
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true scope='global')
    public static Employee__c[] searchEmployees(String searchTerm, String filterVal) {
        searchTerm = searchTerm.trim();
        filterVal = filterVal.trim();
        if (searchTerm == '' && filterVal == 'all') {
            return getAllEmployees();
        }
        if(filterVal == 'all') {
            filterVal = '';
        }
        // Prepare query paramters
        searchTerm = '%' + searchTerm + '%';
        filterVal = '%' + filterVal + '%';
        // Execute search query
        return [
            SELECT
            Id,
            Name,
            Email__c,
            Employee_Id__c,
            Designation__c,
            Location__Latitude__s,
            Location__Longitude__s,
            Manager__r.Name,
            Gender__c
            FROM Employee__c
            WHERE Name LIKE :searchTerm
            AND Country__c LIKE :filterVal
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT 50
        ];
    }


    @AuraEnabled(cacheable=true scope='global')
    public static List<EmployeeWithManager> getEmployeeHierarchy() {
        List<EmployeeWithManager> employees = new List<EmployeeWithManager>();
        List<Employee__c> employeeRecords = [SELECT Id, Name, Manager__c, Designation__c FROM Employee__c ORDER BY Manager__c NULLS FIRST];
        Map<String, EmployeeWithManager> employeeMap = new Map<String, EmployeeWithManager>();

        for (Employee__c emp : employeeRecords) {
            EmployeeWithManager empWrapper = new EmployeeWithManager();
            empWrapper.Id = emp.Id;
            empWrapper.Name = emp.Name;
            empWrapper.ManagerId = emp.Manager__c;
            empWrapper.Designation = emp.Designation__c;

            employeeMap.put(empWrapper.Id, empWrapper);
            employees.add(empWrapper);
        }

        for (Employee__c emp : employeeRecords) {
            if (emp.Manager__c != null && employeeMap.containsKey(emp.Manager__c)) {
                if (employeeMap.get(emp.Manager__c).DirectReports == null) {
                    employeeMap.get(emp.Manager__c).DirectReports = new List<EmployeeWithManager>();
                }
                employeeMap.get(emp.Manager__c).DirectReports.add(employeeMap.get(emp.Id));
            }
        }

        List<EmployeeWithManager> hierarchy = new List<EmployeeWithManager>();
        for (EmployeeWithManager emp : employees) {
            if (emp.ManagerId == null) {
                hierarchy.add(emp);
            }
        }

        return hierarchy;
    }
}


