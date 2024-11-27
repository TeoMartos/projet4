trigger TriggerAmountOpp on Opportunity (before insert) {
    List<Id> oppIds = new List<Id>();

    for (Opportunity opp : Trigger.new) {
        oppIds.add(opp.AccountId);
    }

    if (!oppIds.isEmpty()) {
        List<AggregateResult> groupedResultsOpp = [
                SELECT accountId, SUM(Amount) DiscountAmount
                FROM Opportunity
                WHERE StageName = 'Closed Won' AND accountId IN :oppIds
                GROUP BY AccountId
        ];

        for (Opportunity opp : Trigger.new) {
            for (AggregateResult agg : groupedResultsOpp) {
                if ((Decimal) agg.get('DiscountAmount') >= 50000 && opp.AccountId.equals(agg.get('accountId'))) {
                    opp.Amount = opp.Amount * 0.9;
                }
            }
        }
    }
}

//On recupere les ids de comptes oppurtnités ids qui declenche le trigger
//on recupere la somme des opp Closed Won
//Pour chaque opp on parcours le result de la requete
//Si le resul > 50000 on fait la remise