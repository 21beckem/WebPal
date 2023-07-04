document.write('<script src="https://unpkg.com/@rive-app/canvas@1.2.1"></script>');
class WebPal {
    constructor() {
        document.body.innerHTML += `
<div id="WebPal-screendimmer"></div>
<div id="WebPal-container">
  <canvas id="WebPal-character" width="100" height="100"></canvas>
  <div id="WebPal-textbubble">
    <a id="WebPal-text">Is there anything I can do for you?
        <div id="WebPal-answerscontainer">
            <div><button class="WebPal-answerBtn">Yes</button></div>
            <div><button class="WebPal-answerBtn">No</button></div>
        </div>
    </a>
  </div>
</div>`;
        this.screendimmerEl = document.getElementById('WebPal-screendimmer');
        this.containerEl = document.getElementById('WebPal-container');
        this.characterEl = document.getElementById('WebPal-character');
        this.textbubbleEl = document.getElementById('WebPal-textbubble');
        this.textEl = document.getElementById('WebPal-text');
        this.screendimmerEl.onclick = () => { this.shouldIHideMessage() };
        this.containerEl.onclick = () => { this.shouldIHideMessage() };
        this.characterEl.onclick = () => { this.shouldIHideMessage(true) };
        this.textbubbleEl.onclick = () => { this.shouldIHideMessage() };
        this.textEl.onclick = () => { this.shouldIHideMessage() };
        this.messageShowing = false;
        this.pokeFunction = () => { console.log('Poke!') }
        this.riv = new rive.Rive({
            src: "animationFiles/cuteWave-becker1.riv",
            canvas: this.characterEl,
            autoplay: true,
            stateMachines: "bumpy",
            onLoad: () => {
                this.riv.resizeDrawingSurfaceToCanvas();
            },
        });
    }
    shouldIHideMessage(poking=false) {
        if (this.messageShowing) {
            if (!this.mustWait) {
                this.showMessage(false);
            }
        } else {
            if (poking) {
                setTimeout(() => {
                    this.pokeFunction();
                }, 1);
            }
        }
    }
    showMessage(yesNo) {
        if (yesNo) {
            this.containerEl.classList.add('show-bubble');
            this.screendimmerEl.style.opacity = '1';
        } else {
            this.containerEl.classList.remove('show-bubble');
            this.screendimmerEl.style.opacity = '0';
        }
        this.messageShowing = yesNo;
    }
    playAnimation(animNam) {
        this.riv.play(animNam);
    }
    say(text, duration=0, mustWait=false) {
        if (this.messageShowing) {
            console.warn('Fox already saying something');
            return;
        }
        this.textEl.innerHTML = text;
        this.mustWait = false;
        this.showMessage(true);

        if (duration != 0) {
            this.mustWait = mustWait;
            setTimeout(() => {
                this.showMessage(false);
            }, duration); // Hide text bubble after 'duration' seconds
        }
    }
    ask(text, options, callback, allowCancel=false) {
        if (this.messageShowing) {
            console.warn('Fox already saying something');
            return;
        }
        text += '<div id="WebPal-answerscontainer">';
        options.forEach(txt => {
            text += '<div><button class="WebPal-answerBtn">'+txt+'</button></div>';
        });
        text += '</div>';
        this.textEl.innerHTML = text;

        this.mustWait = !allowCancel;
        this.showMessage(true);
        let btns = document.getElementsByClassName('WebPal-answerBtn');
        for (let i=0; i < btns.length; i++) {
            btns.item(i).onclick = () => {
                this.showMessage(false);
                setTimeout(() => {
                    callback(btns.item(i).innerText);
                }, 1);
            }
        }
    }
}
