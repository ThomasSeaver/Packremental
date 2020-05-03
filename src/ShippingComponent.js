class ShippingComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Shipping", 0.5, 0.07);
        this.ShippingText = this.drawText("Unshipped Packages: 0", 0.5, 0.12);
        this.ShippingValueText = this.drawText("Revenue per Shipped Item: $5.00", 0.5, 0.17);
        this.ShippingRateText = this.drawText("Packages shipped per second: 0", 0.5, 0.22);
        this.ShippingRate = 0;
        this.ShippingCount = 0;
        this.entities = [new Entity(20.00, 1, 0, 0, 1000), new Entity(50.00, 3, 0, 0, 2000), new Entity(150.00, 12, 0, 0, 3000), new Entity(400.00, 40, 0, 0, 4000)];
        this.upgradePurchases = [0,0,0];
        this.ShippedValue = 5.00;

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.timerEffect = 0;
        this.drawButton("Ship a Package", 0.5, 0.27).on('pointerdown', () => this.manualEffects += this.manualEffect);
        
        // Automation Purchases
        this.drawText("Gas for Truck\nPrice: $20.00\nExtra 1 ship/sec", 0.05, 0.4, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.40).on('pointerdown', () => this.entities[0].queuedPurchases++);
        this.drawText("Personal Package Drop-off\nPrice: $50.00\nExtra 3 ship/sec", 0.05, 0.5, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.5).on('pointerdown', () => this.entities[1].queuedPurchases++);
        this.drawText("Rainforest Select\nPrice: $150.00\nExtra 12 ship/sec", 0.05, 0.6, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.6).on('pointerdown', () => this.entities[2].queuedPurchases++);
        this.drawText("Shipping Fleet\nPrice: $400.00\nExtra 40 ship/sec", 0.05, 0.7, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.7).on('pointerdown', () => this.entities[3].queuedPurchases++);

        // Upgrades
        this.drawText("Higher Profit\nPrice: $750.00", 0.05, 0.88, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.88).on('pointerdown', () => this.upgradePurchases[1]++);
        this.drawText("Double Automatic Power\nPrice: $2000.00", 0.05, 0.95, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.95).on('pointerdown', () => this.upgradePurchases[2]++);
    }

    preTick(delta, curStats) {
        this.potentialDelta = this.manualEffects;
        this.manualEffects = 0;
        this.entities.forEach(entity => {
            if (entity.time >= entity.frequency) {
                entity.time = 0;
                this.potentialDelta += entity.rate * entity.count;
            } else {
                entity.time += delta
            }
        });

        var actualDelta = Math.min(this.potentialDelta, curStats.ShippingCount);

        curStats.ShippingCount -= actualDelta;
        curStats.Money += actualDelta * this.ShippedValue;

        // Handle queued upgrades
        this.entities.forEach(entity => {
            while (entity.queuedPurchases > 0 && curStats.Money >= entity.price) {
                entity.queuedPurchases--;
                entity.increment();
                this.ShippingRate += entity.rate;
                this.ShippingRateText.setText("Packages shipped per second: " + this.ShippingRate); 
                curStats.Money -= entity.price;
            } 
        });

        // Handle upgrades (Poorly)
        while (this.upgradePurchases[0] > 0) {
            this.upgradePurchases[0]--;
            if (curStats.Money > 100.00) {
                curStats.Money -= 100.00;
            }
        }

        while (this.upgradePurchases[1] > 0) {
            this.upgradePurchases[1]--;
            if (curStats.Money > 750.00) {
                curStats.Money -= 750.00;
                this.ShippedValue = parseFloat((this.ShippedValue * 1.2).toFixed(2));
                this.ShippingValueText.setText("Revenue per Shipped Item: $" + this.ShippedValue); 
            }
        }

        while (this.upgradePurchases[2] > 0) {
            this.upgradePurchases[2]--;
            if (curStats.Money > 2000.00) {
                curStats.Money -= 2000.00;
                this.entities.forEach(entity => entity.rate *= 2);
                this.ShippingRate *= 2;
                this.ShippingRateText.setText("Packages shipped per second: " + this.ShippingRate); 
            }
        }

        return curStats;
    }

    postTick(curStats) {
        this.ShippingCount = curStats.ShippingCount;
        this.ShippingText.setText("Unshipped Packages: " + Math.round(this.ShippingCount));
    }

    recover (delta) {

    }

}