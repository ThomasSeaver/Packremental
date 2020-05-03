class InventoryComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Inventory", 0.5, 0.07);
        this.InventoryText = this.drawText("Unbought Items in Inventory: 0", 0.5, 0.12);
        this.InventoryCostText = this.drawText("Price per Inventory Item: $2.00", 0.5, 0.17);
        this.InventoryCost = 2.00;
        this.InventoryRateText = this.drawText("Inventory bought per second: 0", 0.5, 0.22);
        this.InventoryRate = 0;
        this.InventoryCount = 0;
        this.entities = [new Entity(20.00, 1, 0, 0, 1000), new Entity(50.00, 3, 0, 0, 2000), new Entity(150.00, 12, 0, 0, 3000), new Entity(400.00, 40, 0, 0, 4000)];
        this.upgradePurchases = [0,0,0];
        this.InventoryCap = 40;

        this.manualEffect = 1;
        this.manualEffects = 0;
        this.drawButton("Purchase Inventory", 0.5, 0.27).on('pointerdown', () => this.manualEffects += this.manualEffect);

        // Automation Purchases
        this.drawText("Rainforest Subscription\nPrice: $20.00\nExtra 1 inv/sec", 0.05, 0.4, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.40).on('pointerdown', () => this.entities[0].queuedPurchases++);
        this.drawText("Contract with SeaBay\nPrice: $50.00\nExtra 3 inv/sec", 0.05, 0.5, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.5).on('pointerdown', () => this.entities[1].queuedPurchases++);
        this.drawText("Buy from Manufacturer\nPrice: $150.00\nExtra 12 inv/sec", 0.05, 0.6, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.6).on('pointerdown', () => this.entities[2].queuedPurchases++);
        this.drawText("Purchase a Factory\nPrice: $400.00\nExtra 40 inv/sec", 0.05, 0.7, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.7).on('pointerdown', () => this.entities[3].queuedPurchases++);

        // Upgrades
        this.drawText("Double the Inventory Cap\nPrice: $50.00", 0.05, 0.81, 0, 0.5);
        this.drawButton("Buy", 0.9, 0.81).on('pointerdown', () => this.upgradePurchases[0]++);
        this.drawText("Lower Buying Price\nPrice: $750.00", 0.05, 0.88, 0, 0.5);
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

        var actualDelta = Math.min(Math.min(this.potentialDelta, Math.floor(curStats.Money / this.InventoryCost)), this.InventoryCap - curStats.InventoryCount);

        curStats.InventoryCount += actualDelta;
        curStats.Money          -= actualDelta * this.InventoryCost;

        // Handle queued automation purchases
        this.entities.forEach(entity => {
            while (entity.queuedPurchases > 0 && curStats.Money >= entity.price) {
                entity.queuedPurchases--;
                entity.increment();
                this.InventoryRate += entity.rate;
                this.InventoryRateText.setText("Inventory bought per second: " + this.InventoryRate); 
                curStats.Money -= entity.price;
            } 
        });

        // Handle upgrades (Poorly)
        while (this.upgradePurchases[0] > 0) {
            this.upgradePurchases[0]--;
            if (curStats.Money > 50.00) {
                curStats.Money -= 50.00;
                this.InventoryCap *= 2;
            }
        }

        while (this.upgradePurchases[1] > 0) {
            this.upgradePurchases[1]--;
            if (curStats.Money > 750.00) {
                curStats.Money -= 750.00;
                this.InventoryCost = parseFloat((this.InventoryCost * 0.75).toFixed(2));;
                this.InventoryCostText.setText("Price per Inventory Item: $" + this.InventoryCost); 
            }
        }

        while (this.upgradePurchases[2] > 0) {
            this.upgradePurchases[2]--;
            if (curStats.Money > 2000.00) {
                curStats.Money -= 2000.00;
                this.entities.forEach(entity => entity.rate *= 2);
                this.InventoryRate *= 2;
                this.InventoryRateText.setText("Inventory bought per second: " + this.InventoryRate); 
            }
        }

        return curStats;
    }

    postTick(curStats) {
        this.InventoryCount = curStats.InventoryCount;
        this.InventoryText.setText("Unbought Items in Inventory: " + Math.round(this.InventoryCount));
    }

    recover(delta) {
        
    }
}