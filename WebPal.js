document.write('<script src="https://unpkg.com/@rive-app/canvas@1.2.1"></script>');
class WebPal {
    constructor() {
        document.body.innerHTML += `
<div id="WebPal-screendimmer"></div>
<canvas id="WebPal-BigAnim" style="display:none"></canvas>
<div id="WebPal-BigAnim-Clicker" style="display:none"></div>
<div id="WebPal-container">
  <canvas id="WebPal-character" width="100" height="100"></canvas>
  <div id="WebPal-textbubble">
    <a id="WebPal-text">
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
        this.bigAnimEl = document.getElementById('WebPal-BigAnim');
        this.bigAnimClickerEl = document.getElementById('WebPal-BigAnim-Clicker');
        this.bigAnimClickerEl.onclick = () => { this.shouldIHideMessage() };
        this.bigAnimClickerEl.style.width = window.innerWidth + 'px';
        this.bigAnimClickerEl.style.height = window.innerWidth + 'px';
        this.bigAnimEl.width = window.innerWidth;
        this.bigAnimEl.height = window.innerWidth;
        this.textbubbleEl = document.getElementById('WebPal-textbubble');
        this.textEl = document.getElementById('WebPal-text');
        this.screendimmerEl.onclick = () => { this.shouldIHideMessage() };
        this.characterEl.onclick = (e) => { this.shouldIHideMessage(true) };
        this.messageShowing = false;
        this.bigRiveShowing = false;
        this.fadingTimeout = null;
        this.pokeFunction = () => { console.log('Poke!') }
        this.riv = new rive.Rive({
            src: "https://21beckem.github.io/WebPal/animationFiles/foxFromBenjamin1.riv",
            canvas: this.characterEl,
            autoplay: true,
            stateMachines: "bumpy",
            onLoad: () => {
                this.riv.resizeDrawingSurfaceToCanvas();
            },
        });
    }
    checkIfActuallyClickingFoxOnCanvas(e) {
        let context = this.characterEl.getContext("2d", { willReadFrequently: true });
        let data = context.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        if (data[3]!=0) {
            this.shouldIHideMessage(true);
        }
    }
    shouldIHideMessage(poking=false) {
        if (this.bigRiveShowing) {
            if (!this.mustWait) {
                this.triggerExitBigRiv();
                return;
            }
        }
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
            clearTimeout(this.fadingTimeout);
            document.documentElement.style.setProperty('--fadeBlockness', 'block');
            document.documentElement.style.setProperty('--fadeOpacityVal', '1');
            this.containerEl.classList.add('show-bubble');
            this.screendimmerEl.style.opacity = '1';
        } else {
            this.containerEl.classList.remove('show-bubble');
            this.screendimmerEl.style.opacity = '0';
            this.fadingTimeout = setTimeout(() => {
                document.documentElement.style.setProperty('--fadeBlockness', 'none');
                document.documentElement.style.setProperty('--fadeOpacityVal', '0');
            }, 200);
        }
        this.messageShowing = yesNo;
    }
    playAnimation(animNam) {
        this.riv.play(animNam);
    }
    playLargeRive(rivNam, stateMachineName, clickAnywhereToExitStateMachine=true, triggerExitInputName='trigger exit') {
        clearTimeout(this.fadingTimeout);
        this.bigAnimEl.style.display = '';
        if (clickAnywhereToExitStateMachine) {
            this.bigAnimClickerEl.style.display = '';
        }
        this.textbubbleEl.style.display = 'none';
        document.documentElement.style.setProperty('--fadeBlockness', 'block');
        document.documentElement.style.setProperty('--fadeOpacityVal', '1');
        this.messageShowing = true;
        this.bigRiveShowing = true;
        this.screendimmerEl.style.opacity = '1';
        this.bigRiv = new rive.Rive({
            src: "https://21beckem.github.io/WebPal/animationFiles/" + rivNam,
            canvas: this.bigAnimEl,
            autoplay: true,
            stateMachines: stateMachineName,
            onLoad: () => {
                if (clickAnywhereToExitStateMachine) {
                    const inputs = this.bigRiv.stateMachineInputs(stateMachineName);
                    // Find the input you want to set a value for, or trigger
                    const exitTrigger = inputs.find(i => i.name === triggerExitInputName);
                    this.triggerExitBigRiv = () => {
                        try { exitTrigger.fire(); } catch (e) {}
                    }
                } else {
                    this.triggerExitBigRiv = () => {};
                }
                this.bigAnimEl.onclick = () => { this.shouldIHideMessage() };
            },
            onStateChange: (event) => {
                if (event.data.includes('exit')) {
                    this.endLargeRive();
                }
            }
        });
    }
    endLargeRive() {
        this.screendimmerEl.style.opacity = '0';
        this.bigAnimEl.style.display = 'none';
        this.bigAnimClickerEl.style.display = 'none';
        this.fadingTimeout = setTimeout(() => {
            this.textbubbleEl.style.display = '';
            document.documentElement.style.setProperty('--fadeBlockness', 'none');
            document.documentElement.style.setProperty('--fadeOpacityVal', '0');
        }, 200);
        this.messageShowing = false;
        this.bigRiveShowing = false;
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
