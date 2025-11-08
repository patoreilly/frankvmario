

function activate_flybugs(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('flybugs');
    //animation test sprite 4
        for (var j=0;j<quantity;j++)
        {

            a_zsprite = thisContext.add.image();
            a_zsprite.label = "flybugs";
            a_zsprite.type = 'target';
            a_zsprite.hitcount = 0;
            a_zsprite.explosioncolor= 'violet';


            a_zsprite.img = thisContext.textures.get('flybug_anim_52x34x3.png').getSourceImage();

            a_zsprite.animationData = thisContext.animationData['flybug_anim_52x34x3.png'];

            var randomKey = Math.random().toString();
                a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
                a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
                var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
                a_zsprite.pixels = imageData.data;

            a_zsprite.x = Phaser.Math.Between(x1, x2);
            a_zsprite.y = Phaser.Math.Between(y1, y2);
            a_zsprite.dx = Phaser.Math.RND.realInRange(-3.5, 3.5);
            a_zsprite.dy = Phaser.Math.RND.realInRange(-3.5, 3.5);
            a_zsprite.animated = true;
            a_zsprite.animationtimecheck=0;
            a_zsprite.frametimer = 50;
            a_zsprite.inplay = false;
            a_zsprite.numframes = 3;
            a_zsprite.framewidth = 52;
            a_zsprite.frameindex = 0;

            a_zsprite.elevation_delta = 100;//Phaser.Math.Between(-64,100);
            a_zsprite.base_elevation = 64;


            // .num_bullets enemy bullet sprite indexes will proceed the enemy sprite index shooting them
            // the index of the last bullet is marked, shotIndex will point at the first bullet
            a_zsprite.num_bullets = 8;

            a_zsprite.shotIndexMarker = thisContext.zspritesgroupArray.length + a_zsprite.num_bullets;
            a_zsprite.shotIndex = a_zsprite.shotIndexMarker - a_zsprite.num_bullets;

            a_zsprite.shot_timestart = 0;
            a_zsprite.shot_timecheck = 0;        
            a_zsprite.shot_frequency = Phaser.Math.Between(5000,6000);
            a_zsprite.shot_duration = Phaser.Math.Between(500,700);
            


            thisContext.tweens.add({
                targets: a_zsprite,
                elevation_delta: 0,
                ease: 'Sine.easeInOut',
                duration: 1500,
                yoyo: true,
                repeat: -1
            });

            a_zsprite.move = function()
            {
                this.x+=this.dx;
                if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

                this.y+=this.dy;
                if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

                // CHECK COLLISION AGAINST WALLS
                // compute cell position


                var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
                var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

                // compute position relative to cell (ie: how many pixel from edge of cell)
                var playerXCellOffset = this.x % thisContext.TILE_SIZE;
                var playerYCellOffset = this.y % thisContext.TILE_SIZE;

                var minDistanceToWall=20;
                
                // make sure the player don't bump into walls
                if (this.dx>0)
                {
                    // moving right
                    if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                        (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                    {
                        // reverse x dir
                        this.dx*=-1;
                    }               
                }
                else
                {
                    // moving left
                    if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                        (playerXCellOffset < (minDistanceToWall)))
                    {
                        /// reverse x dir
                        this.dx*=-1;
                    } 
                } 

                if (this.dy<0)
                {
                    // moving up
                    if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                        (playerYCellOffset < (minDistanceToWall)))
                    {
                        // reverse y dir
                        this.dy*=-1;
                    }
                }
                else
                {
                    // moving down                                  
                    if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                        (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                    {
                        // reverse y dir
                        this.dy*=-1;
                    }
                }





                ///enemy fire code
                if (game.loop.now > this.shot_timestart + this.shot_frequency)
                {
                    this.shot_timestart = game.loop.now;

                    this.shot_frequency = Phaser.Math.Between(3400,6000);
                    this.shot_duration = Phaser.Math.Between(500,700);
                }

                if (game.loop.now < this.shot_timestart + this.shot_duration)
                {
                    

                    if (game.loop.now > this.shot_timecheck + 100)
                    {
                        this.shot_timecheck = game.loop.now;

                        thisContext.zspritesgroupArray[this.shotIndex].x = Math.floor(this.x);//+Math.round(shotXDir*.25);//*thisContext.fPlayerSpeed )*adjustshotposition;
                        thisContext.zspritesgroupArray[this.shotIndex].y = Math.floor(this.y);//+Math.round(shotYDir*.25);//*adjustshotposition;

                        var distance = Phaser.Math.Distance.Between(thisContext.fPlayerX,thisContext.fPlayerY,this.x,this.y);
                        var xdelta = thisContext.fPlayerX-this.x;//Math.abs(
                        var ydelta = thisContext.fPlayerY-this.y;
                        var myrad = Math.asin(ydelta/distance);
                        var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;
                        
                        // var debugt = [];
                        //     debugt.push('xdelta: '+ xdelta );
                        //     debugt.push('ydelta: '+ ydelta );
                        //     debugt.push('myrad: '+ myrad );
                        //     debugt.push('myarc: '+ myarc );
                        //     debugt.push('distance: '+ distance );
                            
                        //     debug.setText(debugt);

                        /// to far for javascript? abort firing 
                        if (distance>1500) return;    
                        
                        if (xdelta>0)
                        {
                            var shotXDir=thisContext.fCosTable[myarc];//thisContext.fPlayerArc
                            var shotYDir=thisContext.fSinTable[myarc];
                        }
                        else
                        {
                            var shotXDir=-thisContext.fCosTable[myarc];//thisContext.fPlayerArc
                            var shotYDir=thisContext.fSinTable[myarc];
                        }
                        
                        
                        thisContext.zspritesgroupArray[this.shotIndex].dx=Math.round(shotXDir*32);//thisContext.fPlayerSpeed*8
                        thisContext.zspritesgroupArray[this.shotIndex].dy=Math.round(shotYDir*32);//8

                        //var current_ED = this.elevation_delta;
                        //var abs_ED = thisContext.fPlayerElevation - (this.base_elevation+current_ED);
                        thisContext.zspritesgroupArray[this.shotIndex].base_elevation = this.elevation_delta+this.base_elevation;
                         
                        thisContext.zspritesgroupArray[this.shotIndex].inplay = true;

                        thisContext.zspritesgroupArray[this.shotIndex].pp_delta = Math.floor((thisContext.fPlayerElevation -  thisContext.zspritesgroupArray[this.shotIndex].base_elevation )*(320/distance));

                        this.shotIndex++;
                        if (this.shotIndex==this.shotIndexMarker) this.shotIndex=this.shotIndexMarker-this.num_bullets;
                    }
                }
                
            };

            // this enemy bullets
        
            a_zsprite.bulletsprites = [];
            //this.bulletcolors = ['red','green','blue','orange','cyan','violet','white','black'];
            for (var i = 0; i < a_zsprite.num_bullets; i++)
            {
                a_zsprite.bulletsprites[i] = thisContext.add.image();
                a_zsprite.bulletsprites[i].img = thisContext.textures.get('purple_ball.png').getSourceImage();

                var randomKey = Math.random().toString();
                a_zsprite.bulletsprites[i].buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.bulletsprites[i].img.width, a_zsprite.bulletsprites[i].img.height);
                a_zsprite.bulletsprites[i].buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.bulletsprites[i].img, 0, 0);        
                var imageData = a_zsprite.bulletsprites[i].buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.bulletsprites[i].img.width, a_zsprite.bulletsprites[i].img.height);
                a_zsprite.bulletsprites[i].pixels = imageData.data;

                a_zsprite.bulletsprites[i].type = 'bullet';
                

                
                a_zsprite.bulletsprites[i].dx = 0;
                a_zsprite.bulletsprites[i].dy = 0;
                a_zsprite.bulletsprites[i].pp_delta = 0;
                a_zsprite.bulletsprites[i].distance = 0;

                

                a_zsprite.bulletsprites[i].elevation_delta = 0;
                a_zsprite.bulletsprites[i].base_elevation = 0;

                
                a_zsprite.bulletsprites[i].animated = false;
                //this.bulletsprites[i].flying = true;
                a_zsprite.bulletsprites[i].inplay = false;
                a_zsprite.bulletsprites[i].currentMapIndex = 0;
                a_zsprite.bulletsprites[i].shotIndexMarker = a_zsprite.shotIndexMarker;



                
                a_zsprite.bulletsprites[i].move = function() 
                {
                    // the cannon relative to the player center view
                    //var shooterOffset = -14;
                    //var vert_look_range = 40;
                    var ax= Math.floor(thisContext.zspritesgroupArray[this.shotIndexMarker].x);
                    var ay= Math.floor(thisContext.zspritesgroupArray[this.shotIndexMarker].y);
                    //console.log(ax);
                    //console.log(ay);
                    var distance = Phaser.Math.Distance.Between(this.x,this.y,ax,ay);
                    //var pp_delta = Math.floor(thisContext.PROJECTIONPLANEHEIGHT/2 - thisContext.fProjectionPlaneYCenter);
                    var abs_pp_delta = Math.abs(this.pp_delta);
                    var new_elev_delta = Math.floor(thisContext.fTanTable[abs_pp_delta]*distance);

                    if (this.pp_delta<0)
                    {
                        new_elev_delta *= -1;
                    }


                    //var adj_pp_delta = this.pp_delta/vert_look_range*shooterOffset;

                    this.elevation_delta = new_elev_delta; //shooterOffset+adj_pp_delta-new_elev_delta;
                    
                    this.x-=this.dx; 
                    this.y-=this.dy;
                    if (this.x<0 || this.x>thisContext.MAP_WIDTH*thisContext.TILE_SIZE || this.y<0 || this.y>thisContext.MAP_HEIGHT*thisContext.TILE_SIZE || distance>1500) 
                    {
                        this.inplay = false;
                        this.distance = 0;
                        this.elevation_delta = 0;                
                    }


                    // CHECK COLLISION AGAINST WALLS
                    // compute cell position


                    var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
                    var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

                    // compute position relative to cell (ie: how many pixel from edge of cell)
                    var playerXCellOffset = this.x % thisContext.TILE_SIZE;
                    var playerYCellOffset = this.y % thisContext.TILE_SIZE;

                    var minDistanceToWall=20;
                    
                    // bullet wall detect and remove
                    //
                    if (this.dx>0)
                    {
                        // moving right
                        if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                            (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                        {
                            // remove sprite
                            this.inplay = false;
                            this.distance = 0; 
                            this.elevation_delta = 0;
                        }               
                    }
                    else
                    {
                        // moving left
                        if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                            (playerXCellOffset < (minDistanceToWall)))
                        {
                            // remove sprite
                            this.inplay = false;
                            this.distance = 0; 
                            this.elevation_delta = 0;
                        } 
                    } 

                    if (this.dy<0)
                    {
                        // moving up
                        if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                            (playerYCellOffset < (minDistanceToWall)))
                        {
                            // remove sprite
                            this.inplay = false;
                            this.distance = 0; 
                            this.elevation_delta = 0;
                        }
                    }
                    else
                    {
                        // moving down                                  
                        if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                            (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                        {
                            // remove sprite
                            this.inplay = false;
                            this.distance = 0; 
                            this.elevation_delta = 0;
                        }
                    }
                }


                
                thisContext.enemybulletsprites.push(a_zsprite.bulletsprites[i]);
                thisContext.zspritesgroup.add(a_zsprite.bulletsprites[i]);
            }                        
            
            thisContext.zspritesgroup.add(a_zsprite);
        }
}



//////////   simple objects

function activate_plantedrocks(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('plantedrocks');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'plantedrocks';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'red';

        var f_index = Phaser.Math.Between(1,4);

        a_zsprite.img = thisContext.textures.get('rock'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['rock'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        a_zsprite.inplay = true;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-4;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // this.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-this.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_barerocks(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('barerocks');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'barerocks';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'red';

        var f_index = Phaser.Math.Between(5,8);

        a_zsprite.img = thisContext.textures.get('rock'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['rock'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // this.Context.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-this.Context.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        a_zsprite.waveData = Phaser.Math.SinCosTableGenerator(256, 3, 3, 32);

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_elegantflowers(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('elegantflowers');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'elegantflowers';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'red';

        var f_index = Phaser.Math.Between(1,3);

        a_zsprite.img = thisContext.textures.get('flower'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['flower'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_brightflowers(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('brightflowers');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'brightflowers';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'red';

        var f_index = Phaser.Math.Between(4,8);

        a_zsprite.img = thisContext.textures.get('flower'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['flower'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_gems(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('gems');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'gems';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(1,6);

        a_zsprite.img = thisContext.textures.get('gem'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['gem'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 16;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_shrooms(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('shrooms');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'shrooms';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(1,4);

        a_zsprite.img = thisContext.textures.get('shroom'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['shroom'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_plants(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('plants');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'plants';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(3,6);

        a_zsprite.img = thisContext.textures.get('plant'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['plant'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_ferns(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('ferns');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'ferns';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(1,8);

        a_zsprite.img = thisContext.textures.get('fern'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['fern'+f_index+'.png'];


        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-10;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_firtrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('firtrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'firtrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        

        a_zsprite.img = thisContext.textures.get('tree13.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree13.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-6;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_baretrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('baretrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'baretrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        

        a_zsprite.img = thisContext.textures.get('tree14.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree14.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-2;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_redtrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('redtrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'redtrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        

        a_zsprite.img = thisContext.textures.get('tree15.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree15.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-12;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_palmtrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('palmtrees');

    for (var i = 0; i < quantity; i++)
    {


        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'palmtrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        

        a_zsprite.img = thisContext.textures.get('tree16.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree16.png'];


        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-4;//

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_fancytrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('fancytrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'fancytrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(1,4);

        a_zsprite.img = thisContext.textures.get('tree'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-16;//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        a_zsprite.waveData = Phaser.Math.SinCosTableGenerator(256, 3, 3, 32);

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_classictrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('classictrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'classictrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(5,10);

        a_zsprite.img = thisContext.textures.get('tree'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree'+f_index+'.png'];


        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = false;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        a_zsprite.waveData = Phaser.Math.SinCosTableGenerator(256, 3, 3, 32);

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_oddtrees(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('oddtrees');

    for (var i = 0; i < quantity; i++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'oddtrees';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';

        var f_index = Phaser.Math.Between(11,16);

        a_zsprite.img = thisContext.textures.get('tree'+f_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['tree'+f_index+'.png'];

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = false;
        //a_zsprite.flying = false;
        a_zsprite.inplay = true;

        // where the object visually touches the ground based on 1/2 the height in pixels as standard
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2);//32;

        // starting 
        a_zsprite.elevation_delta = 0;//Phaser.Math.Between(-50,70);

        // thisContext.tweens.add({
        // targets: a_zsprite,
        // elevation_delta: 0,//32-thisContext.fPlayerElevation,//Phaser.Math.Between(-64,64),
        // ease: 'Sine.easeInOut',
        // duration: 1500,
        // yoyo: true,
        // repeat: -1
        // });
        a_zsprite.move = function()
        {
            //
        };

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);

        a_zsprite.imagedata = imageData;

        a_zsprite.pixels = imageData.data;

        thisContext.zspritesgroup.add(a_zsprite);
    }
}       



function activate_frogs(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('frogs');

    //animation test sprite 6
    for (var j=0;j<quantity;j++)
    {   
        // //  animated sprite set up for 2d display purpose 
        // //  must be loaded as .spritesheet with frame params and added as .sprite
        // var randomKey3 = Math.random().toString();

        // this.anims.create({
        //     key: randomKey3,
        //     frames: this.anims.generateFrameNumbers('atest5'),
        //     frameRate: 60,
        //     repeat: -1
        //     //yoyo: true
        // });

    
        // a_zsprite = this.add.sprite(0, 0, 'atest5').play(randomKey3).setOrigin(0).setScale(1);
        // //////////////////////////////

        // console.log(a_zsprite);



        a_zsprite = thisContext.add.image();


        a_zsprite.label = 'frogs';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'green';


        a_zsprite.img = thisContext.textures.get('frog_anim_26x24x23.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['frog_anim_26x24x23.png'];

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
        var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
        a_zsprite.pixels = imageData.data;

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.dx = Phaser.Math.RND.realInRange(-2.5, 3.5);
        a_zsprite.dy = Phaser.Math.RND.realInRange(-2.5, 3.5);
        a_zsprite.animated = true;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 0;
        a_zsprite.inplay = true;
        a_zsprite.numframes = 23;
        a_zsprite.framewidth = 26;
        a_zsprite.frameindex = 0;

        a_zsprite.elevation_delta = Phaser.Math.Between(-64,100);
        a_zsprite.base_elevation = 64;


        thisContext.tweens.add({
            targets: a_zsprite,
            elevation_delta: 0,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

        };                 
        
        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_octos(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('octos');
    //octo creature animation (type 1)
    for (var j=0;j<quantity;j++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'octos';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'cyan';

        a_zsprite.img = thisContext.textures.get('octo_anim_29x27x4.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['octo_anim_29x27x4.png'];

        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;



        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = true;
        //a_zsprite.flying = true;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 200;
        a_zsprite.inplay = false;
        a_zsprite.numframes = 4;
        a_zsprite.framewidth = 29;
        a_zsprite.frameindex = 0;
        a_zsprite.dx = Phaser.Math.RND.realInRange(2.5, 4.5);
        a_zsprite.dy = Phaser.Math.RND.realInRange(2.5, 4.5);

        a_zsprite.elevation_delta = Phaser.Math.Between(-64,64);
        a_zsprite.base_elevation = 64;//Phaser.Math.Between(0,64);

        thisContext.tweens.add({
            targets: a_zsprite,
            elevation_delta: 0,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        
        

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

            
        };

        thisContext.zspritesgroup.add(a_zsprite);
    }
}


function activate_cydrones(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('cydrones');

    //cydrone creature animation (type 1)
    for (var j=0;j<quantity;j++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'cydrones';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'cyan';

        a_zsprite.img = thisContext.textures.get('cydrone_anim_20x26x4.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['cydrone_anim_20x26x4.png'];

        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;



        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = true;
        //a_zsprite.flying = true;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 200;
        a_zsprite.inplay = false;
        a_zsprite.numframes = 4;
        a_zsprite.framewidth = 20;
        a_zsprite.frameindex = 0;
        a_zsprite.dx = Phaser.Math.RND.realInRange(2.5, 4.5);
        a_zsprite.dy = Phaser.Math.RND.realInRange(2.5, 4.5);

        a_zsprite.elevation_delta = Phaser.Math.Between(-64,64);
        a_zsprite.base_elevation = 64;//Phaser.Math.Between(0,64);

        thisContext.tweens.add({
            targets: a_zsprite,
            elevation_delta: 0,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        
        

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

                    
        };

        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_redwings(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('redwings');
    //animation test sprite - type 1
    for (var j=0;j<quantity;j++)
    {
        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'redwings';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'cyan';

        a_zsprite.img = thisContext.textures.get('redwing_anim_32x24x4.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['redwing_anim_32x24x4.png'];

        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;



        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.animated = true;
        //a_zsprite.flying = true;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 200;
        a_zsprite.inplay = false;
        a_zsprite.numframes = 4;
        a_zsprite.framewidth = 32;
        a_zsprite.frameindex = 0;
        a_zsprite.dx = Phaser.Math.RND.realInRange(2.5, 4.5);
        a_zsprite.dy = Phaser.Math.RND.realInRange(2.5, 4.5);

        a_zsprite.elevation_delta = Phaser.Math.Between(-64,64);
        a_zsprite.base_elevation = 64;//Phaser.Math.Between(0,64);

        thisContext.tweens.add({
            targets: a_zsprite,
            elevation_delta: 0,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        
        
        

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

                    
        };

        thisContext.zspritesgroup.add(a_zsprite);
    }
}        

function activate_pinkblobs(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('pinkblobs');

    //animation test sprite 2
    for (var j=0;j<quantity;j++)
    {

        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'pinkblobs';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'violet';


        a_zsprite.img = thisContext.textures.get('pinkblob_anim_28x32x12.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['pinkblob_anim_28x32x12.png'];

        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;

        a_zsprite.x = 300+(j*5);
        a_zsprite.y = 250+(j*5);
        a_zsprite.animated = true;
        //a_zsprite.flying = true;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 200;
        a_zsprite.inplay = false;
        a_zsprite.numframes = 12;
        a_zsprite.framewidth = 28;
        a_zsprite.frameindex = 0;

        a_zsprite.elevation_delta = 32;//Phaser.Math.Between(0,100);
        a_zsprite.base_elevation = 32;


        thisContext.tweens.add({
            targets: a_zsprite,
            elevation_delta: 96,
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: j*100,
            yoyo: true,
            repeat: -1
        });





        a_zsprite.followerdata = 0;

        var _path = new Phaser.Curves.Path(100, 100);

        _path.splineTo([ 160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        _path.closePath();

        // _path.splineTo([ 164, 446, 274, 542, 412, 457, 522, 541, 664, 464 ]);

        // _path.lineTo(700, 300);

        // _path.lineTo(600, 350);

        // _path.ellipseTo(200, 100, 100, 250, false, 0);

        // _path.cubicBezierTo(222, 119, 308, 107, 208, 368);

        // _path.ellipseTo(60, 60, 0, 360, true);

        a_zsprite.path = _path;

        thisContext.tweens.add({
            targets: a_zsprite,
            followerdata: 1,
            ease: 'none',
            duration: 14000,
            delay: j*120,
            yoyo: false,
            repeat: -1
        });

        a_zsprite.move = function()
        {
            this.x=this.path.getPoint(this.followerdata).x;
            this.y=this.path.getPoint(this.followerdata).y;
        };                        
        
        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_ufos(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('ufos');
    //animation test sprite 3
    for (var j=0;j<quantity;j++)
    {

        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'ufos';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'violet';


        a_zsprite.img = thisContext.textures.get('ufo_anim_29x26x40.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['ufo_anim_29x26x40.png'];

        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        // a_zsprite.xincr = Phaser.Math.RND.realInRange(4.5, 8.5);
        // a_zsprite.yincr = Phaser.Math.RND.realInRange(4.5, 8.5);
        a_zsprite.animated = true;
        //a_zsprite.flying = false;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 0;
        a_zsprite.inplay = true;
        a_zsprite.numframes = 40;
        a_zsprite.framewidth = 29;
        a_zsprite.frameindex = 0;

        a_zsprite.elevation_delta = 0;
        a_zsprite.base_elevation = 32;

        thisContext.tweens.timeline({

        targets: a_zsprite,
        ease: 'Expo.easeInOut',
        
        delay: Phaser.Math.Between(100, 500),
        loop: -1,

        tweens: [{
            
            x: Phaser.Math.Between(x1, x2),
            base_elevation: Phaser.Math.Between(0, 96),
            duration: 1000
        },
        {
            
            y: Phaser.Math.Between(y1, y2),
            base_elevation: Phaser.Math.Between(0, 96),
            duration: 1000
        },
        {
            
            x: a_zsprite.x,
            base_elevation: Phaser.Math.Between(0, 96),
            duration: 1000
        },
        {
            
            y: a_zsprite.y,
            base_elevation: Phaser.Math.Between(0, 96),
            duration: 1000
        }]

        });
        // thisContext.tweens.add({
        //     targets: a_zsprite,
        //     elevation_delta: Phaser.Math.Between(0, 64),
        //     // x: Phaser.Math.Between(100, 668),
        //     // y: Phaser.Math.Between(100, 1180),
        //     ease: 'Quad.easeInOut',
        //     duration: 1000,
        //     yoyo: true,
        //     repeat: -1
        // });

        a_zsprite.move = function()
        {
            // this.x+=this.dx;
            // if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            // this.y+=this.dy;
            // if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // // CHECK COLLISION AGAINST WALLS
            // // compute cell position


            // var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            // var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // // compute position relative to cell (ie: how many pixel from edge of cell)
            // var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            // var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            // var minDistanceToWall=20;
            
            // // make sure the player don't bump into walls
            // if (this.dx>0)
            // {
            //     // moving right
            //     if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
            //         (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
            //     {
            //         // reverse x dir
            //         this.dx*=-1;
            //     }               
            // }
            // else
            // {
            //     // moving left
            //     if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
            //         (playerXCellOffset < (minDistanceToWall)))
            //     {
            //         /// reverse x dir
            //         this.dx*=-1;
            //     } 
            // } 

            // if (this.dy<0)
            // {
            //     // moving up
            //     if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
            //         (playerYCellOffset < (minDistanceToWall)))
            //     {
            //         // reverse y dir
            //         this.dy*=-1;
            //     }
            // }
            // else
            // {
            //     // moving down                                  
            //     if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
            //         (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
            //     {
            //         // reverse y dir
            //         this.dy*=-1;
            //     }
            // }

        };                        
        
        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_neonorbs(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('neonorbs');
    //animation test sprite 5
    for (var j=0;j<quantity;j++)
    {

        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'neonorbs';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'violet';

        var b_index = Phaser.Math.Between(1,3);
        a_zsprite.img = thisContext.textures.get('ball'+b_index+'.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['ball'+b_index+'.png'];


        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.dx = Phaser.Math.RND.realInRange(3, 7);
        a_zsprite.dy = Phaser.Math.RND.realInRange(-3, -7);
        a_zsprite.animated = false;
        // a_zsprite.animationtimecheck=0;
        // a_zsprite.frametimer = 50;
        a_zsprite.inplay = false;
        // a_zsprite.numframes = 3;
        // a_zsprite.framewidth = 52;
        // a_zsprite.frameindex = 0;

        a_zsprite.elevation_delta = 0;
        a_zsprite.base_elevation = 0;


        thisContext.tweens.add({
            targets: a_zsprite,
            delay: Phaser.Math.Between(500,1500),
            elevation_delta: Phaser.Math.Between(50,120),
            ease: 'Sine.easeOut',
            duration: Phaser.Math.Between(400,600),
            yoyo: true,
            repeat: -1,
            
        });

        // thisContext.tweens.timeline({

        //     targets: a_zsprite,
        //     delay: Phaser.Math.Between(500,1500),
        //     ease: 'Sine.easeOut',
        //     duration: 500,
        //     yoyo: true,
        //     repeat: -1,
            
            
        //     tweens: [{
                
        //         elevation_delta: 100
                
        //         }]

        // });

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

        };                        
        
        thisContext.zspritesgroup.add(a_zsprite);
    }
}

function activate_blueorbs(thisContext,quantity,x1,x2,y1,y2)
{
    active_objectGangs.push('blueorbs');
    //animation test sprite 5
    for (var j=0;j<quantity;j++)
    {

        a_zsprite = thisContext.add.image();
        a_zsprite.label = 'blueorbs';
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'violet';

        
        a_zsprite.img = thisContext.textures.get('ball4.png').getSourceImage();

        a_zsprite.animationData = thisContext.animationData['ball4.png'];


        var randomKey = Math.random().toString();
            a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).drawImage(a_zsprite.img, 0, 0);        
            var imageData = a_zsprite.buffer.getContext('2d', {willReadFrequently:true}).getImageData(0, 0, a_zsprite.img.width, a_zsprite.img.height);
            a_zsprite.pixels = imageData.data;

        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.dx = Phaser.Math.RND.realInRange(3, 7);
        a_zsprite.dy = Phaser.Math.RND.realInRange(-3, -7);
        a_zsprite.animated = false;
        // a_zsprite.animationtimecheck=0;
        // a_zsprite.frametimer = 50;
        a_zsprite.inplay = false;
        // a_zsprite.numframes = 3;
        // a_zsprite.framewidth = 52;
        // a_zsprite.frameindex = 0;

        a_zsprite.elevation_delta = 0;
        a_zsprite.base_elevation = 0;


        thisContext.tweens.add({
            targets: a_zsprite,
            //delay: Phaser.Math.Between(500,1500),
            elevation_delta: 120,
            ease: 'Sine.easeOut',
            duration: 500,
            yoyo: true,
            repeat: -1,
            
        });

        // thisContext.tweens.timeline({

        //     targets: a_zsprite,
        //     delay: Phaser.Math.Between(500,1500),
        //     ease: 'Sine.easeOut',
        //     duration: 500,
        //     yoyo: true,
        //     repeat: -1,
            
            
        //     tweens: [{
                
        //         elevation_delta: 100
                
        //         }]

        // });

        a_zsprite.move = function()
        {
            this.x+=this.dx;
            if ( this.x<thisContext.TILE_SIZE || this.x>(thisContext.MAP_WIDTH-1)*thisContext.TILE_SIZE ) this.dx*=-1;

            this.y+=this.dy;
            if ( this.y<thisContext.TILE_SIZE || this.y>(thisContext.MAP_HEIGHT-1)*thisContext.TILE_SIZE ) this.dy*=-1;

            // CHECK COLLISION AGAINST WALLS
            // compute cell position


            var playerXCell = Math.floor(this.x/thisContext.TILE_SIZE);
            var playerYCell = Math.floor(this.y/thisContext.TILE_SIZE);

            // compute position relative to cell (ie: how many pixel from edge of cell)
            var playerXCellOffset = this.x % thisContext.TILE_SIZE;
            var playerYCellOffset = this.y % thisContext.TILE_SIZE;

            var minDistanceToWall=20;
            
            // make sure the player don't bump into walls
            if (this.dx>0)
            {
                // moving right
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell+1)!='-')&&
                    (playerXCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse x dir
                    this.dx*=-1;
                }               
            }
            else
            {
                // moving left
                if ((thisContext.wMap.charAt((playerYCell*thisContext.MAP_WIDTH)+playerXCell-1)!='-')&&
                    (playerXCellOffset < (minDistanceToWall)))
                {
                    /// reverse x dir
                    this.dx*=-1;
                } 
            } 

            if (this.dy<0)
            {
                // moving up
                if ((thisContext.wMap.charAt(((playerYCell-1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset < (minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }
            else
            {
                // moving down                                  
                if ((thisContext.wMap.charAt(((playerYCell+1)*thisContext.MAP_HEIGHT)+playerXCell)!='-')&&
                    (playerYCellOffset > (thisContext.TILE_SIZE-minDistanceToWall)))
                {
                    // reverse y dir
                    this.dy*=-1;
                }
            }

        };                        
        
        thisContext.zspritesgroup.add(a_zsprite);
    }
}






function activate_mariocarts(thisContext,quantity,x1,x2,y1,y2)
{
    //active_objectGangs.push('mariocarts');
        thisContext.mariocart = thisContext.add.image();

        
        thisContext.mariocart.sswidth = 32;
        thisContext.mariocart.ssheight = 32;
        thisContext.mariocart.framewidth = 32;
        thisContext.mariocart.numframes = 22;
        thisContext.mariocart.frameindex = 0;

        thisContext.mariocart.buffer = thisContext.textures.createCanvas('mariocartcanvas', thisContext.mariocart.sswidth, thisContext.mariocart.ssheight );
        thisContext.mariocart.context = thisContext.mariocart.buffer.getContext('2d', {willReadFrequently:true});              
        var imageData = thisContext.mariocart.context.getImageData(0, 0, thisContext.mariocart.sswidth, thisContext.mariocart.ssheight);
        thisContext.mariocart.pixels = imageData.data;

        thisContext.mariocart.frames=[];

        for (var i=1;i<23;i++)
        {
            thisContext.mariocart.frames[i-1] = {};

            var frameimg = thisContext.textures.get('mariocart'+i+'.png').getSourceImage();
            thisContext.mariocart.frames[i-1].buffer = thisContext.textures.createCanvas('mariocartframe'+i, thisContext.mariocart.sswidth, thisContext.mariocart.ssheight );

            thisContext.mariocart.frames[i-1].context = thisContext.mariocart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            thisContext.mariocart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, thisContext.mariocart.framewidth, thisContext.mariocart.ssheight );
        
            var imageData = thisContext.mariocart.frames[i-1].context.getImageData(0, 0, thisContext.mariocart.sswidth, thisContext.mariocart.ssheight);
            thisContext.mariocart.frames[i-1].pixels = imageData.data;       
        }
        

        thisContext.mariocart.label = "mariocarts";
        thisContext.mariocart.type = 'target';
        thisContext.mariocart.hitcount = 0;
        thisContext.mariocart.explosioncolor= 'orange';

        thisContext.mariocart.img = thisContext.textures.get('mariocartcanvas').getSourceImage();
        thisContext.mariocart.x = 400;
        thisContext.mariocart.y = 1060;
        thisContext.mariocart.arc = 0;
        thisContext.mariocart.animated = false;
        //a_zsprite.flying = false;
        thisContext.mariocart.animationtimecheck=0;
        thisContext.mariocart.frametimer = 50;
        thisContext.mariocart.frameindex = 0;

        thisContext.mariocart.inplay = true;
        
        thisContext.mariocart.elevation_delta = 0;
        thisContext.mariocart.base_elevation = Math.floor(thisContext.mariocart.img.height/2)-5;

        thisContext.mariocart.startX = 100;
        thisContext.mariocart.startY = 100;

        thisContext.mariocart.relative_arcdelta;

        thisContext.mariocart.followerdata = 0;
        thisContext.mariocart.followerdata2 = 0;
        thisContext.mariocart.path_duration = 60000;
        thisContext.mariocart.path_delay = 0;

        thisContext.mariocart.path = new Phaser.Curves.Path(thisContext.mariocart.startX, thisContext.mariocart.startY);

        //thisContext.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        //160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        thisContext.mariocart.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);
        thisContext.mariocart.path.closePath();

        thisContext.tweens.add({
            targets: thisContext.mariocart,
            followerdata: 1,
            ease: 'none',
            duration: thisContext.mariocart.path_duration,
            delay: thisContext.mariocart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        thisContext.tweens.add({
            targets: thisContext.mariocart,
            followerdata2: 1,
            ease: 'none',
            duration: thisContext.mariocart.path_duration,
            delay: thisContext.mariocart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });
        
        thisContext.mariocart.move = function()
        {
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(thisContext.mariocart);



        thisContext.ralphcart = thisContext.add.image();

        
        thisContext.ralphcart.sswidth = 32;
        thisContext.ralphcart.ssheight = 32;
        thisContext.ralphcart.framewidth = 32;
        thisContext.ralphcart.numframes = 22;
        thisContext.ralphcart.frameindex = 0;

        thisContext.ralphcart.buffer = thisContext.textures.createCanvas('ralphcartcanvas', thisContext.ralphcart.sswidth, thisContext.ralphcart.ssheight );
        thisContext.ralphcart.context = thisContext.ralphcart.buffer.getContext('2d', {willReadFrequently:true});              
        var imageData = thisContext.ralphcart.context.getImageData(0, 0, thisContext.ralphcart.sswidth, thisContext.ralphcart.ssheight);
        thisContext.ralphcart.pixels = imageData.data;

        thisContext.ralphcart.frames=[];

        for (var i=1;i<23;i++)
        {
            thisContext.ralphcart.frames[i-1] = {};

            var frameimg = thisContext.textures.get('ralphcart'+i+'.png').getSourceImage();
            thisContext.ralphcart.frames[i-1].buffer = thisContext.textures.createCanvas('ralphcartframe'+i, thisContext.ralphcart.sswidth, thisContext.ralphcart.ssheight );

            thisContext.ralphcart.frames[i-1].context = thisContext.ralphcart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            thisContext.ralphcart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, thisContext.ralphcart.framewidth, thisContext.ralphcart.ssheight );
        
            var imageData = thisContext.ralphcart.frames[i-1].context.getImageData(0, 0, thisContext.ralphcart.sswidth, thisContext.ralphcart.ssheight);
            thisContext.ralphcart.frames[i-1].pixels = imageData.data;       
        }
        

        thisContext.ralphcart.label = "mariocarts";
        thisContext.ralphcart.type = 'target';
        thisContext.ralphcart.hitcount = 0;
        thisContext.ralphcart.explosioncolor= 'orange';

        thisContext.ralphcart.img = thisContext.textures.get('ralphcartcanvas').getSourceImage();
        thisContext.ralphcart.x = 400;
        thisContext.ralphcart.y = 1060;
        thisContext.ralphcart.arc = 0;
        thisContext.ralphcart.animated = false;
        //a_zsprite.flying = false;
        thisContext.ralphcart.animationtimecheck=0;
        thisContext.ralphcart.frametimer = 50;
        thisContext.ralphcart.frameindex = 0;

        thisContext.ralphcart.inplay = true;
        
        thisContext.ralphcart.elevation_delta = 0;
        thisContext.ralphcart.base_elevation = Math.floor(thisContext.ralphcart.img.height/2)-5;

        thisContext.ralphcart.startX = 100;
        thisContext.ralphcart.startY = 100;

        thisContext.ralphcart.relative_arcdelta;

        thisContext.ralphcart.followerdata = 0;
        thisContext.ralphcart.followerdata2 = 0;
        thisContext.ralphcart.path_duration = 60000;
        thisContext.ralphcart.path_delay = 800;

        thisContext.ralphcart.path = new Phaser.Curves.Path(thisContext.ralphcart.startX, thisContext.ralphcart.startY);

        //thisContext.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        //160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        thisContext.ralphcart.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);
        thisContext.ralphcart.path.closePath();

        thisContext.tweens.add({
            targets: thisContext.ralphcart,
            followerdata: 1,
            ease: 'none',
            duration: thisContext.ralphcart.path_duration,
            delay: thisContext.ralphcart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        thisContext.tweens.add({
            targets: thisContext.ralphcart,
            followerdata2: 1,
            ease: 'none',
            duration: thisContext.ralphcart.path_duration,
            delay: thisContext.ralphcart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });
        
        thisContext.ralphcart.move = function()
        {
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(thisContext.ralphcart);
        

        thisContext.toadcart = thisContext.add.image();

        
        thisContext.toadcart.sswidth = 32;
        thisContext.toadcart.ssheight = 32;
        thisContext.toadcart.framewidth = 32;
        thisContext.toadcart.numframes = 22;
        thisContext.toadcart.frameindex = 0;

        thisContext.toadcart.buffer = thisContext.textures.createCanvas('toadcartcanvas', thisContext.toadcart.sswidth, thisContext.toadcart.ssheight );
        thisContext.toadcart.context = thisContext.toadcart.buffer.getContext('2d', {willReadFrequently:true});              
        var imageData = thisContext.toadcart.context.getImageData(0, 0, thisContext.toadcart.sswidth, thisContext.toadcart.ssheight);
        thisContext.toadcart.pixels = imageData.data;

        thisContext.toadcart.frames=[];

        for (var i=1;i<23;i++)
        {
            thisContext.toadcart.frames[i-1] = {};

            var frameimg = thisContext.textures.get('toadcart'+i+'.png').getSourceImage();
            thisContext.toadcart.frames[i-1].buffer = thisContext.textures.createCanvas('toadcartframe'+i, thisContext.toadcart.sswidth, thisContext.toadcart.ssheight );

            thisContext.toadcart.frames[i-1].context = thisContext.toadcart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            thisContext.toadcart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, thisContext.toadcart.framewidth, thisContext.toadcart.ssheight );
        
            var imageData = thisContext.toadcart.frames[i-1].context.getImageData(0, 0, thisContext.toadcart.sswidth, thisContext.toadcart.ssheight);
            thisContext.toadcart.frames[i-1].pixels = imageData.data;       
        }
        

        thisContext.toadcart.label = "mariocarts";
        thisContext.toadcart.type = 'target';
        thisContext.toadcart.hitcount = 0;
        thisContext.toadcart.explosioncolor= 'orange';

        thisContext.toadcart.img = thisContext.textures.get('toadcartcanvas').getSourceImage();
        thisContext.toadcart.x = 400;
        thisContext.toadcart.y = 1060;
        thisContext.toadcart.arc = 0;
        thisContext.toadcart.animated = false;
        //a_zsprite.flying = false;
        thisContext.toadcart.animationtimecheck=0;
        thisContext.toadcart.frametimer = 50;
        thisContext.toadcart.frameindex = 0;

        thisContext.toadcart.inplay = true;
        
        thisContext.toadcart.elevation_delta = 0;
        thisContext.toadcart.base_elevation = Math.floor(thisContext.toadcart.img.height/2)-5;

        thisContext.toadcart.startX = 100;
        thisContext.toadcart.startY = 100;

        thisContext.toadcart.relative_arcdelta;

        thisContext.toadcart.followerdata = 0;
        thisContext.toadcart.followerdata2 = 0;
        thisContext.toadcart.path_duration = 60000;
        thisContext.toadcart.path_delay = 1600;

        thisContext.toadcart.path = new Phaser.Curves.Path(thisContext.toadcart.startX, thisContext.toadcart.startY);

        //thisContext.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        //160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        thisContext.toadcart.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);
        thisContext.toadcart.path.closePath();

        thisContext.tweens.add({
            targets: thisContext.toadcart,
            followerdata: 1,
            ease: 'none',
            duration: thisContext.toadcart.path_duration,
            delay: thisContext.toadcart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        thisContext.tweens.add({
            targets: thisContext.toadcart,
            followerdata2: 1,
            ease: 'none',
            duration: thisContext.toadcart.path_duration,
            delay: thisContext.toadcart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });
        
        thisContext.toadcart.move = function()
        {
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(thisContext.toadcart);


        thisContext.pippincart = thisContext.add.image();

        
        thisContext.pippincart.sswidth = 32;
        thisContext.pippincart.ssheight = 32;
        thisContext.pippincart.framewidth = 32;
        thisContext.pippincart.numframes = 22;
        thisContext.pippincart.frameindex = 0;

        thisContext.pippincart.buffer = thisContext.textures.createCanvas('pippincartcanvas', thisContext.pippincart.sswidth, thisContext.pippincart.ssheight );
        thisContext.pippincart.context = thisContext.pippincart.buffer.getContext('2d', {willReadFrequently:true});              
        var imageData = thisContext.pippincart.context.getImageData(0, 0, thisContext.pippincart.sswidth, thisContext.pippincart.ssheight);
        thisContext.pippincart.pixels = imageData.data;

        thisContext.pippincart.frames=[];

        for (var i=1;i<23;i++)
        {
            thisContext.pippincart.frames[i-1] = {};

            var frameimg = thisContext.textures.get('pippincart'+i+'.png').getSourceImage();
            thisContext.pippincart.frames[i-1].buffer = thisContext.textures.createCanvas('pippincartframe'+i, thisContext.pippincart.sswidth, thisContext.pippincart.ssheight );

            thisContext.pippincart.frames[i-1].context = thisContext.pippincart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            thisContext.pippincart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, thisContext.pippincart.framewidth, thisContext.pippincart.ssheight );
        
            var imageData = thisContext.pippincart.frames[i-1].context.getImageData(0, 0, thisContext.pippincart.sswidth, thisContext.pippincart.ssheight);
            thisContext.pippincart.frames[i-1].pixels = imageData.data;       
        }
        

        thisContext.pippincart.label = "mariocarts";
        thisContext.pippincart.type = 'target';
        thisContext.pippincart.hitcount = 0;
        thisContext.pippincart.explosioncolor= 'orange';

        thisContext.pippincart.img = thisContext.textures.get('pippincartcanvas').getSourceImage();
        thisContext.pippincart.x = 400;
        thisContext.pippincart.y = 1060;
        thisContext.pippincart.arc = 0;
        thisContext.pippincart.animated = false;
        //a_zsprite.flying = false;
        thisContext.pippincart.animationtimecheck=0;
        thisContext.pippincart.frametimer = 50;
        thisContext.pippincart.frameindex = 0;

        thisContext.pippincart.inplay = true;
        
        thisContext.pippincart.elevation_delta = 0;
        thisContext.pippincart.base_elevation = Math.floor(thisContext.pippincart.img.height/2)-5;

        thisContext.pippincart.startX = 100;
        thisContext.pippincart.startY = 100;

        thisContext.pippincart.relative_arcdelta;

        thisContext.pippincart.followerdata = 0;
        thisContext.pippincart.followerdata2 = 0;
        thisContext.pippincart.path_duration = 60000;
        thisContext.pippincart.path_delay = 2400;

        thisContext.pippincart.path = new Phaser.Curves.Path(thisContext.pippincart.startX, thisContext.pippincart.startY);

        //thisContext.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        //160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        thisContext.pippincart.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);
        thisContext.pippincart.path.closePath();

        thisContext.tweens.add({
            targets: thisContext.pippincart,
            followerdata: 1,
            ease: 'none',
            duration: thisContext.pippincart.path_duration,
            delay: thisContext.pippincart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        thisContext.tweens.add({
            targets: thisContext.pippincart,
            followerdata2: 1,
            ease: 'none',
            duration: thisContext.pippincart.path_duration,
            delay: thisContext.pippincart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });
        
        thisContext.pippincart.move = function()
        {
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(thisContext.pippincart);

}



function activate_frankcart(thisContext,quantity,x1,x2,y1,y2)
{
    //active_objectGangs.push('mariocarts');


        thisContext.frankcart = thisContext.add.image();

        
        thisContext.frankcart.sswidth = 72;
        thisContext.frankcart.ssheight = 48;
        thisContext.frankcart.framewidth = 72;
        thisContext.frankcart.numframes = 22;
        thisContext.frankcart.frameindex = 0;

        thisContext.frankcart.buffer = thisContext.textures.createCanvas('frankcartcanvas', thisContext.frankcart.sswidth, thisContext.frankcart.ssheight );
        thisContext.frankcart.context = thisContext.frankcart.buffer.getContext('2d', {willReadFrequently:true});              
        var imageData = thisContext.frankcart.context.getImageData(0, 0, thisContext.frankcart.sswidth, thisContext.frankcart.ssheight);
        thisContext.frankcart.pixels = imageData.data;

        thisContext.frankcart.frames=[];

        for (var i=1;i<23;i++)
        {
            thisContext.frankcart.frames[i-1] = {};

            var frameimg = thisContext.textures.get('frankcart'+i+'.png').getSourceImage();
            thisContext.frankcart.frames[i-1].buffer = thisContext.textures.createCanvas('frankcartframe'+i, thisContext.frankcart.sswidth, thisContext.frankcart.ssheight );

            thisContext.frankcart.frames[i-1].context = thisContext.frankcart.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            thisContext.frankcart.frames[i-1].context.drawImage(frameimg, 0, 0,frameimg.width,frameimg.height, 0, 0, thisContext.frankcart.framewidth, thisContext.frankcart.ssheight );
        
            var imageData = thisContext.frankcart.frames[i-1].context.getImageData(0, 0, thisContext.frankcart.sswidth, thisContext.frankcart.ssheight);
            thisContext.frankcart.frames[i-1].pixels = imageData.data;       
        }
        

        thisContext.frankcart.label = "mariocarts";
        thisContext.frankcart.type = 'target';
        thisContext.frankcart.hitcount = 0;
        thisContext.frankcart.explosioncolor= 'orange';

        thisContext.frankcart.img = thisContext.textures.get('frankcartcanvas').getSourceImage();
        thisContext.frankcart.x = 400;
        thisContext.frankcart.y = 1060;
        thisContext.frankcart.arc = 0;
        thisContext.frankcart.animated = false;
        //a_zsprite.flying = false;
        thisContext.frankcart.animationtimecheck=0;
        thisContext.frankcart.frametimer = 50;
        thisContext.frankcart.frameindex = 0;

        thisContext.frankcart.inplay = true;
        
        thisContext.frankcart.elevation_delta = 0;
        thisContext.frankcart.base_elevation = Math.floor(thisContext.frankcart.img.height/2)-15;

        thisContext.frankcart.startX = 100;
        thisContext.frankcart.startY = 100;

        thisContext.frankcart.relative_arcdelta;

        thisContext.frankcart.followerdata = 0;
        thisContext.frankcart.followerdata2 = 0;
        thisContext.frankcart.path_duration = 60000;
        thisContext.frankcart.path_delay = 3200;

        thisContext.frankcart.path = new Phaser.Curves.Path(thisContext.frankcart.startX, thisContext.frankcart.startY);

        //thisContext.demoBot.path.ellipseTo(1200,1200,360,0,true,180);
        //160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        thisContext.frankcart.path.splineTo([ 308,123,640,150,880,470,1440,256,1760,576,2240,470,2480,896,2400,1428,1760,1215,1520,1428,
            1680,1855,2160,1748,2320,2174,1920,2480,1280,2390,1120,1960,1152,1450,800,1322,
            604,1615,736,2051,560,2388,240,2494,80,2175,220,1818,200,1450,412,1215,400,895,180,656,84,341 ]);
        thisContext.frankcart.path.closePath();

        thisContext.tweens.add({
            targets: thisContext.frankcart,
            followerdata: 1,
            ease: 'none',
            duration: thisContext.frankcart.path_duration,
            delay: thisContext.frankcart.path_delay,
            yoyo: 0,
            repeat: -1
        });

        thisContext.tweens.add({
            targets: thisContext.frankcart,
            followerdata2: 1,
            ease: 'none',
            duration: thisContext.frankcart.path_duration,
            delay: thisContext.frankcart.path_delay+1,
            yoyo: 0,
            repeat: -1
        });
        
        thisContext.frankcart.move = function()
        {
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(thisContext.frankcart);


}



function activate_runners(thisContext,quantity,x1,x2,y1,y2)
{
    //active_objectGangs.push('runners');

    for (var j=0;j<quantity;j++)
    {

        a_zsprite = thisContext.add.image();

        a_zsprite.sswidth = 320;
        a_zsprite.ssheight = 32;

        a_zsprite.num_position_frames = 8;

        a_zsprite.srcimg = thisContext.textures.get('run_anim_'+1+'.png').getSourceImage();

        var srcwidth = a_zsprite.srcimg.width;
        var srcheight = a_zsprite.srcimg.height;

        var randomKey = Math.random().toString();
        a_zsprite.buffer = thisContext.textures.createCanvas(randomKey, a_zsprite.sswidth, a_zsprite.ssheight );

        a_zsprite.context = a_zsprite.buffer.getContext('2d', {willReadFrequently:true});   

        a_zsprite.context.drawImage(a_zsprite.srcimg, 0, 0,srcwidth,srcheight, 0, 0, a_zsprite.sswidth, a_zsprite.ssheight );

        var imageData = a_zsprite.context.getImageData(0, 0, a_zsprite.sswidth, a_zsprite.ssheight);
        a_zsprite.pixels = imageData.data;

        a_zsprite.frames=[];

        for (var i=1;i<9;i++)
        {
            a_zsprite.frames[i-1] = {};

            var frameimg = thisContext.textures.get('run_anim_'+i+'.png').getSourceImage();
            a_zsprite.frames[i-1].buffer = thisContext.textures.createCanvas(randomKey+i, a_zsprite.sswidth, a_zsprite.ssheight );

            a_zsprite.frames[i-1].context = a_zsprite.frames[i-1].buffer.getContext('2d', {willReadFrequently:true});      
            a_zsprite.frames[i-1].context.drawImage(frameimg, 0, 0,srcwidth,srcheight, 0, 0, a_zsprite.sswidth, a_zsprite.ssheight );

            var imageData = a_zsprite.frames[i-1].context.getImageData(0, 0, a_zsprite.sswidth, a_zsprite.ssheight);
            a_zsprite.frames[i-1].pixels = imageData.data;        
        }


        a_zsprite.label = "runner";
        a_zsprite.type = 'target';
        a_zsprite.hitcount = 0;
        a_zsprite.explosioncolor= 'orange';

        a_zsprite.img = thisContext.textures.get(randomKey).getSourceImage();
        a_zsprite.x = Phaser.Math.Between(x1,x2);
        a_zsprite.y = Phaser.Math.Between(y1,y2);
        a_zsprite.arc = 0;
        a_zsprite.animated = true;
        //a_zsprite.flying = false;
        a_zsprite.animationtimecheck=0;
        a_zsprite.frametimer = 65;
        a_zsprite.frameindex = 0;
        a_zsprite.framewidth = 32;
        a_zsprite.numframes = 10;


        a_zsprite.inplay = true;

        a_zsprite.elevation_delta = 0;
        a_zsprite.base_elevation = Math.floor(a_zsprite.img.height/2)-5;

        //a_zsprite.startX = 1000;
        //a_zsprite.startY = 1000;

        a_zsprite.followerdata = 0;
        a_zsprite.followerdata2 = 0;
        a_zsprite.path_duration = 28000;
        a_zsprite.path_delay = 0

        // a_zsprite.path = new Phaser.Curves.Path(a_zsprite.startX, a_zsprite.startY);

        // a_zsprite.path.splineTo([ 160,136,440,280,640,56,870,194,1240,56,1160,536,1200,736,840,896,800,536,480,816,80,776,400,496,100,250 ]);
        // a_zsprite.path.closePath();

        a_zsprite.path = new Phaser.Curves.Path(a_zsprite.x, a_zsprite.y);
        a_zsprite.path.quadraticBezierTo(Phaser.Math.Between(x1,x2), Phaser.Math.Between(y1,y2), a_zsprite.x+ Phaser.Math.Between(-100,+100)*5, a_zsprite.y+ Phaser.Math.Between(-100,100)*5);


        thisContext.tweens.add({
            targets: a_zsprite,
            followerdata: 1,
            ease: 'none',
            duration: a_zsprite.path_duration,
            delay: a_zsprite.path_delay,
            yoyo: 0,
            repeat: -1,
            onRepeat: function (tw,zs) { 

                    // console.log(tw);
                    // console.log(zs);
                    zs.followerdata=0;
                    zs.followerdata2=0;
                    zs.path = new Phaser.Curves.Path(zs.x, zs.y); 
                    zs.path.quadraticBezierTo(Phaser.Math.Between(x1,x2), Phaser.Math.Between(y1,y2), zs.x+ Phaser.Math.Between(-100,+100)*5, zs.y+ Phaser.Math.Between(-100,100)*5);
                    //zs.path.lineTo( Phaser.Math.Between(0,1280), Phaser.Math.Between(0,1280) ); 
                }
        });

        thisContext.tweens.add({
            targets: a_zsprite,
            followerdata2: 1,
            ease: 'none',
            duration: a_zsprite.path_duration,
            delay: a_zsprite.path_delay+1,
            yoyo: 0,
            repeat: -1
        });

        a_zsprite.jumptween = thisContext.tweens.add({
                targets: a_zsprite,
                elevation_delta: 80,
                ease: 'Quad.easeOut',
                duration: 450,
                yoyo: true,
                repeat: 0,
                paused:true
            });

        a_zsprite.jump = function()
        { 
            if ( !this.jumptween.isPlaying() )
            this.jumptween.play();
        }

        a_zsprite.move = function()
        {            
            this.x = this.path.getPoint(this.followerdata2).x; 
            this.y = this.path.getPoint(this.followerdata2).y;

            var trackingX = this.path.getPoint(this.followerdata).x;           
            var trackingY = this.path.getPoint(this.followerdata).y;
            
            var distance = Phaser.Math.Distance.Between(this.x,this.y,trackingX,trackingY);
            var xdelta = this.x-trackingX;
            var ydelta = this.y-trackingY;
            var myrad = Math.asin(ydelta/distance);
            var myarc = Math.round(thisContext.radToArc(myrad))+thisContext.ANGLE180;

            if (xdelta>0)
            {
                var myadjarc = myarc;
            }
            else if (ydelta>0)
            {
                var myadjarc = (1440-myarc)+1440;
            }    
            else 
            {
                var myadjarc = (960-myarc);
            }

            myadjarc -= thisContext.fPlayerArc;

            if (myadjarc<0) myadjarc+=1920;
            if (myadjarc>1920) myadjarc-=1920;
            
            this.arc = myadjarc;

            var myarcframeindex = Math.floor((myadjarc*this.numframes)/1920);

            if (this.frames[myarcframeindex] !=undefined)
            {
                this.pixels = this.frames[myarcframeindex].pixels;
            }
        }

        thisContext.zspritesgroup.add(a_zsprite);

    }
}