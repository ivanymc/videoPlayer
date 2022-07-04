import { srtText } from './srt-to-vtt.js';

// Create a video player
let player = videojs('videoPlayer', { 
  html5: {
    vhs: {
      withCredentials: true
    }
  }
});


// Load player setting
player.preload = 'auto';
player.autoplay(true);
player.controls(true);
player.fill(true);
player.responsive(true);
player.aspectRatio('16:9');
player.playbackRates([0.25, 0.5, 1, 1.5, 2, 5]);
player.volume(0.1);


// Load plugin-hotkeys
player.ready(() => {
  player.hotkeys({
    volumeStep: 0.1,
    seekStep: 10
  });
});


// Show the audioTrackButton
player.on("loadedmetadata", () => {
  player.controlBar.audioTrackButton.el_.classList.remove('vjs-hidden');
});


// Convert subtitle srt to vtt blobURL
function srt2vtt(srtText) {   
  let srtRegex = /(.*\n)?(\d\d:\d\d:\d\d),(\d\d\d --> \d\d:\d\d:\d\d),(\d\d\d)/g;
  let vttText = "WEBVTT\n\n" + srtText.replace(srtRegex, "$1$2.$3.$4") ;
  let vttBlob = new Blob([vttText], {type : 'text/vtt'});
  let blobURL = URL.createObjectURL(vttBlob);
  return blobURL;
}

let srtBlobURL = [];
srtBlobURL.push(srt2vtt(srtText[0])); // Test 1 ENG
srtBlobURL.push(srt2vtt(srtText[1])); // Test 1 CHT
srtBlobURL.push(srt2vtt(srtText[2])); // Test 1 CHS


// Convert video source to blob object url
let videoSrc = [
  './video/cat/catmaster.m3u8',
  './video/oceans/oceansmaster.m3u8',
  'https://dwpurpmwfzvap.cloudfront.net/videojs-for-github/master.m3u8',
  'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
];


// Add video into playlist
player.playlist([
{
  name: "Test 1",
  thumbnail: './img/cat4.jpg',
  sources: [{
    src: videoSrc[0],
    type: 'application/x-mpegURL',
  }], 
  textTracks: [{ 
    kind: "subtitles",
    label: "ENGLISH",
    src: srtBlobURL[0],
    default: true,    
    }, {
    kind: "subtitles",
    label: "繁體中文",
    src: srtBlobURL[1],
    }, {
    kind: "subtitles",
    label: "简体中文",
    src: srtBlobURL[2], 
    }
  ]
}, {
  name: "Test 2",
  thumbnail: './img/cat2.jpg',
  sources: [{
    src: videoSrc[1],
    type: 'application/x-mpegURL',
  }], 
  textTracks: [{ 
    kind: "subtitles",
    label: "繁體中文",
    src: srtBlobURL[1],   
    default: true  
    }
  ]
}, {
  name: "Test 3",
  thumbnail: './img/cat3.jpg',
  sources: [{
    src: videoSrc[2],
    type: 'application/x-mpegURL',
  }]
}, {
  name: "Test 4",
  thumbnail: './img/cat5.jpg',
  sources: [{
    src: videoSrc[3],
    type: 'application/x-mpegURL'
  }]
}
]);


// Play through the playlist automatically.
player.playlist.autoadvance(0.5);


// Play list UI
player.playlistUi();


// Audio tracks listen to the "change" event.
let audioTrackList = player.audioTracks();
audioTrackList.addEventListener('change', () => {  
  // Log the currently enabled AudioTrack label.
  for (let i = 0; i < audioTrackList.length; i++) {
    if (audioTrackList[i].enabled) {
      console.log(audioTrackList[i].label);
      }
  }
});


// Removing player from both the DOM and memory after closing the tab
window.addEventListener('unload', () => {
  player.dispose();
  player.remove();
});



// ffmpeg
/*
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg ({
     corePath : './node_modules/@ffmpeg/core/dist/ffmpeg-core.js' ,
     log : true ,
});

( async () => {
  await ffmpeg.load();
 
const dataInputVideo = await fetchFile ( './video/test1.mp4' );
const dataInputAudio = await fetchFile ( './audio/02 Initial blocking and sculpt-1080p_HK.wav' );

ffmpeg.FS ( 'writeFile' , './video/test1.mp4' , dataInputVideo);
ffmpeg.FS ( 'writeFile' , './audio/02 Initial blocking and sculpt-1080p_HK.wav' , dataInputAudio);

// ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 output.mp4 
await ffmpeg.run ( '-i' , './video/test1.mp4' , '-i' , './audio/02 Initial blocking and sculpt-1080p_HK.wav' ,
                   '-c:v' , 'copy' , '-c:a' , 'aac' , '-strict' , 'experimental' , '-map' , '0:v:0' , '-map' , '1:a:0' , './output.mp4' );

const data = ffmpeg.FS ( 'readFile' , './output.mp4' );
const video = document.getElementById ( 'videoPlayer' );
video.src = URL.createObjectURL ( new  Blob ([data. buffer ], { type : 'video/mp4' }));
console.log("VIDEO AR = " + video.src);
})();
*/


