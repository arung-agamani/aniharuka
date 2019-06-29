//#region Typedefs

type TFlexBase = {
    type : string;
    altText : string;
    contents : TFlexContents;
}

type TContentType = 'bubble' | 'container';

type TFlexContents = {
    type : TContentType;
}

type TFlexBubble = {
    type : 'bubble';
    header?: TFlexBox;
    hero?: TFlexImage;
    body?: TFlexBox;
    footer?: TFlexBox;
    styles?: TFlexStyles;
}

type TFlexCarousel = {
    type : 'carousel';
    contents : [TFlexBubble];
}

type TFlexSpacing = 'none' | 'xs' | 'sm' | 'md' | 'xl' | 'xxl';
type TFlexBoxLayout = 'horizontal' | 'vertical' | 'baseline'

type TFlexBox = {
    type : 'box';
    layout : TFlexBoxLayout;
    contents : [object];
    flex?: number;
    spacing?: TFlexSpacing;
    action?: object
}

type TFlexImage = {
    type : 'image';
    url : string;
    flex?: number;
    margin?: TFlexSpacing;
    align?: 'start' | 'end' | 'center';
    gravity?: 'top' | 'bottom' | 'center';
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl' | 'full';
    aspectRatio?: string;
    aspectMode?: 'cover' | 'fit';
    backgroundColor?: string;
    action?: object;
}

type TFlexButton = {
    type : 'button';
    action : object;
    flex?: number;
    margin?: TFlexSpacing;
    height?: 'sm' | 'md';
    style?: 'link' | 'primary' | 'secondary';
    color?: string;
    gravity?: 'top' | 'bottom' | 'center';
}

type TFlexBlockStyle = {
    backgroundColor?: string;
    separator?: boolean;
    separatorColor?: string;
}

type TFlexStyles = {
    header?: TFlexBlockStyle;
    hero?: TFlexBlockStyle;
    body?: TFlexBlockStyle;
    footer?: TFlexBlockStyle;
}

type TFlexFiller = { type : 'filler' };

type TFlexIcon = {
    type : 'icon';
    url : string;
    margin?: TFlexSpacing;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl' | 'full';
    aspectRatio?: string;
}

type TFlexSeparator = {
    type : 'separator';
    margin?: TFlexSpacing;
    color?: string;
}

type TFlexSpacer = {
    type : 'spacer';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

type TFlexText = {
    type?: 'text';
    text : string;
    flex?: number;
    margin?: TFlexSpacing;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl';
    align?: 'start' | 'end' | 'center';
    gravity?: 'top' | 'bottom' | 'center';
    wrap?: boolean;
    maxLines?: number;
    weight?: 'regular' | 'bold';
    color?: string;
    action?: object;
}

type TFlexActionPostback = {
    type : 'postback';
    label?: string;
}

type TFlexTextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl';


//#endregion
class FlexText {
    private type : string;
    private text : string;
    private flex?: number;
    margin?: TFlexSpacing;
    size?: TFlexTextSize;
    align?: 'start' | 'end' | 'center';
    gravity?: 'top' | 'bottom' | 'center';
    wrap?: boolean;
    maxLines?: number;
    weight?: 'regular' | 'bold';
    color?: string;
    action?: object;

    constructor(data : TFlexText) {
        this.type = 'text';
        this.text = data.text;
        this.flex = data.flex;
    }

    public setMaxLines(maxLines : number) {
        this.maxLines = maxLines;
        return this;
    }

    public setMargin(margin : TFlexSpacing) {
        this.margin = margin;
        return this;
    }

    public setSize(size : TFlexTextSize) {
        this.size = size;
        return this;
    }

    public setAlignment(align) {
        this.align = align;
        return this;
    }

    public wrapToggle(wrap) {
        this.wrap = wrap;
        return this;
    }

    public setColor(color : string) {
        this.color = color;
        return this;
    }

    public setWeight(weight) {
        this.weight = weight;
        return this;
    }

    public setAction(action) {
        this.action = action;
        return this;
    }

    public setGravity(gravity) {
        this.gravity = gravity;
        return this;
    }
}

class FlexBase {
    type : string;
    altText : string;
    contents : TFlexContents;
    constructor(altText : string, contents : TFlexContents) {
        this.type = 'flex';
        this.altText = altText;
        this.contents = contents;
    }
}

class FlexBubble {
    type : string;
    header?: TFlexBox;
    hero?: TFlexImage;
    body?: TFlexBox;
    footer?: TFlexBox;
    styles?: TFlexStyles;
    constructor(header?: TFlexBox, hero?:TFlexImage, body?:TFlexBox, footer?:TFlexBox, styles?:TFlexStyles) {
        this.type = 'bubble';
        this.header = header;
        this.hero = hero;
        this.body = body;
        this.footer = footer;
        this.styles = styles;
    }
}

class FlexCarousel {
    type : 'carousel';
    contents : [TFlexBubble];
    constructor(contents : TFlexBubble) {
        this.type = 'carousel';
        this.contents = [contents];
    }
    public addCarouselItem(bubbleItem : TFlexBubble) {
        this.contents.push(bubbleItem);
        return this;
    }
}

class FlexBox {
    type : 'box';
    layout : TFlexBoxLayout;
    contents : [object];
    flex?: number;
    spacing?: TFlexSpacing;
    action?: object;
    constructor(layout : TFlexBoxLayout, contents : [object], flex?:number, spacing?: TFlexSpacing, action?:object) {
        this.layout = layout;
        this.contents = contents;
        this.flex = flex;
        this.spacing = spacing
        this.action = action;
    }
    public addContents(contents : object) {
        this.contents.push(contents);
        return this;
    }
}

class FlexIcon {
    type : 'icon';
    url : string;
    margin?: TFlexSpacing;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl' | 'full';
    aspectRatio?: string;
    constructor(iconUrl:string, margin?: TFlexSpacing, size?, aspectRatio?:string) {
        this.url = iconUrl;
        this.margin = margin;
        this.size = size;
        this.aspectRatio = aspectRatio;
    }
}

class FlexImage {
    type : 'image';
    url : string;
    flex?: number;
    margin?: TFlexSpacing;
    align?: 'start' | 'end' | 'center';
    gravity?: 'top' | 'bottom' | 'center';
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl' | 'full';
    aspectRatio?: string;
    aspectMode?: 'cover' | 'fit';
    backgroundColor?: string;
    action?: object;

    constructor(imgUrl : string, flex?: number, margin?: TFlexSpacing, align?, gravity?, size?, aspectRatio?, aspectMode?, bgCol?: string, action?: object) {
        this.type = 'image';
        this.url = imgUrl;
        this.flex = flex;
        this.margin = margin;
        this.align = align;
        this.gravity = gravity;
        this.size = size;
        this.aspectRatio = aspectRatio;
        this.aspectMode = aspectMode;
        this.backgroundColor = bgCol;
        this.action = action;
    }
}

class FlexButton  {
    constructor(){

    }
}

class FlexAnime_BoxRow {
    data : TFlexText;
    obj : object;
    constructor(textData){
        let title = new FlexText(textData);
        this.obj = title;
    }
}