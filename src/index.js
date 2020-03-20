import Phaser from "phaser";

import SceneHome from './scenes/home';
import SceneBattle from './scenes/battle.js';

import {
  WIDTH,
  HEIGHT
} from './configs/game';


const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#ffe',
  // scene: {
  //   preload: preload,
  //   create: create
  // }
  scene: [
    SceneHome,
    SceneBattle
  ]
};

const game = new Phaser.Game(config);