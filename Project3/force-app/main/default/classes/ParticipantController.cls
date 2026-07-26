public with sharing class ParticipantController {
  @AuraEnabled
  public static List<Participant__c> getParticipants(
    String training,
    String searchText
  ) {
    if (training == null) {
      return new List<Participant__c>();
    }
    String key = '%' + (String.isBlank(searchText) ? '' : searchText) + '%';
    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c
      WHERE Training__c = :training AND (Name LIKE :key OR Email__c LIKE :key)
    ];
  }
  @AuraEnabled
  public static List<Participant__c> saveParticipants(
    List<Participant__c> participants
  ) {
    update participants;
    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c
      WHERE Id IN :participants
    ];
  }
}
