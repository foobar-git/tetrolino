import { Component } from '@angular/core';
import { AdMob, AdMobRewardItem, AdOptions, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob/dist/esm/banner';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Optional } from '@angular/core';
import { App } from '@capacitor/app';
import { Gesture, GestureController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
//import { ScreenOrientation } from '@capacitor/screen-orientation';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // theme variables
  toggleTheme = false;
  toggleTheme_LIGHT = 'Set Light Theme';
  toggleTheme_DARK = 'Set Dark Theme';

  // alert handler message
  handlerMessage = "";

  // Google AdMob variables
  initializeGoogleAdmobAds = false;
  isTesting = false;
  bannerAdId: string;
  bannerAdId_test = 'ca-app-pub-3940256099942544/6300978111';        // testing id
  bannerAdId_real = '';          // real id
  interstitialAdId: string;
  interstitialAdId_test = 'ca-app-pub-3940256099942544/1033173712';  // testing id
  interstitialAdId_real = '';    // real id
  rewardAdId: string;
  rewardAdId_test = 'ca-app-pub-3940256099942544/5224354917';        // testing id
  rewardAdId_real = '';          // real id

  // Tetrolino variables
  tetrolinoes: any;
  previewTetrolinos: any;
  startingPosition: any;
  currentPosition: number;
  randomTetrolino: number;
  nextRandomTetrolino: number;
  selectedTetrolino: any;
  randomRotation: number;
  nextRandomRotation: number;
  currentRotation: number;
  currentTetrolino: any;
  randomColor: string;
  nextRandomColor: string;
  timerId: any;
  timer = 900;  // set time interval (1000 = 1 second)
  linesCleared = 0;
  linesToNextLevel = 0;
  everyNumberOfLines = 5;
  score = 0;
  level = 1;
  levelBonus = (this.level * 100);
  moveDownBonus = 0;
  dropDownBonus = 50;
  clearsToSpecialTetrolinoMove = 4;
  specialTetrolinoMoveCounter = 0;
  specialTetrolinoMoveBonus = 1000;
  specialClearMoveBonus = 500;
  specialClearMove = false;
  gamePaused = true;
  gameIsOver = false;
  blockWidth = "20px";
  blockHeight = "20px";
  width_squareGrid = 10;
  width_mainWindow = 200;
  width_squarePreviewGrid = 4;
  width_previewWindow = 16;
  squares_grid: any;
  squares_previewGrid: any;
  grid: any;
  previewGrid: any;
  index_previewGrid: number;
  scoreDisplay: any;
  levelDisplay: any;
  titleDisplay: any;
  gameTitleString = "Tetrolino";
  gamePauseString = "Game Paused";
  gameOverString = "Game Over";
  colors = [
    'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'blanchedalmond', 'blue', 'blueviolet', 
    'brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk', 'crimson','cyan', 
    'darkblue','darkcyan','darkgoldenrod','darkgreen','darkkhaki', 'darkmagenta','darkolivegreen', 'darkorange', 
    'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkturquoise', 'darkviolet', 'deeppink', 
    'deepskyblue', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 
    'goldenrod', 'green',  'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 
    'lavenderblush', 'moccasin'
  ];
  b100complete = false;
  b1000complete = false;
  b10000complete = false;

  // audio
  normalVolume = 0.85;
  normalPlaybackRate = 1;
  settingsVolume = 0.20;
  settingsPlaybackRate = 0.65;
  backgroundMusic: HTMLAudioElement;
  tetrolinoMusic = 'assets/audio/tetrolino.mp3';
  soundEffect: HTMLAudioElement;
  solidifyAudio = 'assets/audio/solidify.mp3';
  soundEffect_clearLine: HTMLAudioElement;
  clearLineAudio = 'assets/audio/clearLine.mp3';
  tetrolinoSpecialMoveAudio = 'assets/audio/tetrolinoSpecialMove.mp3';
  voice: HTMLAudioElement;
  gameOverAudio = 'assets/audio/voice/gameOver.mp3';
  goodGameAudio = 'assets/audio/voice/goodGame.mp3';
  goodJobAudio = 'assets/audio/voice/goodJob.mp3';
  magicianAudio = 'assets/audio/voice/magician.mp3';
  s100Audio = 'assets/audio/voice/100.mp3';
  s1000Audio = 'assets/audio/voice/1000.mp3';
  s10000Audio = 'assets/audio/voice/10000.mp3';
  voicePlaying = false;
  toggleAudio = true;
  toggleAudioString_OFF = 'Audio OFF';
  toggleAudioString_ON = 'Audio ON';

  // buttons
  previewGrid_asButton: any;
  settingsButton: any;
  infoButton: any;
  startPauseButton: any;
  rotateButton: any;
  moveDownButton: any;
  moveLeftButton: any;
  moveRightButton: any;
  handleClick_drop = () => {
    if (!this.gamePaused || this.gameIsOver) this.drop();
  };
  handleClick_settings = () => {
    this.showSettings();
  };
  handleClick_info = () => {
    this.showInfo();
  };
  handleClick_startPause = () => {
    if (!this.gameIsOver) {
      this.gamePaused = !this.gamePaused;
        this.pauseGame(this.gamePaused);
    } else {
      this.restartGame();
    };
  }
  handleClick_rotate = () => {
    if (!this.gamePaused) this.rotate();
  };
  handleClick_moveDown = () => {
    if (!this.gamePaused) this.moveDown();
  };
  handleClick_moveLeft = () => {
    if (!this.gamePaused) this.moveLeft();
  };
  handleClick_moveRight = () => {
    if (!this.gamePaused) this.moveRight();
  };

  // swipe variables
  swipeGesture: Gesture;
  
  // Zen Masters URLs
  zenmastersURL = 'https://www.games.zenmasters.software';
  itchioURL = 'https://zenmasters.itch.io';
  youtubeURL = 'https://www.youtube.com/@zenmasters_games';
  twitterURL = 'https://twitter.com/ZenMastersGames';
  newsletterURL = 'https://games.zenmasters.software/#newsletter';


  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private gestureCtrl: GestureController,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    // pause when switching to other app
    this.platform.pause.subscribe(async () => {
      if (this.gamePaused == false) {
        this.gamePaused = true;
        this.pauseGame(this.gamePaused);
      }
      
    });

    // exit app if back button is pressed
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      };
    });

    // lock screen orientation
    //ScreenOrientation.lock({ orientation: 'portrait' });

    // Binding 'this' to input for keyboard
    this.getUserInput = this.getUserInput.bind(this);

    // init Google AdMob
    if (this.initializeGoogleAdmobAds) {
      if (this.isTesting) {
        this.bannerAdId = this.bannerAdId_test;
        this.interstitialAdId = this.interstitialAdId_test;
        this.rewardAdId = this.rewardAdId_test;
      } else {
        this.bannerAdId = this.bannerAdId_real;
        this.interstitialAdId = this.interstitialAdId_real;
        this.rewardAdId = this.rewardAdId_real;
      }
      this.initializeGoogleAdMob();
    }
  }

  ngOnInit() {
    // init audio
     this.backgroundMusic = this.setAudio(this.tetrolinoMusic, this.normalVolume, true);

    // init grid
    this.setUpGrid(this.width_mainWindow);
    this.tetrolinoes = this.initTetrolinos(this.width_squareGrid);
    this.previewTetrolinos = this.initTetrolinos(this.width_squarePreviewGrid);
    this.linesToNextLevel = this.everyNumberOfLines;

    // randomize tetrolinos
    this.shuffle(this.tetrolinoes, this.previewTetrolinos);
    this.shuffle(this.tetrolinoes, this.previewTetrolinos);
    
    // init ui
    this.previewGrid = document.querySelector('.preview-grid');
    this.setUpPreviewGrid(this.width_previewWindow);
    this.squares_previewGrid = document.querySelectorAll('.preview-grid div');
    this.index_previewGrid = 0;
    this.scoreDisplay = document.querySelector('#score-number');
    this.levelDisplay = document.querySelector('#level-number');
    this.titleDisplay = document.querySelector('#title');
    this.initDropButton();
    this.initSettingsButton();
    this.initInfoButton();
    this.initStartPauseButton();
    this.initMoveButtons();
    this.levelDisplay.innerHTML = this.level;
    this.startingPosition = 4;  // set tetrolino starting position
    this.currentPosition = this.startingPosition;
    this.nextRandomTetrolino = Math.floor(Math.random() * this.tetrolinoes.length);
    this.nextRandomRotation = 0;
    this.selectRandomTetrolino();
    this.draw();
    this.displayNextTetrolino();
    this.addButtonListeners();

    if (this.initializeGoogleAdmobAds) {
      // prepare ads
      this.prepareInterstitialAd(this.interstitialAdId);
      this.prepareRewardAd(this.rewardAdId);

      // show banner ads
      this.showBannerAd(this.bannerAdId);
    }
  }

  ngOnDestroy() {
    this.removeButtonListeners();
    //ScreenOrientation.unlock();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // FUNCTIONS
  initTetrolinos(width: number) {
    const j_tetrolino = [
        //[20, 01, 11, 21],
        [2 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        //[10, 20, 21, 22],
        [1 * width + 0, 2 * width + 0, 2 * width + 1, 2 * width + 2],
        //[01, 11, 21, 02],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 0 * width + 2],
        //[10, 11, 12, 22]
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 2 * width + 2]
    ];

    const l_tetrolino = [
        [0 * width + 0, 1 * width + 0, 2 * width + 0, 2 * width + 1],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 1 * width + 2],
        [0 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        [2 * width + 0, 2 * width + 1, 1 * width + 2, 2 * width + 2]
    ];

    const s_tetrolino = [
        [2 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [0 * width + 0, 1 * width + 0, 1 * width + 1, 2 * width + 1],
        [2 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [0 * width + 0, 1 * width + 0, 1 * width + 1, 2 * width + 1]
    ];

    const z_tetrolino = [
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 2 * width + 2],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 0 * width + 1],
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 2 * width + 2],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 0 * width + 1]
    ];

    const t_tetrolino = [
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [1 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        [1 * width + 0, 0 * width + 1, 1 * width + 1, 1 * width + 2],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 1 * width + 2]
    ];

    const o_tetrolino = [
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1]
    ];

    const i_tetrolino = [
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 3 * width + 1],
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 1 * width + 3],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 3 * width + 1],
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 1 * width + 3]
    ];
    
    return [j_tetrolino, l_tetrolino, s_tetrolino, z_tetrolino, t_tetrolino, o_tetrolino, i_tetrolino];
  }

  setUpPreviewGrid(wp) {  // set up the preview grid (next tetrolino box)
    for (let i = 0; i < wp; i++) {
      let element = document.createElement('div');
      element.style.width = this.blockWidth;
      element.style.height = this.blockHeight;
      this.previewGrid?.appendChild(element);
    };
  }

  setUpGrid(w) {  // setting up the grid
    this.grid = document.querySelector('.grid');
    for (let i = 0; i < w; i++) {
      let element = document.createElement('div');
      element.style.width = this.blockWidth;
      element.style.height = this.blockHeight;
      this.grid?.appendChild(element);
    };
    for (let i = 0; i < 10; i++) {
      let element = document.createElement('div');
      element.classList.add('solid');
      this.grid?.appendChild(element);
    };
    this.squares_grid = Array.from(document.querySelectorAll('.grid div'));
  }

  isAtRight() { // check if a tetrolino is at the right edge
    return this.currentTetrolino.some(index => (this.currentPosition + index + 1) % this.width_squareGrid === 0)  
  };

  isAtLeft() {  // check if a tetrolino is at the left edge
    return this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === 0)
  };

  checkRotatedPosition(P?) {
    P = P || this.currentPosition                 // get current position and check if the piece is near the left side
    let isValid = true;                           // whether the tetrolino is in a valid position (to be able to rotate)
    if ((P + 1) % this.width_squareGrid < 4) {    // add 1 because the position index can be 1 less than where the block is (with how they are indexed)
      if (this.isAtRight()) {                     // use actual position to check if it's flipped over to right side
        this.currentPosition += 1;                // if so, add one to wrap it back around
        isValid = false;                          // check again;  pass position from start, since long block might need to move more
        this.checkRotatedPosition(P);
      }
    } else if (P % this.width_squareGrid > 5) {
      if (this.isAtLeft()) {
        this.currentPosition -= 1;
        isValid = false;
        this.checkRotatedPosition(P);
      }
    }

    // Check if any of the current tetromino blocks overlap with a solid block
    const tetrominoSquares = this.currentTetrolino.map(index => this.currentPosition + index);
    const overlap = tetrominoSquares.some(square => {
      return this.squares_grid[square].classList.contains('solid');
    });

    if (overlap) isValid = false;

    return isValid;
  }

  draw() {  // draw the tetrolino
    this.currentTetrolino.forEach(index => {
      this.squares_grid[this.currentPosition + index].classList.add('tetrolino');
      (this.squares_grid[this.currentPosition + index] as HTMLElement).style.backgroundColor = "grey";
      // apply a random color
      this.squares_grid[this.currentPosition + index].style.backgroundColor = this.randomColor;
    });
  }

  undraw() {  // undraw the tetrolino
    this.currentTetrolino.forEach(index => {
      this.squares_grid[this.currentPosition + index].classList.remove('tetrolino');
      this.squares_grid[this.currentPosition + index].style.backgroundColor = '';   // remove the color
    });
  }

  displayNextTetrolino() {
    // remove any trace of a tetromino form the entire grid
    this.squares_previewGrid.forEach(square => {
      square.classList.remove('tetrolino');
      square.style.backgroundColor = '';   // remove the color
    });
    let selectedPreviewTetrolino = this.previewTetrolinos[this.nextRandomTetrolino];
    let currentPreview = selectedPreviewTetrolino[this.nextRandomRotation];
    currentPreview.forEach( index => {
      this.squares_previewGrid[this.index_previewGrid + index].classList.add('tetrolino');
      this.squares_previewGrid[this.index_previewGrid + index].style.backgroundColor = this.nextRandomColor;
    });
  }

  advanceTetrolinoDownward() {  // move tetrolino down
    // enabling "last second change"
    if (!this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index + this.width_squareGrid].classList.contains('solid'))) {
      this.undraw();
      this.currentPosition += this.width_squareGrid;
      this.draw();
    } else {
      this.solidify();
    };
  }

  shuffle(t: any, pt: any) {
    // Randomize the first array (using Fisher-Yates shuffle)
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
      [pt[i], pt[j]] = [pt[j], pt[i]]; // apply the same randomization to pt
    }
    this.tetrolinoes = t;
    this.previewTetrolinos = pt;
  }

  selectRandomTetrolino() {
    // randomly select a new color
    this.randomColor = this.nextRandomColor;
    this.nextRandomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // randomly select a tetrolino
    this.randomTetrolino = this.nextRandomTetrolino;
    this.nextRandomTetrolino = Math.floor(Math.random() * this.tetrolinoes.length);
    this.selectedTetrolino = this.tetrolinoes[this.randomTetrolino];

    // randomly apply a rotation
    this.randomRotation = this.nextRandomRotation;
    this.nextRandomRotation = Math.floor(Math.random() * this.selectedTetrolino.length);
    this.currentRotation = this.randomRotation;
    this.currentTetrolino = this.selectedTetrolino[this.currentRotation];
    // TESTING
    //this.fnTest();

    // reset the special tetrolino move counter
    this.specialTetrolinoMoveCounter = 0;
  }

  solidify() { // solidify the tetrolino into place
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index + this.width_squareGrid].classList.contains('solid'))) {
      this.soundEffect = this.setAudio(this.solidifyAudio, 0.20);
      this.soundEffect.play();
      this.currentTetrolino.forEach(index => this.squares_grid[this.currentPosition + index].classList.add('solid'));
      this.selectRandomTetrolino();
      this.currentPosition = this.startingPosition; // set the new tetrolino at the top
      this.displayNextTetrolino();
      this.removeRows();
      this.draw();
      this.gameOver();
    };
  }

  removeRows() { // add score
    for (let i = 0; i < (this.width_mainWindow - 1); i += this.width_squareGrid) {
      const row = [i+0, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
      if (row.every(index => this.squares_grid[index].classList.contains('solid'))) {
        this.specialTetrolinoMoveCounter++;   // count toward special tetrolino move

        this.soundEffect_clearLine = this.setAudio(this.clearLineAudio, 0.20);
        this.soundEffect_clearLine.play();
        this.linesCleared++;
        this.score += 10 + this.moveDownBonus;
        this.scoreDisplay.innerHTML = this.score;
        this.moveDownBonus = 0;

        row.forEach(index => {
          this.squares_grid[index].classList.remove('solid');
          this.squares_grid[index].classList.remove('tetrolino');
          this.squares_grid[index].style.backgroundColor = '';   // remove the color
        });
        const squaresRemoved = this.squares_grid.splice(i, this.width_squareGrid);
        this.squares_grid = squaresRemoved.concat(this.squares_grid);
        this.squares_grid.forEach(block => this.grid.appendChild(block));
      };
    };
    this.checkSpecialTetrolinoMove();
    this.checkSpecialClearMove();
    this.scoreDisplay.innerHTML = this.score;
    this.checkScoreForAudio();
    if (this.linesCleared >= this.linesToNextLevel) {
      this.linesToNextLevel += this.everyNumberOfLines;
      this.advanceLevel();
    }
  }  

  checkSpecialTetrolinoMove() {
    if (this.specialTetrolinoMoveCounter >= this.clearsToSpecialTetrolinoMove) {
      this.score += this.specialTetrolinoMoveBonus + this.levelBonus;
      // wait for first audio to finish, then play next audio
      this.soundEffect = this.setAudio(this.tetrolinoSpecialMoveAudio, 0.5);
      this.soundEffect.addEventListener('ended', () => {
        this.voice = this.setAudio(this.goodJobAudio, this.normalVolume);
        this.voice.play();
      });
      this.soundEffect.play();
    }
  }

  checkSpecialClearMove() { // special clear move when nothing remains on the grid
    let grid = document.querySelector('.grid');
    let solid = grid.querySelector(".tetrolino.solid");
    if (!solid) {
      // wait for first audio to finish, then play next audio
      this.soundEffect = this.setAudio(this.tetrolinoSpecialMoveAudio, 0.5);
      this.soundEffect.addEventListener('ended', () => {
        this.voice = this.setAudio(this.magicianAudio, 1);
        this.voice.play();
      });
      this.soundEffect.play();
      this.score += this.specialClearMoveBonus + this.levelBonus;
    }
  }

  checkScoreForAudio() {
    if (!this.b10000complete) {
      if (this.score >= 10000 && !this.voicePlaying) {
        this.voice = this.setAudio(this.s10000Audio, 1);
        this.voicePlaying = true;
        this.voice.addEventListener('ended', () => {
          this.voicePlaying = false;
        });
        this.voice.play();
        this.b10000complete = true;
        this.b1000complete = true;
        this.b100complete = true;
      }
    }

    if (!this.b1000complete) {
      if (this.score >= 1000 && !this.voicePlaying) {
        this.voice = this.setAudio(this.s1000Audio, 1);
        this.voicePlaying = true;
        this.voice.addEventListener('ended', () => {
          this.voicePlaying = false;
        });
        this.voice.play();
        this.b1000complete = true;
        this.b100complete = true;
      }
    }

    if (!this.b100complete) {
      if (this.score >= 100 && !this.voicePlaying) {
        this.voice = this.setAudio(this.s100Audio, 1);
        this.voicePlaying = true;
        this.voice.addEventListener('ended', () => {
          this.voicePlaying = false;
        });
        this.voice.play();
        this.b100complete = true;
      }
    }
    
    this.soundEffect.play();
  }

  advanceLevel() {
    this.level++;
    this.levelDisplay.innerHTML = this.level;
    this.timer -= (10/100) * this.timer;
    clearInterval(this.timerId);
    this.timerId = window.setInterval(this.mainGameLoop.bind(this), this.timer);
  }

  setAudio(path: string, volume: number = 1, loop: boolean = false) {
    let file: HTMLAudioElement;
    file = new Audio(path);
    file.volume = volume;
    file.loop = loop;
    return file;
  }

  /////////////////////////////////////////////////////////////////////////////////
  // BUTTONS
  initDropButton() {  // implemented not as a button
    this.previewGrid_asButton = document.querySelector("#drop-button");
  }

  initSettingsButton() {
    this.settingsButton = document.querySelector('#settings-button');
  }

  initInfoButton() {
    this.infoButton = document.querySelector('#info-button');
  }

  initStartPauseButton() {
    this.startPauseButton = document.querySelector('#start-pause-button');
  }

  initMoveButtons() {
    this.rotateButton = document.querySelector('#rotate-button');
    this.moveDownButton = document.querySelector('#move-down-button');
    this.moveLeftButton = document.querySelector('#move-left-button');
    this.moveRightButton = document.querySelector('#move-right-button');
  }

  addButtonListeners() {
    this.previewGrid_asButton.addEventListener('click', this.handleClick_drop);
    this.settingsButton.addEventListener('click', this.handleClick_settings);
    this.infoButton.addEventListener('click', this.handleClick_info);
    this.startPauseButton.addEventListener('click', this.handleClick_startPause);
    this.rotateButton.addEventListener('click', this.handleClick_rotate);
    this.moveDownButton.addEventListener('click', this.handleClick_moveDown);
    this.moveLeftButton.addEventListener('click', this.handleClick_moveLeft);
    this.moveRightButton.addEventListener('click', this.handleClick_moveRight);

    document.addEventListener('keyup', this.getUserInput);
  }

  removeButtonListeners() {
    this.previewGrid_asButton.removeEventListener('click', this.handleClick_drop);
    this.rotateButton.removeEventListener('click', this.handleClick_rotate);
    this.moveDownButton.removeEventListener('click', this.handleClick_moveDown);
    this.moveLeftButton.removeEventListener('click', this.handleClick_moveLeft);
    this.moveRightButton.removeEventListener('click', this.handleClick_moveRight);

    document.removeEventListener('keyup', this.getUserInput);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // SWIPE GESTURES
  ionViewDidEnter() {
    const swipeArea = document.querySelector('#swipe-area');
    this.swipeGesture = this.gestureCtrl.create({
      el: swipeArea,
      threshold: 0,
      gestureName: 'swipe',
      direction: 'x',
      onStart: (ev) => {},
      onMove: (ev) => {
        //console.log('ev: ', ev);
      },
      onEnd: (ev) => {
        if (!this.gamePaused) {
          if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
            if (ev.deltaX > 0) {
              this.moveRight();
            } else {
              this.moveLeft();
            }
          } else {
            if (ev.deltaY > 0) {
              this.moveDown();
            } else {
              this.rotate();
            }
          }
        }
      }
    }, true);
  
    this.swipeGesture.enable();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // FUNCTIONS - USER INPUT
  getUserInput(e: KeyboardEvent) { // assign functions to key codes
    if (!this.gamePaused || this.gameIsOver) {
      if (e.key === 'ArrowLeft') {          // left arrow
        this.moveLeft();
      } else if (e.key === 'ArrowRight') {  // right arrow
        this.moveRight();
      } else if (e.key === 'ArrowUp') {     // up arrow
        this.rotate();
      } else if (e.key === 'Escape') {      // escape key
        this.gamePaused = !this.gamePaused;
        this.pauseGame(this.gamePaused);
      } else if (e.key === 'Enter') {       // enter key
        if (this.gamePaused) this.pauseGame(false);
      } else if (e.key === 'Control') {     // control key
        this.drop();
      };
    };
  }

  moveLeft() { // move tetrolino left until edge of screen
    this.undraw();
    const isAtLeftEdge = this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === 0);
    if (!isAtLeftEdge) {
      this.currentPosition -= 1;
    };
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.currentPosition += 1;
    };
    this.draw();
  }

  moveRight() { // move tetrolino right until edge of screen
  this.undraw();
    const isAtRightEdge = this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === this.width_squareGrid - 1);
    if (!isAtRightEdge) {
      this.currentPosition += 1;
    };
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.currentPosition -= 1;
    };
    this.draw();
  }

  moveDown() {  // move tetrolino down faster
    this.advanceTetrolinoDownward();
    this.moveDownBonus++;
  }

  rotate() {    // rotate the tetrolino
    this.undraw();
    const previousRotation = this.currentRotation;  // store previous rotation
    this.currentRotation++;                         // advance to the next rotation
    if (this.currentRotation === this.currentTetrolino.length) {
      this.currentRotation = 0;                     // reset index to zero (first rotation)
    }
    this.currentTetrolino = this.selectedTetrolino[this.currentRotation];
    const isValid = this.checkRotatedPosition();
    if (isValid) {
      this.draw();
    } else {
      this.currentRotation = previousRotation;      // reset to previous rotation
      this.currentTetrolino = this.selectedTetrolino[this.currentRotation];
      this.draw();
    }
  }

  drop() {
    for (let i = 0; i < 20; i++) {
      if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index + this.width_squareGrid].classList.contains('solid')))  break;
      this.advanceTetrolinoDownward();
    }
    this.moveDownBonus += this.dropDownBonus;
  }

  showSettings() {
    clearInterval(this.timerId);
    this.backgroundMusic.volume = this.settingsVolume;
    this.backgroundMusic.playbackRate = this.normalPlaybackRate;
    this.titleDisplay.innerHTML = this.gamePauseString;
    this.settingsAlert();
  }

  showInfo() {
    clearInterval(this.timerId);
    this.backgroundMusic.volume = this.settingsVolume;
    this.backgroundMusic.playbackRate = this.normalPlaybackRate;
    this.titleDisplay.innerHTML = this.gamePauseString;
    this.infoAlert();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // MAIN GAME LOOP
  mainGameLoop() {
    this.advanceTetrolinoDownward();
  }

  pauseGame(b) {
    console.log("gamePaused: " + b);
    if (!b) {
      if (this.toggleAudio) this.backgroundMusic.play();
      this.titleDisplay.innerHTML = this.gameTitleString;
      this.timerId = window.setInterval(this.mainGameLoop.bind(this), this.timer);
    } else {
      this.backgroundMusic.pause();
      clearInterval(this.timerId);
      this.titleDisplay.innerHTML = this.gamePauseString;
      this.gamePausedAlert();
    };
  }

  gameOver() {
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.titleDisplay.innerHTML = this.gameOverString;
      clearInterval(this.timerId);
      this.gameIsOver = true;

      this.backgroundMusic.volume = this.settingsVolume;
      this.backgroundMusic.playbackRate = this.normalPlaybackRate;
      
      this.voice = this.setAudio(this.goodGameAudio);
      this.voice.play();

      this.removeButtonListeners();
      this.newGame();
    };
  }

  restartGame() {
    //window.location.reload();
    window.location.href = '/games/tetrolino/index.html';
  }

  newGame() {
    if (this.initializeGoogleAdmobAds) this.watchAdAlert(); // then restart game
    else this.restartGame();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // ALERTS
  /*async gamePausedAlert() { // simple game paused alert
    const alert = await this.alertController.create({
      header: 'Game Paused',
      //subHeader: 'Important message',
      //message: 'This is an alert!',
      buttons: ['OK']
    });
    await alert.present();
  }*/

  async gamePausedAlert() {
    const alert = await this.alertController.create({
      header: 'Game Paused',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.handlerMessage = 'Resuming game...';
            this.gamePaused = false;
            this.pauseGame(false);
          },
        }
      ]
    });
    await alert.present();
  }

  async restartGameAlert() {
    const alert = await this.alertController.create({
      header: 'Game Over',
      buttons: [
        {
          text: 'New Game',
          handler: () => {
            this.handlerMessage = 'Restarting game...';
            this.restartGame();
          },
        }
      ]
    });
    await alert.present();
  }

  async watchAdAlert() {
    const alert = await this.alertController.create({
      header: 'Tetrolino',
      subHeader: 'by Zen Masters',
      message: 'Tetrolino is free to play. Please take a moment and watch a short ad. Thank you and have fun with this timeless classic!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.handlerMessage = 'Loading Ad...';
            this.backgroundMusic.play();
            this.showRewardAd();
          },
        }
      ],
      backdropDismiss: false  // disable clicking outside of alert
    });
    await alert.present();
  }

  async settingsAlert() {
    const alert = await this.alertController.create({
      header: 'Settings',
      //subHeader: 'by Zen Masters',
      //message: 'Tetrolino. Have fun with this timeless classic!',
      buttons: [
        {
          text: 'New Game',
          handler: () => {
            this.handlerMessage = 'Restarting game...';
            this.newGame();
          },
        },
        {
          text: this.toggleAudio ? this.toggleAudioString_OFF : this.toggleAudioString_ON,
          handler: () => {
            this.handlerMessage = 'Setting audio...';
            this.toggleAudio = !this.toggleAudio;
            this.backgroundMusic.pause();
            if (!this.gamePaused) this.pauseGame(this.gamePaused);
            this.backgroundMusic.volume = this.normalVolume;
            this.backgroundMusic.playbackRate = this.normalPlaybackRate;
          },
        },
        {
          text: this.toggleTheme ? this.toggleTheme_DARK : this.toggleTheme_LIGHT,
          handler: () => {
            this.handlerMessage = 'Setting theme...';
            this.toggleTheme = this.changeTheme(this.toggleTheme);
            if (!this.gamePaused) this.pauseGame(this.gamePaused);
            this.backgroundMusic.volume = this.normalVolume;
            this.backgroundMusic.playbackRate = this.normalPlaybackRate;
          },
        },
        {
          text: 'OK',
          handler: () => {
            this.handlerMessage = 'Exit settings...';
            if (!this.gamePaused) this.pauseGame(this.gamePaused);
            this.backgroundMusic.volume = this.normalVolume;
            this.backgroundMusic.playbackRate = this.normalPlaybackRate;
          },
        }
      ],
      backdropDismiss: false  // disable clicking outside of alert
    });
    await alert.present();
  }

  async infoAlert() {
    const alert = await this.alertController.create({
      header: 'Zen Masters',
      //subHeader: 'Zen Masters Games',
      message: 'Visit us for news and updates:',
      buttons: [
        {
          text: 'Website',
          handler: async () => {
            this.handlerMessage = 'Opening website...';
            this.backgroundMusic.volume = this.normalVolume;
            const url = this.zenmastersURL;
            await Browser.open({ url });
          },
        },
        {
          text: 'Itch.io',
          handler: async () => {
            this.handlerMessage = 'Opening website...';
            this.backgroundMusic.volume = this.normalVolume;
            const url = this.itchioURL;
            await Browser.open({ url });
          },
        },
        {
          text: 'YouTube',
          handler: async () => {
            this.handlerMessage = 'Opening website...';
            this.backgroundMusic.volume = this.normalVolume;
            const url = this.youtubeURL;
            await Browser.open({ url });
          },
        },
        {
          text: 'Twitter',
          handler: async () => {
            this.handlerMessage = 'Opening website...';
            this.backgroundMusic.volume = this.normalVolume;
            const url = this.twitterURL;
            await Browser.open({ url });
          },
        },
        {
          text: 'Newsletter',
          handler: async () => {
            this.handlerMessage = 'Opening website...';
            this.backgroundMusic.volume = this.normalVolume;
            const url = this.newsletterURL;
            await Browser.open({ url });
          },
        },
        {
          text: '<< Back',
          handler: () => {
            this.handlerMessage = 'Exit settings...';
            if (!this.gamePaused) this.pauseGame(this.gamePaused);
            this.backgroundMusic.volume = this.normalVolume;
            this.backgroundMusic.playbackRate = this.normalPlaybackRate;
          },
        }
      ],
      backdropDismiss: false  // disable clicking outside of alert
    });
    await alert.present();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // GOOGLE ADMOB
  async initializeGoogleAdMob() {
    const { status } = await AdMob.trackingAuthorizationStatus();
    console.log(status);

    /*if (status === 'notDetermined') {
      console.log('Display information before ads load first time.');
    }*/

    AdMob.initialize({
      requestTrackingAuthorization: true,
      //testingDevices: ['test_device_code_here'],
      initializeForTesting: this.isTesting
    })
  }

  // BANNER AD
  async showBannerAd(adId) {
    const options: BannerAdOptions = {
      adId,  
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: this.isTesting
    };
    await AdMob.showBanner(options);
  }

  async hideBannerAd() {
    // hide banner, still available
    await AdMob.hideBanner();
  }

  async removeBannerAd() {
    // completely remove banner
    await AdMob.removeBanner();
  }

  // INTERSTITIAL AD
  async showInterstitialAd() {
    if (this.initializeGoogleAdmobAds) await AdMob.showInterstitial();
  }

  async prepareInterstitialAd(adId) {
    const options: AdOptions = {
      adId,
      isTesting: this.isTesting
    };
    await AdMob.prepareInterstitial(options);
  }

  // REWARDED VIDEO AD
  async showRewardAd() {
    if (this.initializeGoogleAdmobAds) {
      AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        (reward: AdMobRewardItem) => {
          // Give the reward
          console.log('Reward: ', reward);
          this.restartGame();
        }
      );
      await AdMob.showRewardVideoAd();
    }
  }

  async prepareRewardAd(adId) {
    const options: RewardAdOptions = {
      adId,
      isTesting: this.isTesting
      //ssv: { ... }
    };
    await AdMob.prepareRewardVideoAd(options);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // THEME FUNCTIONS
  // Returns true if the system-wide theme preference is dark
  isDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  changeTheme(b: boolean): boolean {
    if (b) {
      //document.body.classList.toggle('dark-theme', true);
      document.querySelector('#game-screen').classList.toggle('light-theme', false);
      document.querySelector('#game-screen').classList.toggle('dark-theme', true);

      this.grid.style.backgroundColor = 'black';
    }
    else {
      document.querySelector('#game-screen').classList.toggle('dark-theme', false);
      document.querySelector('#game-screen').classList.toggle('light-theme', true);

      this.grid.style.backgroundColor = 'darkgray';
    }
    return !b;
  }

  /////////////////////////////////////////////////////////////////////////////////
  // TESTING FUNCTIONS
  fnTest() {
    // set this tetrolino for testing
    this.currentTetrolino = this.tetrolinoes[5][0];
  }

}
