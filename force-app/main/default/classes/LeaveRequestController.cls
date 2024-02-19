public with sharing class LeaveRequestController {
    @AuraEnabled(cacheable=true)
    public static List<Leave__c> getMyLeaves(String leaveStatus){
        try {
            List<Leave__c> myLeaves=new List<Leave__c>();
            myLeaves=[SELECT Id,From__c,To__c,Reason__c,Status__c,Manager_Comment__c FROM Leave__c WHERE  Status__c =:leaveStatus ORDER BY CreatedDate DESC];
            return myLeaves;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String, Object> applyLeave(Map<String, Object> leaveData) {
        Map<String, Object> result = new Map<String, Object>();
        try {
            Leave__c leaveRecord = new Leave__c(
                User__c = (String)leaveData.get('User__c'),
                From__c = Date.valueOf((String)leaveData.get('From__c')), 
                To__c = Date.valueOf((String)leaveData.get('To__c')),    
                Reason__c = (String)leaveData.get('Reason__c'),
                Status__c = 'Pending'
            );
            insert leaveRecord;
            result.put('success', true);

            sendEmailToManager(leaveRecord);
        } catch (Exception e) {
            // Log the error or handle it appropriately
            System.debug('Error applying leave: ' + e.getMessage());
            result.put('success', false);
            result.put('error', e.getMessage());
        }
    
        return result;
    }


    private static void sendEmailToManager(Leave__c leaveRecord) {
        Employee__c info = [SELECT Name, Manager__r.Email__c FROM Employee__c WHERE Id = :leaveRecord.User__c LIMIT 1];
    
        if (info != null && info.Manager__r != null && info.Manager__r.Email__c != null) {
            String managerEmail = info.Manager__r.Email__c;
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setToAddresses(new String[]{managerEmail}); 
                mail.setSubject('Leave Application - ' + info.Name);
                mail.setPlainTextBody('Reason for Leave - ' + leaveRecord.Reason__c);

                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        } else {
            System.debug('Manager information or email not found for the leave application.');
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Leave__c> getLeaveRequests() {
        try {
            String currentUserId = UserInfo.getUserId();

            User currentUser = [SELECT Name FROM User WHERE Id = :currentUserId LIMIT 1];

            if (currentUser != null) {
                String managerName = currentUser.Name;

                List<Leave__c> leaveRequests = [
                    SELECT Id, From__c, To__c, Reason__c, User__r.Name
                    FROM Leave__c
                    WHERE User__r.Manager__r.Name = :managerName
                    AND Status__c ='Pending'
                    ORDER BY CreatedDate DESC
                ];

                return leaveRequests;
            } else {
                throw new AuraHandledException('Current User not found.');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static Leave__c approveLeaveStatus(String leaveId) {
        Leave__c leaveRecord = [SELECT Id, Status__c FROM Leave__c WHERE Id = :leaveId LIMIT 1];
        if (leaveRecord != null) {
            leaveRecord.Status__c = 'Approved';
            update leaveRecord;
        }
        return leaveRecord;
    }
}

