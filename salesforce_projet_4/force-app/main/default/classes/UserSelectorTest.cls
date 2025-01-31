@IsTest
private class UserSelectorTest {
    @IsTest
    static void testGetUserByProfile() {
        // Crée un utilisateur de test avec un profil défini
        User user = TestDataFactory.createTestUser();

        // Appelle la méthode et vérifie le résultat
        Test.startTest();
        List<User> users = UserSelector.getUserByProfile(user.Id);
        Test.stopTest();

        System.assertNotEquals(null, users, 'The user list should not be null');
        System.assertEquals(1, users.size(), 'The user list size should be 1');
        System.assertEquals('Standard User', users[0].Profile.Name, 'The profile name should match');
    }

    @IsTest
    static void testGetNoUserByProfile() {
        // Assure qu'aucun utilisateur ne correspond au profil testé
        String nonExistentProfileId = '005000000000000AAA'; // Remplace par un ID inexistant si nécessaire

        // Appelle la méthode et vérifie le résultat
        Test.startTest();
        List<User> users = UserSelector.getUserByProfile(nonExistentProfileId);
        Test.stopTest();

        System.assertNotEquals(null, users, 'The user list should not be null');
        System.assertEquals(0, users.size(), 'The user list should be empty');
    }
}
