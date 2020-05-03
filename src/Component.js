class Component {

    constructor(xStart, xEnd, yStart, yEnd, width, height, context) {
        this.xStart = Math.round(xStart * width);
        this.xEnd = Math.round(xEnd * width);
        this.yStart = Math.round(yStart * height);
        this.yEnd = Math.round(yEnd * height);
        this.context = context;
    }

    drawText(text, xPercent, yPercent) {
        var xPos = Math.round(this.xStart + (xPercent * (this.xEnd - this.xStart)));
        var yPos = Math.round(this.yStart + (yPercent * (this.yEnd - this.yStart)));
        return this.context.add.text(xPos, yPos, text).setOrigin(0.5, 0.5);
    }

    drawButton(text, xPercent, yPercent, method) {
        var button = this.drawText(text, xPercent, yPercent);
        button.setInteractive();
        return button;
    }

}