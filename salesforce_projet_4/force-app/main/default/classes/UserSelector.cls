/**
 * Created by TMARTOS on 05/12/2024.
 */

public with sharing class UserSelector {
    public static List<User> getUserByProfile(Id userId) {
        return [
                SELECT Id, Profile.Name FROM User WHERE Id = :userId
        ];
    }
}