class InventoryComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.drawText("Inventory", 0.5, 0.07);
    }

    update(delta) {
    }

}