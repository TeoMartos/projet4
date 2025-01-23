@IsTest
public class ProductSelectorTest {
    @IsTest
    static void testGetProductByOpportunityId() {
        // Crée les données de test
        Opportunity testOpp = TestDataFactory.createTestOpportunity();
        Product2 testProduct = TestDataFactory.createTestProduct();
        PricebookEntry testPricebookEntry = TestDataFactory.createTestPricebookEntry(testProduct);
        OpportunityLineItem testOLI = TestDataFactory.createTestOpportunityLineItem(testOpp, testProduct);

        // Exécute la méthode à tester
        Test.startTest();
        List<OpportunityLineItem> result = ProductSelector.getProductByOpportunityId(testOpp.Id);
        Test.stopTest();

        // Vérifie les résultats
        System.assert(result != null, 'La liste retournée ne doit pas être nulle');
        System.assertEquals(1, result.size(), 'La liste doit contenir un seul élément');
        System.assertEquals(testOLI.Id, result[0].Id, 'L\'ID de l\'élément retourné doit correspondre à celui créé');
    }
}
