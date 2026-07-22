public with sharing class ParticipantController {
  @AuraEnabled(cacheable=true)
  public static List<Participant__c> getParticipants(String training) {
    if(training==null){
        return new List<Participant__c>();
    }
    return [
      SELECT Id, Name, Email__c, GPA__c, Status__c, Passed__c
      FROM Participant__c
      WHERE Training__c = :training
    ];
  }
}
