public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchText) {
        try {
            if (searchText == null ) {
                // Fetch all records if searchText is blank or null
                return [SELECT Id, Name FROM Account LIMIT 50];
            } else {
                searchText = '%' + searchText + '%';
                return [SELECT Id, Name FROM Account WHERE Name LIKE :searchText LIMIT 50];
            }
        } catch (Exception e) {
            System.debug('Error in getAccounts: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContact(String accountId) {
        try {
            return [SELECT Id, Name,Phone FROM Contact WHERE accountId = :accountId ];
        } catch (Exception e) {
            System.debug('Error in getAccountById: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}
