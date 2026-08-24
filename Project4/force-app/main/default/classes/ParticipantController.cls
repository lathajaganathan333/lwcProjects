public with sharing class ParticipantController {
  @AuraEnabled
  public static List<Participant__c> getParticipants(String training) {
    if (training == null) {
      return new List<Participant__c>();
    }

    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c
      WHERE Training__c = :training
    ];
  }
  @AuraEnabled
  public static List<Participant__c> saveParticipants(
    List<Participant__c> participants,Id trainingId
  ) {
    update participants;
    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c  WHERE Training__c = :trainingId
     ];
  }
  @AuraEnabled
   public static List<Participant__c> deleteParticipant(Id participantId,Id trainingId) {
    delete [SELECT Id FROM Participant__c WHERE Id = :participantId];
    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c WHERE Training__c = :trainingId
     ];
  }
}
