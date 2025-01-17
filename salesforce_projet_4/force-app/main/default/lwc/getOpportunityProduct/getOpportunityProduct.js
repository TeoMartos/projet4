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
import {
    refreshApex
} from '@salesforce/apex';
import Id from '@salesforce/user/Id';

import Opp_ProductName from "@salesforce/label/c.Opp_ProductName";
import Opp_Quantity from "@salesforce/label/c.Opp_Quantity";
import Opp_UnitPrice from "@salesforce/label/c.Opp_UnitPrice";
import Opp_TotalPrice from "@salesforce/label/c.Opp_TotalPrice";
import Opp_QuantityInStock from "@salesforce/label/c.Opp_QuantityInStock";
import Opp_Delete from "@salesforce/label/c.Opp_Delete";
import Opp_SeeProduct from "@salesforce/label/c.Opp_SeeProduct";
import Opp_QuantitySupQuantityInStock from "@salesforce/label/c.Opp_QuantitySupQuantityInStock";
import Opp_NoProductLines from "@salesforce/label/c.Opp_NoProductLines";
import Opp_OpportunityProducts from "@salesforce/label/c.Opp_OpportunityProducts";

import getProducts from '@salesforce/apex/ProductController.getProducts';
import getUser from '@salesforce/apex/UserController.getUser';

export default class GetOpportunityProduct extends NavigationMixin(LightningElement) {
    @api recordId;
    @track products;
    @track error;
    @track isButtonDisabled = false;
    @track hasQuantityIssue = false;
    @track hasProduct = false;
    @track isCommercial = false;
    @track columns = [{
            label: Opp_ProductName,
            fieldName: 'productName',
            type: 'text'
        },
        {
            label: Opp_Quantity,
            fieldName: 'Quantity',
            type: 'number',
            cellAttributes: {
                style: {
                    fieldName: 'quantityStyle'
                }
            }
        },
        {
            label: Opp_UnitPrice,
            fieldName: 'UnitPrice',
            type: 'currency'
        },
        {
            label: Opp_TotalPrice,
            fieldName: 'TotalPrice',
            type: 'currency'
        },
        {
            label: Opp_QuantityInStock,
            fieldName: 'quantityInStock',
            type: 'number'
        },
        {
            label: Opp_Delete,
            type: 'button-icon',
            initialWidth: 50,
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'Delete',
                title: Opp_Delete,
                alternativeText: Opp_Delete,
                variant: 'bare',
                class: 'slds-p-around_xxx-small custom-border'
            },
            cellAttributes: {
                class: 'slds-border_bottom'
            }
        }
    ];
    userId = Id;

    labels = {
        Opp_QuantitySupQuantityInStock,
        Opp_NoProductLines,
        Opp_OpportunityProducts
    };

    setColumns() {
        if (!this.isCommercial) {
            console.log(typeof this.columns)
            this.columns = [...this.columns,
                {
                    label: Opp_SeeProduct,
                    type: 'button',
                    initialWidth: 120,
                    typeAttributes: {
                        label: Opp_SeeProduct,
                        name: 'View',
                        title: Opp_SeeProduct,
                        iconName: 'utility:preview',
                        iconPosition: 'left',
                        variant: 'brand',
                        class: 'slds-p-around_xx-small custom-border',
                    }
                }
            ]
        }
    }

    @wire(getUser, {
        userId: '$userId'
    })
    userData({
        error,
        data
    }) {
        if (data && data.length > 0) {
            const profileName = data[0]?.Profile.Name;
            this.isCommercial = profileName === 'Commercial';
            this.setColumns();
        } else if (error) {
            console.error('Erreur lors de la récupération du profil utilisateur:', error);
        }
    }

    wiredProductsResult;
    @wire(getProducts, {
        oppId: '$recordId'
    })
    wiredProducts(result) {
        this.wiredProductsResult = result;
        if (result.data) {
            this.hasQuantityIssue = false;
            this.hasProduct = result.data.length > 0;
            this.products = result.data.map(item => {
                const quantity = item.Quantity || 0;
                const quantityInStock = item.Product2?.QuantityInStock__c || 0;
                if (quantity > quantityInStock) {
                    this.hasQuantityIssue = true;
                }
                return {
                    ...item,
                    productName: item.Product2?.Name,
                    quantityInStock: item.Product2?.QuantityInStock__c || 0,
                    Product2Id: item.Product2?.Id,
                    quantityStyle: quantity > quantityInStock ?
                        'color: red; font-weight: bold;' : 'color: green; font-weight: bold;',
                    disableViewButton: this.isCommercial
                };
            });
            this.error = null
        } else if (result.error) {
            console.error('Error fetching products:', result.error);
            this.error = 'Une erreur s\'est produite lors du chargement des produits.';
            this.products = undefined;
            this.hasProduct = false;
        }
    }

    get errorStyle() {
        return this.error && this.error.includes('Vous n\'avez aucune ligne de produits pour le moment.\n1. Veuillez tout d\'abord sélectionner un Catalogue (Pricebook) \n2. Sélectionnez ensuite les produits à ajouter.') ?
            'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_info' : 'slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_error'
    }

    callRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'View' && !this.isCommercial) {
            this.handleSeeProduct(row.Product2Id);
        } else if (actionName === 'Delete') {
            this.handleDeleteProduct(row.Id);
        }
    }

    handleSeeProduct(relatedProductId) {
        if (!relatedProductId) {
            return;
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: relatedProductId,
                objectApiName: 'Product2',
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
                return refreshApex(this.wiredProductsResult);
            }).catch(error => {
                this.error = error;
            });
    }
}