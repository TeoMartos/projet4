import { LightningElement, api, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class GetOpportunityProduct extends LightningElement {
    @api recordId;
    @track products;
    @track error;
    columns = [
        { label: 'Nom du produit', fieldName: 'Product2.Name', type: 'text' },
        { label: 'Quantité', fieldName: 'Quantity', type: 'currency' },
        { label: 'Prix Unitaire', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'Prix Total', fieldName: 'TotalPrice', type: 'currency' },
        { label: 'Quantité en Stock', fieldName: 'Product2.QuantityInStock__c', type: 'number' },
        {
            type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                title: 'Delete',
                disabled: false,
                value: 'delete',
                iconPosition: 'left',
                iconName:'utility:delete',
                variant:'destructive'
            }
        },
        {
            type: "button", label: 'View', initialWidth: 100, typeAttributes: {
                label: 'View',
                name: 'View',
                title: 'View',
                   disabled: false,
                        value: 'view',
                        iconPosition: 'left',
                        iconName:'utility:preview',
                        variant:'Brand'
                }
           },
    ];
    wiredProductsResult;
    @wire(getProducts, { accountId : '$recordId' })
    wiredProducts(result) {
        this.wiredProductsResult = result;
        if (result.data) {
            this.products = result.data.length > 0 ? result.data : null;
            this.error = result.data.length == 0 ? 'Vous n\'avez pas de produit associées à l\'opportunités' : null;
        } else if (result.error) {
            this.error = 'Une erreur s\'est produite lors du chargement des produits.'
            this.products = undefined;
        }
    }
    get errorStyle () {
        return this.error && this.error.includes('Vous n\'avez aucune ligne de produits pour le moment.\n1. Veuillez tout d\'abord sélectionner un Catalogue (Pricebook) \n2. Sélectionnez ensuite les produits à ajouter.')
        ? 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info' : 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error'
    }
}