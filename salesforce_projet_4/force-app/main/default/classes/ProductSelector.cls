public with sharing class ProductSelector {
    public static List<OpportunityLineItem> getProductByOpportunityId(Id oppId) {
        return [SELECT Id, Product2.Name, UnitPrice, TotalPrice, Quantity, Product2.QuantityInStock__c FROM OpportunityLineItem WHERE OpportunityId = :oppId];
    }
}