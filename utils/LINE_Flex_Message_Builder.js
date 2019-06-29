//#region Typedefs
//#endregion
var CFlexText = /** @class */ (function () {
    function CFlexText(data) {
        this.type = 'text';
        this.text = data.text;
        this.flex = data.flex;
    }
    CFlexText.prototype.setMaxLines = function (maxLines) {
        this.maxLines = maxLines;
        return this;
    };
    CFlexText.prototype.setMargin = function (margin) {
        this.margin = margin;
        return this;
    };
    CFlexText.prototype.setSize = function (size) {
        this.size = size;
        return this;
    };
    CFlexText.prototype.setAlignment = function (align) {
        this.align = align;
        return this;
    };
    CFlexText.prototype.wrapToggle = function (wrap) {
        this.wrap = wrap;
        return this;
    };
    CFlexText.prototype.setColor = function (color) {
        this.color = color;
        return this;
    };
    CFlexText.prototype.setWeight = function (weight) {
        this.weight = weight;
        return this;
    };
    CFlexText.prototype.setAction = function (action) {
        this.action = action;
        return this;
    };
    CFlexText.prototype.setGravity = function (gravity) {
        this.gravity = gravity;
        return this;
    };
    return CFlexText;
}());
var FlexBase = /** @class */ (function () {
    function FlexBase(altText, contents) {
        this.type = 'flex';
        this.altText = altText;
        this.contents = contents;
    }
    return FlexBase;
}());
var FlexBubble = /** @class */ (function () {
    function FlexBubble(header, hero, body, footer, styles) {
        this.type = 'bubble';
        this.header = header;
        this.hero = hero;
        this.body = body;
        this.footer = footer;
        this.styles = styles;
    }
    return FlexBubble;
}());
var FlexCarousel = /** @class */ (function () {
    function FlexCarousel(contents) {
        this.type = 'carousel';
        this.contents = [contents];
    }
    FlexCarousel.prototype.addCarouselItem = function (bubbleItem) {
        this.contents.push(bubbleItem);
        return this;
    };
    return FlexCarousel;
}());
var FlexBox = /** @class */ (function () {
    function FlexBox(layout, contents, flex, spacing, action) {
        this.layout = layout;
        this.contents = contents;
        this.flex = flex;
        this.spacing = spacing;
        this.action = action;
    }
    FlexBox.prototype.addContents = function (contents) {
        this.contents.push(contents);
        return this;
    };
    return FlexBox;
}());
var A_Text_Object = {
    text: 'aaaaaaaaaaa'
};
var A_FlexText = new CFlexText(A_Text_Object)
    .setColor('#222222')
    .setSize('sm')
    .setMargin('sm');
console.log(JSON.stringify(A_FlexText));
