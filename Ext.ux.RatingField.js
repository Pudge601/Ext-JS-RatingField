/*!
 * Ext.ux.RatingField
 *
 * Copyright 2011, Dan Harabagiu
 * Licenced under the Apache License Version 2.0
 * See LICENSE
 * https://github.com/digitalwm/Ext-JS-RatingField
 *
 * Version : 0.1 - Initial coding
 * Version : 0.2
 *  - Added Field reset button
 *  - Added CSS class for reset button
 *  - Added reset function for the field
 *  - Minimum number of stars is 2
 *  - On creation default value is now 0, was null
 *  - Option to choose left / right for the reset button position
 *
 *  Modified for Ext JS 3.x by ChrisM
 *  https://github.com/chrisminett/Ext-JS-RatingField
 */
/*global Ext : false, */

Ext.define('Ext.ux.RatingField', {
    extend : 'Ext.form.Field',

    defaultAutoCreate : {tag: "div"},
    fieldClass : "x-ux-form-rating-field",

    /**
     * @cfg {String} scale
     * <p>(Optional) The size of the Button. Three values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>'small'<div class="sub-desc">Results in the button element being 16px high.</div></li>
     * <li>'medium'<div class="sub-desc">Results in the button element being 24px high.</div></li>
     * <li>'large'<div class="sub-desc">Results in the button element being 32px high.</div></li>
     * </ul>
     * <p>Defaults to <b><tt>'small'</tt></b>.</p>
     */
    scale: 'small',

    /**
     * @cfg {Number} numberOfStars Minimum 2, maximum 10
     */
    numberOfStars: 5,

    /**
     * @cfg {String,Boolean} resetButtonPosition 'left', 'right', or false to disable
     */
    resetButtonPosition: "right",

    /**
     * Initialisez the elements and renders them
     * @param {Ext.Component} The component itself
     * @param {Object} The options object
     * @return nothing
     * Private Function
     */
    onRender: function(ct, position) {
        Ext.ux.RatingField.superclass.onRender.call(this, ct, position);

        //We default to 2 stars
        if(this.numberOfStars < 2 || this.numberOfStars > 10) {
            this.numberOfStars = 2;
        }

        //We default to right
        if(this.resetButtonPosition && this.resetButtonPosition !== "right" && this.resetButtonPosition !== "left") {
            this.resetButtonPosition = "right";
        }

        if(this.resetButtonPosition === "left") {
            this.createCancelButton();
        }

        this.stars = [];
        for(var i = 1; i <= this.numberOfStars ; i++) {
            var starElement = document.createElement('div');
            starElement.setAttributeNode(this.createHtmlAttribute("key", i));
            var star = new Ext.Element(starElement);
            star.addClass([
                'rating-icon',
                'rating-icon-' + this.scale,
                'rating-star'
            ]);
            if (i <= this.value) {
                star.addClass('rating-selected');
            }
            this.el.appendChild(star);
            this.stars[i - 1] = star;
        }

        if(this.resetButtonPosition === "right") {
            this.createCancelButton();
        }

        var inputElement = document.createElement('input');
        inputElement.setAttributeNode(this.createHtmlAttribute("type", "hidden"));
        inputElement.setAttributeNode(this.createHtmlAttribute("name", this.getName()));
    },
    /**
     * Create and append the reset button for the field
     * @return nothing
     * Private function
     */
    createCancelButton : function() {
        var cancelButtonElement = document.createElement('div');
        this.cancelButton = new Ext.Element(cancelButtonElement);
        this.cancelButton.addClass([
            'rating-icon',
            'rating-icon-' + this.scale,
            'rating-reset'
        ]);
        this.el.appendChild(this.cancelButton);
    },
    /**
     * Initialise event listeners
     * @return nothing
     * Private function
     */
    initEvents: function() {
        Ext.ux.RatingField.superclass.initEvents.call(this);

        for(var i = 0 ; i < this.stars.length ; i++) {
            this.stars[i].on('mouseenter', this.showStars, this);
            this.stars[i].on('mouseleave', this.hideStars, this);
            this.stars[i].on('click', this.selectStars, this);
        }

        if (this.cancelButton) {
            this.cancelButton.on('click', this.reset, this);
        }
    },
    /**
     * Reset the stars and content of the field to 0
     * @return nothing
     */
    reset : function() {
        for(var i = 0 ; i < this.stars.length ; i++) {
            this.stars[i].removeClass('rating-selected');
        }
        this.setValue(0);
    },
    /**
     * Based on click event, mark the amount of stars selected
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     * @return nothing
     */
    selectStars : function(e, t) {
        var i = 0;
        var limitStar = t.getAttribute('key');

        this.setValue(limitStar);
        for(i = 0 ; i < this.stars.length; i++) {
            this.stars[i].removeClass('rating-selected');
        }

        for(i = 0 ; i < limitStar ; i++) {
            this.stars[i].addClass('rating-selected');
        }
    },
    /**
     * Based on hover, show the amount of stars that will be selected
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     * @return nothing
     */
    showStars: function(e, t) {
        var limitStar = t.getAttribute('key');
        for(var i = 0 ; i < this.stars.length ; i++) {
            this.stars[i].removeClass('rating-selected');
            if (i < limitStar) {
                this.stars[i].addClass('rating-hover');
            }
        }
    },
    /**
     * Based on hover out, hide the amount of stars showed
     * @return nothing
     */
    hideStars: function(e, t) {
        for(var i = 0 ; i < this.stars.length ; i++) {
            this.stars[i].removeClass('rating-hover');
            if (i < this.value) {
                this.stars[i].addClass('rating-selected');
            }
        }
    },
    /**
     * Private function, that ads a html attribute to a dom element
     * @param {string} name The name of the attribute
     * @param {string} value The value of the attribute
     * @return {HTMLAttribute}
     */
    createHtmlAttribute: function(name, value) {
        var attribute = document.createAttribute(name);
        attribute.nodeValue = value;
        return attribute;
    }
});