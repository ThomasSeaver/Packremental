class TitleBarComponent extends Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        super(xStart, xEnd, yStart, yEnd, width, height, context)
    }

    create() {
        this.dateText = this.drawText("Date: Jan 1, 2000", 0.1, 0.5);
        this.date = new Date("2000-01-01 00:00:00.000");
        this.drawText("Packremental", 0.5, 0.5);
        this.moneyText = this.drawText("Money: $100.00", 0.9, 0.5);
        this.sinceLastUpdate = 0;
    }

    update(delta) {
        this.sinceLastUpdate += delta;
        if (this.sinceLastUpdate >= 5000) {
            this.sinceLastUpdate = 0;
            this.incrementDate(1);
        }
    }

    recover(delta) {
        this.incrementDate(delta / 5000);
    }

    incrementDate(days) {
        this.date.setDate(this.date.getDate() + days);
        this.dateText.setText("Date: " + DateFormat.format.date(this.date, "MMM d, yyyy"));
    }
}