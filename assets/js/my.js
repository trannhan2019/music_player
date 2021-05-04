/*
1. Render songs
2. Scroll top
4. Play/ pause/ seek
4. CD rotate
5. Next/ prev
6. Random
7. Next / Repeat when ender
8. Active song
9. Scroll active song into view -> doing
10. Play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $('.player')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada ',
            singer: 'Vicetone',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Summertime ',
            singer: 'K-391',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Laura Brehm',
            singer: 'TheFatRat',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies feat. Janieck Devy',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Đen',
            singer: 'Ngày Khác Lạ ft. Giang Pham, Triple D',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'DJ DESA REMIX',
            singer: 'Lemon Tree',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Sugar',
            singer: 'Maroon 5',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'My Love',
            singer: 'Westlife',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Attention',
            singer: 'Charlie Puth',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Katie Sky',
            singer: 'Monsters',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function(){
        const _this = this;   
        const cdWidth = cd.offsetWidth;
        //xu lys CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 second
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //Xu ly phong to/thu nho CD
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xu ly khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying) {
                audio.pause()                  
            } else {
                audio.play()
            }
        }
        //Khi song duoc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            //console.log(cdThumbAnimate)
        }
        //khi song dang pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //xu ly khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //xu ly khi click next song
        nextBtn.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()                
            }
            audio.play()
            _this.render()
            _this.scrollToActivesong()
        }
        //xu ly khi click prev song
        prevBtn.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()                
            }
            audio.play()
            _this.render()
            _this.scrollToActivesong()
        }
        //xu ly khi click random btn
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        //xu ly khi bat / tat repeat
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //xu ly next song khi audio ended
        audio.onended = function(){
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()                
            }
        },
        // Lang nghe hanh vi click vao play list
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xu ly khi click vao song
                if(songNode){
                    //console.log(songNode.getAttribute('data-index'))
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //xu ly khi click vao option song
                if(e.target.closest('.option')){
                    
                }
                
            }
        }
    },
    
    //scroll to active song
    scrollToActivesong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },300)
    },
    loadCurrentSong: function(){     
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        //load Config vao ung dung
        this.loadConfig();
        //Dinh nghia cac thuoc tinh cho Object
        this.defineProperties();
        //Lang nghe va xu ly cac su kien
        this.handleEvents();
        //tai thong tin bai hat dau tien vao UI khi chay
        this.loadCurrentSong();
        //render cac bai hat
        this.render();
        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();
