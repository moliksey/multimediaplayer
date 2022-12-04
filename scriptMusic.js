let audio2=new Audio();
audio2.src='music1.mp3';
let audio3=new Audio();
audio3.src='music1.mp3';

const file=document.getElementById('fileupload');
const play=document.getElementById('play');
let audioCtx
function getContext(){
    audioCtx =new(window.AudioContext||window.webkitAudioContext)();
    console.log(audioCtx);}
//const container=document.getElementById('containerMusic');
const canvas=document.getElementById('canvas1');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const ctx=canvas.getContext('2d');
let audioSrc;
let analyser;
let client = new XMLHttpRequest();


play.addEventListener('click', function (){
    const audio1=document.getElementById('audio1');
    audio1.src='music1.mp3';
    if(!audioCtx)
        getContext();
    audio1.play().then(r => (console.log('play')));
    audioSrc=audioCtx.createMediaElementSource(audio1);
    analyser=audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize=64;
    const bufferLength=analyser.frequencyBinCount;
    const dataArray=new Uint8Array(bufferLength);
    const barWidth=canvas.width/bufferLength;
    let barHeight;
    let x;
    function animate(){
        x=0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength,x,barWidth,barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate();
});

file.addEventListener('change', function play (){
    debugger;
    if(!audioCtx)
        getContext();
    const files=this.files;

    const audio1=document.getElementById('audio1');
    audio1.src=URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();
    audioSrc=audioCtx.createMediaElementSource(audio1);
    analyser=audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize=128;
    const bufferLength=analyser.frequencyBinCount;
    const dataArray=new Uint8Array(bufferLength);
    const barWidth=canvas.width/bufferLength;
    let barHeight;
    let x;
    function animate(){
        x=0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength,x,barWidth,barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate();
})
function drawVisualiser(bufferLength,x,barWidth,barHeight, dataArray){
    for(let i=0; i<bufferLength; i++){
        barHeight=dataArray[i];
        const red=i*barHeight/20;
        const green=i*4;
        const blue=barHeight/4;
        ctx.fillStyle='rgb('+red+','+green+','+blue+')';
        ctx.fillRect(x,canvas.height-barHeight, barWidth, barHeight);
        x+=barWidth;
    }
}