public with sharing class ProductController {
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getProducts(Id accountId) {
        System.debug('------------------------------------------------------');
        return ProductSelector.getProductByOpportunityId(accountId);
    }
}