@IsTest
public class TestDataFactory {
    public static Opportunity createTestOpportunity() {
// Crée une opportunité et associe le Pricebook standard
        Opportunity opp = new Opportunity(
                Name = 'Test Opportunity',
                StageName = 'Prospecting',
                CloseDate = Date.today(),
                Pricebook2Id = Test.getStandardPricebookId()
        );
        insert opp;
        return opp;
    }

    public static Product2 createTestProduct() {
        Product2 product = new Product2(
                Name = 'Test Product',
                IsActive = true,
                QuantityInStock__c = 50 // Définir une valeur pour le champ QuantityInStock__c
        );
        insert product;
        return product;
    }

    public static PricebookEntry createTestPricebookEntry(Product2 product) {
        // Crée une entrée de prix standard pour le produit
        PricebookEntry standardPriceEntry = new PricebookEntry(
                Pricebook2Id = Test.getStandardPricebookId(),
                Product2Id = product.Id,
                UnitPrice = 100,
                IsActive = true
        );
        insert standardPriceEntry;
        return standardPriceEntry;
    }

    public static OpportunityLineItem createTestOpportunityLineItem(Opportunity opp, Product2 product) {
        OpportunityLineItem oli = new OpportunityLineItem(
                OpportunityId = opp.Id,
                Product2Id = product.Id, // Utilise directement l'ID du produit
                Quantity = 1,
                UnitPrice = 100
        );
        insert oli;
        return oli;
    }

    public static User createTestUser() {
        // Récupère le profil Standard User
        Profile profile = [SELECT Id, Name FROM Profile WHERE Name = 'Standard User' LIMIT 1];

        User user = new User(
                FirstName = 'Test',
                LastName = 'User',
                Email = 'testuser@example.com',
                Username = 'testuser' + System.currentTimeMillis() + '@example.com',
                Alias = 'tuser',
                ProfileId = profile.Id,
                TimeZoneSidKey = 'America/Los_Angeles',
                LocaleSidKey = 'en_US',
                EmailEncodingKey = 'UTF-8',
                LanguageLocaleKey = 'en_US'
        );
        insert user;
        return user;
    }
}
