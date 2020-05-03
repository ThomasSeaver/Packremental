class ShippingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Shipping", 0.5, 0.07);
        this.ShippingText = this.drawText("Unshipped Packages: 0", 0.5, 0.12);
        this.ShippingCount = 0;

        this.manualEffects = 0;
        this.manualEffect = -1;
        this.shippedValue = 5.00;
        this.drawButton("Ship a Package", 0.5, 0.17).on('pointerdown', () => this.manualEffects += this.manualEffect);
    }

    preTick(delta, curStats) {
        var statChanges = {
            InventoryCount: 0,
            OrdersCount: 0,
            PackagesCount: 0,
            ShippingCount: 0,
            Money: 0
        }

        this.ShippingCount = curStats.ShippingCount + this.manualEffects;
        statChanges.ShippingCount = this.ShippingCount - curStats.ShippingCount;
        statChanges.Money = curStats.Money - Math.round(curStats.Money + this.manualEffects * this.shippedValue);

        this.manualEffects = 0;
        return statChanges;
    }

    postTick(delta, curStats) {
        this.ShippingCount = curStats.ShippingCount;
        this.ShippingText.setText("Unshipped Packages: " + this.ShippingCount);
    }

}