define([
	
    'backbone',
    'mixins/data-options',

], function(Backbone, DataOptions) {
    var StaticGrid = Backbone.View.extend({
			
		options: {
			itemSelector: '.static-grid-item',
            itemMargin: 0,
            imageContainerSelector: '.static-grid-item .image',
			imageSelector: '.static-grid-item .image img',
            imageRate: 1,
            imageCol: 4,
            imagePosition: 'inner',
            
		},        
    
        initialize: function() {
            var self = this;

            this.parseOptions();
            
            this.$el.addClass('c'+this.options.imageCol);

            this.setItemsSize();

            $(window).resize(function() {
                self.setItemsSize();
                self.$el.find(self.options.imageSelector).each(function() {
                    self.setImageSize(this);
                });      
            });     
        },
        
        
        getImageSize: function(totalWidth) {
            var matrixWidth = []
            var items = this.$el.find(this.options.itemSelector);
            var itemWidth = 10000;
            var sum = 0;
            for (i = 0; i < this.options.imageCol; i++) {
                var width = $(items[i]).width();
                sum =  sum + width;
                width = width - this.options.itemMargin;
                if (width > 0) {
                    itemWidth = (width < itemWidth) ? width : itemWidth;
                }
            }    
            // IE & FF auto width for table-cell bug
            if (sum > totalWidth) {
                itemWidth = itemWidth - 1;
            }
            var itemHeight = parseInt(itemWidth / this.options.imageRate);
            return {itemWidth: itemWidth, itemHeight: itemHeight, totalWidth: totalWidth}
        },
        
        
        setItemsSize: function() {
            var self = this;
            var scrollDetect = $(window).height() - $(document).height();
 
            // Auto size
            this.$el.width('');
            this.$el.find(this.options.itemSelector).each(function() {
                $(this).width('');
            });
            
            // Width for wrapper with margin
            this.$el.css('marginLeft','-'+this.options.itemMargin+'px').width(this.$el.parent().width() + this.options.itemMargin);
            // Get item size
            itemSize = this.getImageSize(this.$el.width());        
            
            this.$el.find(this.options.itemSelector).each(function() {
                $(this).width(itemSize.itemWidth + self.options.itemMargin);
                
                var img = $(this).find('.image');
                
                $(img).height(itemSize.itemHeight); 
                
                var imageWidth = parseInt($(img).attr('data-width'));
                var imageHeight = parseInt($(img).attr('data-height'));
                var imageRate = imageWidth / imageHeight;
                
                $(img).data('imageRate', imageRate).addClass(self.options.imageRate >= 1 ? 'w' : 'h');
            });  

            this.$el.css('visibility','visible');
            
            if ($(window).height() - $(document).height() < 0 && scrollDetect == 0) {
                this.setItemsSize();
            }
        },
        
        setImageSize: function(img) {
            // Set image class
            var ci = $(img).parent().data('imageRate');
            var cw = $(img).parent().width() / $(img).parent().height();
            // Inner
            if (this.options.imagePosition == 'inner') {
                if (cw >= 1) {
                    var c = (ci <= cw) ? 'h' : 'w';
                } else {
                    var c = (cw <= ci) ? 'w' : 'h';
                }
            }
            // Outer
            else {
                if (cw >= 1) {
                    var c = (ci <= cw) ? 'w' : 'h';
                } else {
                    var c = (cw <= ci) ? 'h' : 'w';
                }            
            }
            $(img).removeClass('w h').addClass(c);
            // Set margin top for inner position
            if (this.options.imagePosition == 'inner') {
                var hi = $(img).height();
                var hw = $(img).parent().height();
                $(img).css('marginTop',parseInt((hw - hi) / 2) + 'px');
            }
            else {
                $(img).css({'marginTop':0,'marginLeft':0});
                
                var wi = $(img).width();
                var ww = $(img).parent().width();
                
                if (wi != ww) {
                    var align = $(img).attr('data-align');
                    switch (align) {
                        case 'left': align = 0; break;
                        case 'right': align = ww - wi; break;
                        default:
                            align = parseInt((ww - wi) / 2);
                    }
                    $(img).css('marginLeft',align + 'px');

                }
                var hi = $(img).height();
                var hw = $(img).parent().height();

                if (hi != hw) {
                    $(img).css('marginTop',parseInt((hw - hi) / 2) + 'px');  
                }                    
            }            
        },
        
        render: function() {
            return this;
        }
    });
    
    _.extend(StaticGrid.prototype, DataOptions);
    
    return StaticGrid;
});