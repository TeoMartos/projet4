/**
 * Created by TMARTOS on 05/12/2024.
 */

public with sharing class UserController {
    @AuraEnabled(Cacheable=true)
    public static List<User> getUser(Id userId) {
        return UserSelector.getUserByProfile(userId);
    }
}