class Timer extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    // Создаем элементы внутри shadow root
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          text-align: center;
          font-family: Arial, sans-serif;
          color: #FFF;
          background-color: #000;
          padding: 10px;
          border-radius: 5px;
        }
        
        #timer {
          font-size: 48px;
          margin: 40px;
        }
        
        button {
          background-color: #FF0000;
          color: #FFF;
          font-size: 20px;
          border: none;
          padding: 10px 30px;
          margin-right: 5px;
          border-radius: 3px;
          cursor: pointer;
        }
        
        button:hover {
          background-color: #FF3333;
        }
      </style>
      <div id="timer"></div>
      <button id="startButton">Start</button>
      <button id="pauseButton">Pause</button>
      <button id="resetButton">Reset</button>
    `;
    
    // Получаем элементы из shadow root
    this.timerElement = this.shadowRoot.getElementById('timer');
    this.startButton = this.shadowRoot.getElementById('startButton');
    this.pauseButton = this.shadowRoot.getElementById('pauseButton');
    this.resetButton = this.shadowRoot.getElementById('resetButton');
    
    // Устанавливаем обработчики событий для кнопок
    this.startButton.addEventListener('click', () => this.startTimer());
    this.pauseButton.addEventListener('click', () => this.pauseTimer());
    this.resetButton.addEventListener('click', () => this.resetTimer());
    
    // Инициализируем переменные
    this.timerId = null;
    this.seconds = parseInt(this.getAttribute('seconds')) || 0;
    this.remainingSeconds = this.seconds;
    this.isTimerRunning = false;
    
    // Отображаем начальное время
    this.updateTimerDisplay();
  }
  
  connectedCallback() {
    // Подписываемся на события starttimer, pausetimer и resettimer
    this.addEventListener('starttimer', () => this.startTimer());
    this.addEventListener('pausetimer', () => this.pauseTimer());
    this.addEventListener('resettimer', () => this.resetTimer());
  }
  
  disconnectedCallback() {
    // Отписываемся от событий при удалении элемента из DOM
    this.removeEventListener('starttimer', () => this.startTimer());
    this.removeEventListener('pausetimer', () => this.pauseTimer());
    this.removeEventListener('resettimer', () => this.resetTimer());
  }
  
  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerId = setInterval(() => {
        this.remainingSeconds--;
        this.updateTimerDisplay();
        if (this.remainingSeconds <= 0) {
          this.endTimer();
        }
      }, 1000);
    }
  }
  
  pauseTimer() {
    if (this.isTimerRunning) {
      clearInterval(this.timerId);
      this.isTimerRunning = false;
    }
  }
  
  resetTimer() {
    clearInterval(this.timerId);
    this.remainingSeconds = this.seconds;
    this.isTimerRunning = false;
    this.updateTimerDisplay();
  }
  
  endTimer() {
    clearInterval(this.timerId);
    this.isTimerRunning = false;
    const event = new CustomEvent('endtimer');
    this.dispatchEvent(event);
  }
  
  updateTimerDisplay() {
    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;
    
    let timeString = '';
    
    if (hours > 0) {
      timeString += `${hours.toString().padStart(2, '0')}:`;
    }
    
    timeString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    this.timerElement.textContent = timeString;
  }
}

customElements.define('countdown-timer', Timer);