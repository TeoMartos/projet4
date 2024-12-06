import {
    LightningElement,
    api,
    wire,
    track
} from 'lwc';
import {
    NavigationMixin
} from 'lightning/navigation';
import {
    deleteRecord
} from 'lightning/uiRecordApi';

import getProducts from '@salesforce/apex/ProductController.getProducts';
import getUser from '@salesforce/apex/UserController.getUser';

export default class GetOpportunityProduct extends NavigationMixin(LightningElement) {
    @api recordId;
    @track products;
    @track error;
    @track isButtonDisabled = false;
    @track hasQuantityIssue = false;

    columns = [{
            label: 'Nom du produit',
            fieldName: 'productName',
            type: 'text'
        },
        {
            label: 'Quantité',
            fieldName: 'Quantity',
            type: 'number',
            cellAttributes: {
                style: {
                    fieldName: 'quantityStyle'
                }
            }
        },
        {
            label: 'Prix Unitaire',
            fieldName: 'UnitPrice',
            type: 'currency'
        },
        {
            label: 'Prix Total',
            fieldName: 'TotalPrice',
            type: 'currency'
        },
        {
            label: 'Quantité en Stock',
            fieldName: 'Quantity_In_Stock__c',
            type: 'number'
        },
        {
            type: "button",
            label: 'Delete',
            initialWidth: 110,
            typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                title: 'Delete',
                value: 'delete',
                iconPosition: 'left',
                iconName: 'utility:delete',
                variant: 'destructive'
            }
        },
        {
            type: "button",
            label: 'View',
            initialWidth: 100,
            typeAttributes: {
                label: 'View',
                name: 'View',
                title: 'View',
                disabled: false,
                value: 'view',
                iconPosition: 'left',
                iconName: 'utility:preview',
                variant: 'Brand'
            }
        },
    ];

    /*@wire(getUser, {})
    userData({
        error,
        data
    }) {
        if (data) {
            //if(data.Profile.Name === "Commercial") {
            this.isButtonDisabled = true;
            console.log('data.Profile.Name === ', data)
            // }
        } else if (error) {
            console.error(error.body.message);
        }
    }*/
    wiredProductsResult;
    @wire(getProducts, {
        oppId: '$recordId'
    })
    wiredProducts(result) {
        this.wiredProductsResult = result;
        if (result.data) {
            this.hasQuantityIssue = false;
            this.products = result.data.map(item => {
                const quantity = item.Quantity || 0;
                const quantityInStock = item.Quantity_In_Stock__c || 0;
                if (quantity > quantityInStock) {
                    this.hasQuantityIssue = true;
                }

                return {
                    ...item,
                    productName: item.Product2?.Name,
                    quantityInStock: quantityInStock,
                    Product2Id: item.Product2?.Id,
                    OpportunityLineItemId: item.Id,
                    quantityStyle: quantity > quantityInStock ?
                        'color: red; font-weight: bold;' :
                        'color: green; font-weight: bold;'
                };

            });

            this.error = this.products.length === 0 ?
                'Vous n\'avez pas de produit associées à l\'opportunité' :
                null;
        } else if (result.error) {
            console.error('Error fetching products:', result.error);
            this.error = 'Une erreur s\'est produite lors du chargement des produits.';
            this.products = undefined;
        }
    }

    get errorStyle() {
        return this.error && this.error.includes('Vous n\'avez aucune ligne de produits pour le moment.\n1. Veuillez tout d\'abord sélectionner un Catalogue (Pricebook) \n2. Sélectionnez ensuite les produits à ajouter.') ?
            'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info' : 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error'
    }

    callRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'View') {
            this.handleSeeProduct(row.OpportunityLineItemId);
        } else if (actionName === 'Delete') {
            this.handleDeleteProduct(row.Product2Id);
        }
    }

    handleSeeProduct(relatedProductId) {
        if (!relatedProductId) {
            console.log(relatedProductId)
            return;
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: relatedProductId,
                objectApiName: 'OpportunityLineItem',
                actionName: 'view',
            },
        });
    }

    handleDeleteProduct(relatedProductId) {
        if (!relatedProductId) {
            console.error('Product2Id is missing or undefined.');
            return;
        }
        deleteRecord(relatedProductId)
            .then(result => {
                console.log('Success delete')
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
                console.log('FAIL delete', error)
            });
    }
}