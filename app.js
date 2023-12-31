class DrumKit{
    constructor(){
        this.pads = document.querySelectorAll(".pad")
        this.playBtn = document.querySelector(".play")
        this.currentKick = "./sounds/kick-classic.wav"
        this.currentSnare = "./sounds/snare-acoustic01.wav"
        this.currentHihat = "./sounds/hihat-acoustic01.wav"
        this.kickAudio = document.querySelector(".kick-sound")
        this.snareAudio = document.querySelector(".snare-sound")
        this.hihatAudio = document.querySelector(".hihat-sound")
        this.index = 0
        this.bpm = 150
        this.isPlaying = null
        this.selects = document.querySelectorAll("select")
        this.muteBtns = document.querySelectorAll(".mute")
        this.tempoSlider = document.querySelector(".tempo-slider")
    }

    activePad() {
        //get pad active -> on click by eventlistener
        this.classList.toggle("active")
    }

    repeat() {
        //when we arrive to index #8 step resets to 0 and we have a loop
        let step = this.index % 8;

        //select each of the pads
        const activeBars = document.querySelectorAll(`.b${step}`)
        
        //loop over the pads for animation
        activeBars.forEach(bar => {
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`
            
            //adding sounds if pad is active
            if (bar.classList.contains("active")) {
                //check sounds
                if (bar.classList.contains("kick-pad")) {
                    //make it overwrite even though previous sound hasn't finished
                    this.kickAudio.currentTime = 0
                    this.kickAudio.play()
                }
                if (bar.classList.contains("snare-pad")) {
                    this.snareAudio.currentTime = 0
                    this.snareAudio.play()
                }
                if (bar.classList.contains("hihat-pad")) {
                    this.hihatAudio.currentTime = 0
                    this.hihatAudio.play()
                }
            }
        })

        this.index++
    }

    start() {
        //set calculation for tempo
        const interval = (60/this.bpm) * 1000
        //check if it's playing
        if (!this.isPlaying) {
            this.isPlaying = setInterval(() => {
                this.repeat()
            }, interval)
        } else {
            //clear the interval so there are no overlaps when clicking play and stops on second click
            clearInterval(this.isPlaying)
            //reset interval to 0
            this.isPlaying = null
        }
    }

    //updates play button text
    updateBtn() {
        if (!this.isPlaying) {
            this.playBtn.innerText = "STOP"
            this.playBtn.classList.add("active")
        } else {
            this.playBtn.innerText = "PLAY"
            this.playBtn.classList.remove("active")
        }
    }

    changeSound(e){
        const selectionName = e.target.name
        const selectionValue = e.target.value
        //checks which select is selected and assigns value to play sound
        switch(selectionName) {
            case "kick-select": 
                this.kickAudio.src = selectionValue
                break
            case "snare-select":
                this.snareAudio.src = selectionValue
                break
            case "hihat-select":
                this.hihatAudio.src = selectionValue
                break
        }
    }

    mute(e) {
        const muteIndex = e.target.getAttribute("data-track")
        e.target.classList.toggle("active")
        if (e.target.classList.contains("active")) {
            switch(muteIndex) {
                case "0":
                    this.kickAudio.volume = 0
                    break
                case "1":
                    this.snareAudio.volume = 0
                    break
                case "2":
                    this.hihatAudio.volume = 0
                    break
            }
        } else {
            switch(muteIndex) {
                case "0":
                    this.kickAudio.volume = 1
                    break
                case "1":
                    this.snareAudio.volume = 1
                    break
                case "2":
                    this.hihatAudio.volume = 1
                    break
            }
        }
    }

    changeTempo(e) {
        const tempoText = document.querySelector(".tempo-nr")
        tempoText.innerHTML = e.target.value
    }

    //clears interval and starts from 0 to get BPM
    updateTempo(e){
        this.bpm = e.target.value
        clearInterval(this.isPlaying)
        this.isPlaying = null
        const playBtn = document.querySelector(".play")
        if (playBtn.classList.contains("active")) {
            this.start()
        }
    }
}

const drumKit = new DrumKit()


drumKit.pads.forEach(pad => {
    pad.addEventListener("click", drumKit.activePad)
    //delete animation for the loop to work
    pad.addEventListener("animationend", function() {
        this.style.animation = ""
    })
})

drumKit.playBtn.addEventListener("click", function() {
    drumKit.updateBtn()
    drumKit.start()
})

drumKit.selects.forEach(select => {
    select.addEventListener("change", function(e) {
        drumKit.changeSound(e)
    })
})

drumKit.muteBtns.forEach(btn => {
    btn.addEventListener("click", function(e) {
        drumKit.mute(e)
    })
})

drumKit.tempoSlider.addEventListener("input", function(e) {
    drumKit.changeTempo(e)
})

drumKit.tempoSlider.addEventListener("change", function(e) {
    drumKit.updateTempo(e)
})