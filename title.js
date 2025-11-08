var Title = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Title ()
    {
        Phaser.Scene.call(this, { key: 'title', active: false });
    },

    init: function (data)
    {
        
    },

    preload: function ()
    {
        

    },

    create: function ()
    {

        this.titlegen={};

        this.titlegen.buffer = this.textures.createCanvas('titlegencanvas', 128, 99);

        this.titlegen.buffer.drawFrame('title',0, 0, 0);

        var imageData = this.titlegen.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, 128, 99);

        this.titlegen.imagedata = imageData;

        this.titlegen.pixels = imageData.data;

        
        

        //title gen properties

        this.titlegen.inplay = true;
        this.titlegen.timestart = 0;
        this.titlegen.timecheck = 0;
        this.titlegen.switchtime = 2450;


        this.titlegen.t_width = 128;
        this.titlegen.t_height = 99;
        this.titlegen.color = 'blue';

        this.titlegen.lineindex = this.titlegen.t_height-1;
        this.titlegen.linespeed = 1.4;
        this.titlegen.colorswitchindex = 0;
        this.titlegen.resolution = 1.0;
        // spectrum range from pure to white
        this.titlegen.specrange = 200;


        this.titlegen.displayimg = this.add.image(160, 0,'titlegencanvas').setOrigin(.5,0);

        this.tweens.add({
            targets: this.titlegen,
            linespeed: -1.4,                    
            ease: 'Sine.easeInOut',
            duration: 8000,
            yoyo: false,
            repeat: -1
        });

        // this.tweens.add({
        //     targets: this.titlegen,
        //     linespeed: -3,                    
        //     ease: 'Sine.easeInOut',
        //     duration: 1000,
        //     yoyo: false,
        //     repeat: -1
        // });

        // this.tweens.add({
        //     targets: this.titlegen,
        //     resolution: 6,                    
        //     ease: 'Sine.easeInOut',
        //     duration: 3000,
        //     yoyo: true,
        //     repeat: -1
        // });


        this.titlegen.animate = function ()
        {



            this.lineindex+=this.linespeed;
            if (this.lineindex>this.t_height-1)  
            {
                this.lineindex = 0;
            }
            else if (this.lineindex<0)
            {
                this.lineindex = this.t_height-1;
            }
            



            var numbars = Math.floor(this.t_height/this.resolution)+1;
            var colorbitdelta = Math.floor(this.specrange/numbars);
            var currentcolorbit = 0;
            var redcurrentcolorbit = 0;
            var greencurrentcolorbit = 0;
            var bluecurrentcolorbit = 0;
            
            var colors = ['rainbow','normal','normal','normal','normal'];
            
                
            if (game.loop.now>this.timecheck+this.switchtime)  
            {
                    
                this.color = colors[Phaser.Math.Between(0,colors.length-1)];
                    


                this.timecheck=game.loop.now;
            }


            if (this.color!='normal') 
            {    
             

                var r,g,b;
                var cb_r,cb_g,cb_b;

                if (this.color=='red') { r=this.specrange; g=0; b=0; cb_r=1;cb_g=0;cb_b=0; }
                if (this.color=='green') { r=0; g=this.specrange; b=0; cb_r=0;cb_g=1;cb_b=0; }
                if (this.color=='blue') { r=0; g=0; b=this.specrange; cb_r=0;cb_g=0;cb_b=1; }
                if (this.color=='orange') { r=this.specrange; g=this.specrange; b=0; cb_r=1;cb_g=1;cb_b=0; }
                if (this.color=='cyan') { r=0; g=this.specrange; b=this.specrange; cb_r=0;cb_g=1;cb_b=1; }
                if (this.color=='violet') { r=this.specrange; g=0; b=this.specrange; cb_r=1;cb_g=0;cb_b=1; }
                if (this.color=='white') { r=this.specrange; g=this.specrange; b=this.specrange; cb_r=1;cb_g=1;cb_b=1; }
                if (this.color=='black') { r=0; g=0; b=0; cb_r=0;cb_g=0;cb_b=0; }





                var lineindex = Math.round(this.lineindex);
                var resolution = Math.round(this.resolution);
                //copy pixels
                for (var x=0; x<this.t_width; x++)
                {            


                    var blurp=false;
                    var blurpAdj=0;
                    if (Phaser.Math.Between(1,4)==1) {blurp=true}

                    currentcolorbit = 0;
                    for (var y=0; y<this.t_height; y++)
                    {
                        
                        
                        if ( (y % resolution) == 0)
                        {
                            var thisbar = (Math.floor(y/resolution));
                            currentcolorbit = colorbitdelta * thisbar;

                            if (!cb_r) redcurrentcolorbit = currentcolorbit;
                            if (!cb_g) greencurrentcolorbit = currentcolorbit;
                            if (!cb_b) bluecurrentcolorbit = currentcolorbit;

                            if (this.color=='rainbow') 
                            {
                                var spectrumNum = 6*thisbar/numbars;
                                var specNumbars = numbars/6;
                                var intspecnum = Math.round(spectrumNum);
                                cb_r=0;cb_g=0;cb_b=0;

                                if (spectrumNum>0 && spectrumNum<1) {r=0;g=0;b=255;greencurrentcolorbit=Math.round(numbars*colorbitdelta/6);}
                                if (spectrumNum>1 && spectrumNum<2) {r=0;g=255;b=255;bluecurrentcolorbit=-Math.round(numbars*colorbitdelta/6);}
                                if (spectrumNum>2 && spectrumNum<3) {r=0;g=255;b=0;redcurrentcolorbit=Math.round(numbars*colorbitdelta/6);}
                                if (spectrumNum>3 && spectrumNum<4) {r=255;g=255;b=0;greencurrentcolorbit=-Math.round(numbars*colorbitdelta/6);}
                                if (spectrumNum>4 && spectrumNum<5) {r=255;g=0;b=0;bluecurrentcolorbit=Math.round(numbars*colorbitdelta/6);}
                                if (spectrumNum>5 && spectrumNum<6) {r=255;g=0;b=255;redcurrentcolorbit=-Math.round(numbars*colorbitdelta/6);}

                                if (blurp) {blurpAdj+=1;}
                            }
                        }
                        

                        var calcline = y+lineindex;
                        if (calcline>=this.t_height) calcline-=this.t_height;

                        
                        var bytesPerPixel=4;
                        var targetIndex=(128*bytesPerPixel)*(calcline+blurpAdj)+(bytesPerPixel*x);

                        //check current pixel to see if its one to animate
                        var red = this.pixels[targetIndex];
                        //var green = this.pixels[targetIndex+1];
                        //var blue = this.pixels[targetIndex+2];

                        var alpha = this.pixels[targetIndex+3];

                              

                        if ( alpha!=0 )
                        {
                            if (this.color=='rainbow') {alpha=120} else {alpha=255}
                            //var greylev = ((40-this.lineindex)/this.t_height)*255;
                            this.pixels[targetIndex]=r+redcurrentcolorbit;
                            this.pixels[targetIndex+1]=g+greencurrentcolorbit;
                            this.pixels[targetIndex+2]=b+bluecurrentcolorbit;
                            this.pixels[targetIndex+3]=alpha;
                        }                
                    }            
                }        
                this.buffer.getContext('2d', {willReadFrequently:true}).putImageData(this.imagedata,0,0);
                this.buffer.refresh();       
            
            }
            else
            {
                this.buffer.drawFrame('title',0, 0, 0);
            }     
        }

    },

    update: function()
    {
        this.titlegen.animate();

    },
    showTitleTween: function()
    {
        this.showMenuTween = this.tweens.add({

            targets: this.titlegen.displayimg,
            y: 0,                    
            ease: 'Sine.easeOut',
            duration: 600,
            yoyo: false,
            repeat: 0,
            paused: false
            

            });

    },
    hideTitleTween: function()
    {
        var thisContext=this;
        this.hideMenuTween = this.tweens.add({

            targets: this.titlegen.displayimg,
            y: -200,
            //alpha: 0,
            ease: 'Sine.easeOut',
            duration: 600,
            yoyo: false,
            repeat: 0,
            paused: false
            
        

            });

    }



        

        

});        




















        