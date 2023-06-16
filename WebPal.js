class WebPal {
    constructor() {
        document.body.innerHTML += `
<div id="WebPal-screendimmer"></div>
<div id="WebPal-container">
  <div id="WebPal-character"></div>
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
    }
    shouldIHideMessage(poking=false) {
        if (this.messageShowing) {
            if (!this.mustWait) {
                this.showMessage(false);
            }
        } else {
            if (poking) {
                alert('Poke!');
            }
        }
    }
    showMessage(yesNo) {
        if (yesNo) {
            this.containerEl.classList.add('show-bubble');
            this.screendimmerEl.style.display = 'block';
        } else {
            this.containerEl.classList.remove('show-bubble');
            this.screendimmerEl.style.display = 'none';
        }
        this.messageShowing = yesNo;
    }
    say(text, duration=0, mustWait=false) {
        if (this.messageShowing) {
            return;
        }
        this.textEl.innerText = text;
        this.mustWait = false;
        this.showMessage(true);

        if (duration != 0) {
            this.mustWait = mustWait;
            setTimeout(() => {
                this.showMessage(false);
            }, duration); // Hide text bubble after 2 seconds
        }
    }
    ask(text, options, callback) {
        if (this.messageShowing) {
            return;
        }
        text += '<div id="WebPal-answerscontainer">';
        options.forEach(txt => {
            text += '<div><button class="WebPal-answerBtn">'+txt+'</button></div>';
        });
        text += '</div>';
        this.textEl.innerHTML = text;

        this.mustWait = true;
        this.showMessage(true);
        let btns = document.getElementsByClassName('WebPal-answerBtn');
        for (let i=0; i < btns.length; i++) {
            btns.item(i).onclick = () => {
                callback(btns.item(i).innerText);
                this.showMessage(false);
            }
        }
    }
}