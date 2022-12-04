let slideIndex = 1;
let songNumber=1
let timer=5000;
let timerId;
let mediaSource=[];
//const file=document.getElementById('fileupload');

let audioCtx;
function getContext(){
    audioCtx =new(window.AudioContext||window.webkitAudioContext)();
    console.log(audioCtx);}
//const container=document.getElementById('containerMusic');
const canvas=document.getElementById('canvas1');
//canvas.width=window.innerWidth;
//canvas.height=window.innerHeight;
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
    let currentSongName=document.getElementById("songName"+songNumber)
    currentSongName.style.display= "none";
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
    let currentSongName=document.getElementById("songName"+songNumber)
    currentSongName.style.display= "inline-block";
}
function playSong(){
    let song=document.getElementsByClassName("audio");
    if(song[songNumber-1].paused){
         visualiseAndPLay();
    }else{
        song[songNumber-1].pause();
    }

}

function visualiseAndPLay(){
    const audio1=document.getElementById('audio'+songNumber);
    audio1.src='music'+songNumber+'.mp3';
    if(!audioCtx)
        getContext();
    audio1.play().then(r => (console.log('play')));
    audioSrc=mediaSource[songNumber-1] || audioCtx.createMediaElementSource(audio1);
    if(!mediaSource[songNumber-1]){
        mediaSource[songNumber-1]=audioSrc;
    }
    analyser=audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize=256;
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
function switchVolume(n){
    const audio1=document.getElementById('audio'+songNumber);
    audio1.volume=n/10000;
}
/*file.addEventListener('change', function play (){
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
})*/
function drawVisualiser(bufferLength,x,barWidth,barHeight, dataArray){
    for(let i=0; i<bufferLength; i++){
        barHeight=dataArray[i];
        const red=i*barHeight;
        const green=i*4;
        const blue=barHeight;
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
    let play=document.getElementById('play');
    play.style.display="none";
    let stop=document.getElementById('stop');
    stop.style.display="inline-block";
    timerId=setInterval(()=>(plusSlides(1)),timer);

}
function pauseSlideshow(){
    let stop=document.getElementById('stop');
    stop.style.display="none";
    let play=document.getElementById('play');
    play.style.display="inline-block";

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