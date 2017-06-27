import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { CheckoutPage } from '../pages/checkout/checkout';
import { IPurchaseItem, IOrder, ITransactionDetails } from '../models/models';
import { Utils } from '../utils/utils';


@Injectable()
export class CheckoutStore {
    constructor(private utils: Utils) {}
    
    private _isOrderInProgress: boolean = false; 
    private _locationOid: number = null;
    private _locationCloseTime: Date = null;
    private  order: IOrder = { 
        purchaseItems: [], 
        transactionDetails: { 
            rewards: [],
            isRewardUsed: false,
            isRewardAllUsed: false,
            isRewardIndividualUsed: false,
            subtotal: null, 
            taxes: null, 
            total: null, 
            rewardsSavings: 0,
            isSocialMediaUsed: false,
            lkpSocialMediaTypeOid: null,
            socialMediaDiscountAmount: 0,
            isEdited: false,
            editAmount: 0,
            reasonsForEdit: null,
            oldPrice: null,
            newPrice: null
        }
    };

    /* order-ahead global properties */
    public get isOrderInProgress(): boolean {
        console.log("getting...", this._isOrderInProgress);
        return this._isOrderInProgress;
    }

    public setOrderInProgress(status: boolean): void {
        this._isOrderInProgress = status;
        console.log("setting...", this._isOrderInProgress);

    }

    public get getLocationOid(): number {
        return this._locationOid;
    }

    public setLocationOid(locationOid: number): void {

        this._locationOid = locationOid;

        console.log("current locationOid: ", locationOid);
    }

    public get getLocationCloseTime(): Date {
        return this._locationCloseTime;
    }

    public setLocationCloseTime(closeTime: Date) {
        this._locationCloseTime = closeTime
    }
    /* end order-ahead global properties */


    public getOrder(): IOrder {
        console.log('this.order: ', this.order);

        if (this.order && this.order.purchaseItems.length) {
            this.order.purchaseItems.forEach((x, index) => {
                x.discounts = 0;
            });
        }
        this.order.transactionDetails.rewards = [];
        this.order.transactionDetails.rewardsSavings = 0;

        return this.order;
    }

    public setOrder(order: IOrder): IOrder {
        this.order = Object.assign({}, order);

        console.log('this.order (setOrder): ', this.order);


        return this.order;
    }

    public editOrder(index: number, purchaseItem: IPurchaseItem): IOrder {
        this.order.purchaseItems[index] = purchaseItem;
        this.order.transactionDetails.subtotal = this.calculateSubtotal(this.order);
        console.log('this.order: (editOrder) ', this.order);

        return this.order;
    }

    public addToOrder(purchaseItem: IPurchaseItem, productDetails): IOrder {
        purchaseItem.addonsCost = this.calculateAddonsCost(purchaseItem, productDetails);
        purchaseItem.dairyCost = this.calculateDairyCost(purchaseItem, productDetails);
        this.order.purchaseItems = [...this.order.purchaseItems, Object.assign({}, purchaseItem)];
        this.order.transactionDetails.subtotal = this.calculateSubtotal(this.order);
        console.log('this.order: (addToOrder) ', this.order);

        return this.order;
    }
    
    public getPurchaseItemToEdit(index: number): IPurchaseItem {
        return this.order.purchaseItems[index];
    } 

    public deleteOrder(): IOrder {
       let order =  {
            purchaseItems: [], 
            transactionDetails: { 
                rewards: [],
                isRewardUsed: false,
                isRewardAllUsed: false,
                isRewardIndividualUsed: false,
                subtotal: null, 
                taxes: null, 
                total: null, 
                rewardsSavings: 0,
                isSocialMediaUsed: false,
                lkpSocialMediaTypeOid: null,
                socialMediaDiscountAmount: 0,
                isEdited: false,
                editAmount: 0,
                reasonsForEdit: [],
                oldPrice: null,
                newPrice: null
            }
        };
        return this.setOrder(order);
    }

    public setPurchaseItemsAndTransactionDetails(purchaseItems: Array<IPurchaseItem>, transactionDetails: ITransactionDetails): IOrder {
        this.order.purchaseItems = purchaseItems;
        this.order.transactionDetails = Object.assign({}, transactionDetails);

        return this.order;
    }


    public deletePurchaseItemAndReturnOrder(order: IOrder, purchaseItem: IPurchaseItem, indexToDelete: number, TAX_RATE: number): IOrder {        
        order.purchaseItems = order.purchaseItems.filter((x, index) => {
            return index !== indexToDelete; 
        });
        let subtotal = this.calculateSubtotal(this.order);
        return this.calculateTaxesSubtotalTotalAndReturnOrder(order, subtotal, TAX_RATE);
    }

    public clearOrderInProgress(): void {
        this.setOrderInProgress(false);
        this.deleteOrder();
    }

    public clearDiscountsAndRewardsAndReturnOrder(order: IOrder): IOrder {
        if (order && order.purchaseItems.length) {
            order.purchaseItems.forEach((x, index) => {
                x.discounts = 0;
            });
        }
        order.transactionDetails.rewards = [];
        order.transactionDetails.rewardsSavings = 0;

        return order;
    }

    clearDiscountsAndRewardsAndLeave(order: IOrder): void {

    }

    public clearOrder(): IOrder {
        this.setOrderInProgress(false);
        this.setLocationOid(null);
        this.setLocationCloseTime(null);

        return this.deleteOrder();
    }

    public calculateTaxes(subtotal: number, TAX_RATE: number): number {
        return this.utils.round(subtotal * TAX_RATE);
    }

    public calculateTotal(subtotal: number, taxes: number): number {
        return this.utils.round(subtotal + taxes);
    }

    public calculateSubtotal(order: IOrder): number {
      this.order.transactionDetails.subtotal = 0;
      order.purchaseItems.forEach((x, index) => {
          //let addonsCost = x.addonsCost !== null ? x.addonsCost : 0;
          order.transactionDetails.subtotal += (x.sizeAndOrPrice.price * x.quantity) + (x.addonsCost * x.quantity) + (x.dairyCost);
      });
      
      return this.utils.round(order.transactionDetails.subtotal);
    }


    public calculateTaxesSubtotalTotalAndReturnOrder(order: IOrder, subtotal: number, TAX_RATE: number): IOrder {
        order.transactionDetails.subtotal = this.utils.round(subtotal);
        order.transactionDetails.taxes = this.utils.round(this.calculateTaxes(order.transactionDetails.subtotal, TAX_RATE));
        order.transactionDetails.total = this.utils.round(this.calculateTotal(order.transactionDetails.subtotal, order.transactionDetails.taxes));

        return order;
    }

    public calculateDairyCost(purchaseItem: IPurchaseItem, productDetails): number {
        let dairyCost = 0;
        if (purchaseItem.dairy && purchaseItem.dairy.length) {
            purchaseItem.dairy.forEach((x) => {
                dairyCost += x.price;
            });
        }

        return dairyCost;
    }

    public calculateAddonsCost(purchaseItem: IPurchaseItem, productDetails): number {
        let addonsCost = 0;
        if (purchaseItem.addons && purchaseItem.addons.length) {
            if (productDetails.numberOfFreeAddonsUntilCharged !== null) {
                if (purchaseItem.addons.length > productDetails.numberOfFreeAddonsUntilCharged) {
                    let numberOfChargedAddons = purchaseItem.addons.length - productDetails.numberOfFreeAddonsUntilCharged;
                    addonsCost = numberOfChargedAddons * productDetails.addonsPriceAboveLimit;
                }
            }
        }
        return addonsCost;
    }

}