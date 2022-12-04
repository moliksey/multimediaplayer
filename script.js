let slideIndex = 1;
let songNumber=1
let timer=5000;
let timerId;
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
showSlides(slideIndex);


function plusSlides(n) {
    showSlides(slideIndex += n);
}
function plusMusic(n){
    let song = document.getElementsByClassName("audio");
    let t=song[songNumber-1].volume;
    song[songNumber-1].pause();

    nextSong(songNumber+=n,t);
}
function nextSong(n, t){

    let i;
    let song = document.getElementsByClassName("audio");
    if (n > song.length) {songNumber = 1}
    if (n < 1) {songNumber = song.length}
    for (i = 0; i < song.length; i++) {
        song[i].style.display = "none";
    }
    song[songNumber-1].currentTime = 0;
    song[songNumber-1].style.display = "block";
    song[songNumber-1].volume=t;
}
function playSong(){
    let song=document.getElementsByClassName("audio");
    if(song[songNumber-1].paused){
         visualiseAndPLay(song[songNumber-1]);
    }else{
        song[songNumber-1].pause();
    }

}

function visualiseAndPLay(song){
    debugger
    const audio1=song;
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
};

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
// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function switchTimer(n){
    timer=n;
}
function playSlideshow() {
    timerId=setInterval(()=>(plusSlides(1)),timer);

}
function pauseSlideshow(){
    clearInterval(timerId);


}
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}