public with sharing class ProductController {
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getProducts(Id oppId) {
        return ProductSelector.getProductByOpportunityId(oppId);
    }
}
