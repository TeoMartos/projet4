public with sharing class ProductController {
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getProducts(Id accountId) {
        return ProductSelector.getProductByOpportunityId(accountId);
    }
}