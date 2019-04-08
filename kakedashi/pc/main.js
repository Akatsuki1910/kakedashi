var bai=1;
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2*bai;
var y = height/2*bai;

var stage_game = new PIXI.Container();
var renderer_game = PIXI.autoDetectRenderer(width*bai, height*bai,{
    resolution: 1,
    antialias: true,
    transparent: true,
});
document.getElementById("pixiview").appendChild(renderer_game.view);
stage_game.scale.x=stage_game.scale.y=1/bai;
window.onresize = function () {
    location.reload();
};

var stage;
var renderer;
var flame_width = 209;
var frame_height = 220;
function monitor(){
    stage = new PIXI.Container();
    renderer = PIXI.autoDetectRenderer(flame_width, 108,{
        resolution: 1,
        antialias: true,
        transparent: true,
    });
    document.getElementById("monitor").appendChild(renderer.view);
    var left_px = x/bai-(flame_width/2);
    var top_px = y/bai-(frame_height/2)+26;//107
    $("#monitor").css("left",left_px+"px");
    $("#monitor").css("top",top_px+"px");
}

/*frame button select start title*/
var png_all=[];
var floor_png;
var block_png;
var yusya_all=[];
$.ajax({
    type: 'GET',
    url: 'option.json',
    dataType: 'json'
})
.then(
    (data)=>{
        png_all[0]=data.frame;
        png_all[1]=data.button;
        png_all[2]=data.select;
        png_all[3]=data.start;
        png_all[4]=data.title;
        floor_png=data.floor;
        block_png=data.block;
        yusya_all[0]=data.yusya.body;
        yusya_all[1]=data.yusya.sword;
        yusya_all[2]=data.yusya.shield;
        main();
    },
    ()=>{
        alert("読み込み失敗");
    }
);

var de_flg=false;
function main(){
    memoryscore();
    monitor();
    picstage();
    moji();
    animate();
    function animate(){
        if(floormove_flg){floormove();clashwall();}
        if(pla_jum_flg)playerjump();
        if(frefal_boo)freefall();
        for(var l in yusya_all){
            stage.addChild(yusya_object[l]);
        }
        if(yusya_object[0].x<=0){
            han_jou.text="死";
            changescore();
            if(startflg)de_flg=true;
            cancelAnimationFrame(animate);
        }else{
            han_jou.text="生";
            cc_flg=true;
            score.text++;
        }
        renderer_game.render(stage_game);
        renderer.render(stage);
        if(!de_flg)requestAnimationFrame(animate);
    }
}

var png_object=[];
var yusya_object=[];
var floor_obj=[];
var yo_x;
var yo_y;
var startflg=false;
function picstage(){
    /*frame button select start title*/
    for(var i in png_all){
        png_object[i]=new PIXI.Sprite(PIXI.Texture.fromImage(png_all[i]));
        png_object[i].anchor.x = 0.5;
        png_object[i].anchor.y = 0.5;
        png_object[i].x=x;
        png_object[i].y=y;
        stage_game.addChild(png_object[i]);
    }

    png_object[1].interactive = true;//button
    png_object[2].interactive = true;//select
    png_object[3].interactive = true;//start

    png_object[1].x+=60;
    png_object[1].y+=70;

    png_object[2].x-=50;
    png_object[2].y+=70;

    png_object[3].x-=5;
    png_object[3].y+=70;

    png_object[4].y-=60;

    png_object[1]
    .on('touchstart',()=>{
        if(de_flg)location.reload();
        if(!floormove_flg){
            png_object[4].destroy();floormove_flg = true;
        }else{
            if(pla_jum_nex && pla_jum_flg){pla_jum_boo1=false;pla_jum_boo2=false;pla_jum_cou=0;pla_jum_nex=false;}pla_jum_flg=true;}
    })
    .on('mousedown',()=>{
        if(de_flg)location.reload();
        if(!floormove_flg){
            png_object[4].destroy();floormove_flg = true;
        }else{
            if(pla_jum_nex && pla_jum_flg){pla_jum_boo1=false;pla_jum_boo2=false;pla_jum_cou=0;pla_jum_nex=false;}pla_jum_flg=true;}
    });

    /* body sword shield */
    for(var l in yusya_all){
        yusya_object[l]=new PIXI.Sprite(PIXI.Texture.fromImage(yusya_all[l]));
        yusya_object[l].anchor.x = 0.5;
        yusya_object[l].anchor.y = 0.5;
        yusya_object[l].x=-20;
        yusya_object[l].y=renderer.height/2;
        stage.addChild(yusya_object[l]);
    }
    yo_x=50;
    yo_y=28;
    yusya_object[0].x-=yo_x;
    yusya_object[0].y+=yo_y;
    yusya_object[1].x-=42;
    yusya_object[1].y+=27;
    yusya_object[2].x-=55;
    yusya_object[2].y+=33;

    for(var i=0;i<15;i++){
        floor_obj[i]=new PIXI.Sprite(PIXI.Texture.fromImage(floor_png));
        floor_obj[i].anchor.x = 0.5;
        floor_obj[i].anchor.y = 0.5;
        floor_obj[i].x=floor_x*(2*i+1)/2;
        floor_obj[i].y=renderer.height-floor_y/2;
        stage.addChild(floor_obj[i]);
    }
}

var floormove_flg=false;
var floormove_cou=0;
var floor_x=14;
var floor_y=18;
var floormove_spe=1;
var cre_bro =false;
var num_mem=0;
var num2_mem=0;
function floormove(){
    for(var a in floor_obj){
        floor_obj[a].x-=floormove_spe;
    }
    for(var j in block_obj){
        for(var k in block_obj[j]){
            block_obj[j][k].x-=floormove_spe;
            if(block_obj[j][k].x<=0){cre_bro=true;}
        }
    }
    floormove_cou++;
    if(floormove_cou==(floor_x/floormove_spe)){
        for(var b in floor_obj){
            floor_obj[b].x=floor_x*(2*b+1)/2;
        }
        if(cre_bro){
            block_obj.shift();
            cre_bro=false;
        }
        var b_l = block_obj.length;
        var num = Math.floor(Math.random()*(5));
        switch(num){
            case 0:num=1;break;
            case 1:num=2;break;
            case 2:num=3;break;
            case 3:num=4;break;
            default :num=0;break;
        }
        var num2 = Math.floor(Math.random()*(4));
        switch(num2){
            case 0:num2=1;break;
            case 1:num2=2;break;
            case 2:num2=3;break;
            default :num2=0;break;
        }
        if(!(num_mem==num || num_mem==0)){
            num=0;
        }
        if(!(num2_mem==num2 || num2_mem==0)){
            num2=0;
        }
        num_mem=num;
        num2_mem=num2;
        createblock(b_l,num,num2);
        floormove_cou=0;
    }
}

var block_obj=[];
var block_x = 14;
var block_y = 13;
function createblock(po,min,max){
    block_obj[po]=[];
    for(var l=min;l<min+max;l++){
        block_obj[po][l]=new PIXI.Sprite(PIXI.Texture.fromImage(block_png));
        block_obj[po][l].anchor.x = 0.5;
        block_obj[po][l].anchor.y = 0.5;
        block_obj[po][l].x=floor_x*(2*floor_obj.length+1)/2;//i+1/2
        block_obj[po][l].y=floor_obj[0].y-5-block_y*(2*l+1)/2;
        stage.addChild(block_obj[po][l]);
    }
}

var pla_jum_flg=false;
var pla_jum_nex=true;
var pla_jum_cou=0;
var pla_jum_boo1=false;
var pla_jum_boo2=false;
var pla_x=15;
var pla_y=16;
var pla_jum_spe=2;
function playerjump(){
    frefal_boo=false;
    if(pla_jum_boo1){
        for(var i in yusya_all){
            yusya_object[i].y+=pla_jum_spe;
        }
        var pla_minx = yusya_object[0].x-pla_x/2;
        var pla_maxx = yusya_object[0].x+pla_x/2;
        var ashi = yusya_object[0].y+pla_y/2;
        main:for(var j in block_obj){
            for(var k in block_obj[j]){
                var ji = block_obj[j][k].y-block_y/2;
                var blo_minx = block_obj[j][k].x-block_x/2;
                var blo_maxx = block_obj[j][k].x+block_x/2;
                if((ashi>=ji-1) && (pla_minx<=blo_maxx && pla_maxx>=blo_minx)){
                    if(ashi<=ji){
                        for(var i in yusya_all){
                            yusya_object[i].y-=ashi-ji+1;
                        }
                    }
                    pla_jum_boo2=true;
                    break main;
                }
                if(ashi>=renderer.height/2+yo_y+pla_y/2){
                    pla_jum_boo2=true;
                    break main;
                }
            }
        }
    }else{
        for(var l in yusya_all){
            yusya_object[l].y-=pla_jum_spe;
        }
        pla_jum_cou+=pla_jum_spe;
    }
    if(pla_jum_cou>=block_y*4-5){pla_jum_boo1=true;}
    if(pla_jum_boo2){
        pla_jum_flg=false;
        pla_jum_boo1=false;
        pla_jum_boo2=false;
        pla_jum_cou=0;
        pla_jum_nex=true;
        frefal_boo=true;
    }
}

function clashwall(){
    var clawal_boo=false;
    var clahea_boo=false;
    main:for(var j in block_obj){
        for(var k in block_obj[j]){
            var pla_minx = yusya_object[0].x-pla_x/2;
            var pla_maxx = yusya_object[0].x+pla_x/2;
            var pla_miny = yusya_object[0].y-pla_y/2;
            var pla_maxy = yusya_object[0].y+pla_y/2;
            var blo_minx = block_obj[j][k].x-block_x/2;
            var blo_maxx = block_obj[j][k].x+block_x/2;
            var blo_miny = block_obj[j][k].y-block_y/2;
            var blo_maxy = block_obj[j][k].y+block_y/2;
            if(pla_minx<=blo_maxx && pla_maxx>=blo_minx && pla_miny<=blo_maxy && pla_maxy>=blo_miny){
                if((pla_x+block_x)/2>=block_obj[j][k].x-yusya_object[0].x)clawal_boo=true;
                if(1>=Math.abs(pla_miny-blo_maxy))clahea_boo=true;
                break main;
            }
        }
    }
    if(clawal_boo){
        for(var i in yusya_all){
            yusya_object[i].x-=floormove_spe;
        }
    }else{
        if(yusya_object[0].x<renderer.width/2-yo_x){
            for(var l in yusya_all){
                yusya_object[l].x+=floormove_spe*2;
            }
        }else{
            startflg=true;
        }
    }
    if(clahea_boo){
        pla_jum_boo1=true;
    }
}

var frefal_boo=true;
function freefall(){
    var frefal_che=true;
    var pla_minx = yusya_object[0].x-pla_x/2;
    var pla_maxx = yusya_object[0].x+pla_x/2;
    var ashi = yusya_object[0].y+pla_y/2;
    main:for(var j in block_obj){
        for(var k in block_obj[j]){
            var ji = block_obj[j][k].y-block_y/2;
            var blo_minx = block_obj[j][k].x-block_x/2;
            var blo_maxx = block_obj[j][k].x+block_x/2;
            if((1>=Math.abs(ji-ashi)) && (pla_minx<=blo_maxx && pla_maxx>=blo_minx)){
                frefal_che=false;
                break main;
            }
        }
    }
    if(ashi>=renderer.height/2+yo_y+pla_y/2){
        frefal_che=false;
    }
    if(frefal_che){
        for(var l in yusya_all){
            yusya_object[l].y+=1;
        }
    }
}

var style = {fontFamily : 'Arial',fontSize : '20px', fill:'white', fontWeight : "bold"};
var style2 = {fontFamily : 'Arial',fontSize : '15px', fill:'white', fontWeight : "bold"};
var han_jou;
var score;
var memword=[];
var memscore=[];
var lanknum=[];
var lankword=[];
function moji(){
    var jouword = "現在状況";
    var joukyou = new PIXI.Text(jouword, style);
    stage_game.addChild(joukyou);
    joukyou.x=x-80;
    joukyou.y=y+120;

    var hanword = "";
    han_jou = new PIXI.Text(hanword, style);
    stage_game.addChild(han_jou);
    han_jou.x=x+20;
    han_jou.y=y+120;

    var sword = "スコア";
    var sco_main = new PIXI.Text(sword, style);
    stage_game.addChild(sco_main);
    sco_main.x=x-60;
    sco_main.y=y+150;

    var scoword = "0";
    score = new PIXI.Text(scoword, style);
    stage_game.addChild(score);
    score.x=x+20;
    score.y=y+150;

    var getjson = localStorage.getItem('key');
    var obj = JSON.parse(getjson);
    for(var i=0;i<5;i++){
        lanknum[i]=(i+1);
        lankword[i] = new PIXI.Text(lanknum[i], style2);
        stage_game.addChild(lankword[i]);
        lankword[i].x=x-20;
        lankword[i].y=y+180+i*15;

        memscore[i]=""+obj[i];
        memword[i] = new PIXI.Text(memscore[i], style2);
        stage_game.addChild(memword[i]);
        memword[i].x=x+memscore[i].length;
        memword[i].y=y+180+i*15;
    }
}

function memoryscore(){
    if(localStorage.getItem('key')==null){
        var obj = [0,0,0,0,0];
        var setjson = JSON.stringify(obj);
        localStorage.setItem('key', setjson);
    }
}

var cc_flg=false;
function changescore(){
    if(cc_flg){
        var s_n = Number(score.text);
        var getjson = localStorage.getItem('key');
        var obj = JSON.parse(getjson);
        var mem1,mem2;
        for(var i in obj){
            if(obj[i]<=s_n){
                mem2=s_n;
                for(;i<obj.length;i++){
                    mem1=obj[i];
                    obj[i]=mem2;
                    mem2=mem1;
                }
                for(var l in memword){
                    memword[l].text=""+obj[l];
                }
                var setjson = JSON.stringify(obj);
                localStorage.setItem('key', setjson);
                break;
            }
        }
        cc_flg=false;
    }
}