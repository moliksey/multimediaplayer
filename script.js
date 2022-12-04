let context;
    let analyser,src, array;
let slideIndex = 1;
let songNumber=1
let timer=5000;
let timerId;

showSlides(slideIndex);

function makeContext(){
    if(!context)
    context= new AudioContext();
}

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
    if(context)preparation(song[songNumber-1]);
}
function playSong(){
    let song=document.getElementsByClassName("audio");
    if(!context){
        makeContext();
        preparation();
    }
    if(song[songNumber-1].paused){
        debugger;
        song[songNumber-1].play();
        loop();
    }else{
        song[songNumber-1].pause();
    }



}
function preparation(){
    debugger;
    let song=document.getElementsByClassName("audio");
    analyser=context.createAnalyser();
    src=context.createMediaElementSource(song[songNumber-1]);
    src.connect(analyser);
    src.connect(context.destination);

}
function loop(){
    let song=document.getElementsByClassName("audio");
    let circle=document.getElementsByClassName("circle");
    if(!song[songNumber-1].paused){
        window.requestAnimationFrame(loop);
    }
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    circle.minHeight = (array[40])+"px";
    circle.width =  (array[40])+"px";
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