//Based of an example from PIXI.

(async () => {
  // This creates all the visuals that are from pixi.
  const app = new PIXI.Application();

  // Does so it gets as big as the website window, the visuals from pixi.
  await app.init({ resizeTo: window });

  // Shows the visuals on the website.
  document.body.appendChild(app.canvas);

  // Shows the star from pixi which also are all the stars.
  const starTexture = await PIXI.Assets.load('https://pixijs.com/assets/star.png');

  // this is the settings for how the star is actually shown on the website, like speed and how many they are for example.
  const starAmount = 1800;
  let cameraZ = 0;
  const fov = 25;
  const baseSpeed = 0.020;
  let speed = 1;
  let warpSpeed = 0;
  const starStretch = 8;
  const starBaseSize = 0.05;

  // Saves the stars.
  const stars = [];

  // A loop for the stars that creates them and positioning.
  for (let i = 0; i < starAmount; i++) {
    const star = {
      sprite: new PIXI.Sprite(starTexture),
      z: 0,
      x: 0,
      y: 0,
    };

    // Where the middle is, creates the random position and makes it show.
    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true);
    app.stage.addChild(star.sprite);
    stars.push(star);
  }

 // Makes it look different by randomizing the stars so it creates the vibe of floating away.
  function randomizeStar(star, initial) {
    star.z = initial
      ? Math.random() * 2000
      : cameraZ + Math.random() * 1000 + 2000;

  
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;

    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
  }

  // Makes it so you can hold the mouse button for the input of the stars going in a faster speed.
  window.addEventListener('pointerdown', () => { warpSpeed = 1; });
  window.addEventListener('pointerup', () => { warpSpeed = 0; });

  // The same with the spacebar.
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); warpSpeed = 1; }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') { warpSpeed = 0; }
  });

  // Makes the speed of the stars switch smoothly, speed up and speed down.
  app.ticker.add((time) => {
    
    speed += (warpSpeed - speed) / 30;

    // Makes the stars go forward.
    cameraZ += time.deltaTime * 10 * (speed + baseSpeed);

    // Updates each star.
    for (let i = 0; i < starAmount; i++) {
      const star = stars[i];

    // Updates so if it goes by it and gets back to the start where it comes again.
      if (star.z < cameraZ) randomizeStar(star);

      // Where the star is at the moment.
      const z = star.z - cameraZ;
    

      // Positions the star depending on where they are.
      star.sprite.x =
        star.x * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.width / 2;
      star.sprite.y =
        star.y * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.height / 2;

      // How far away the stars are from the center.
      const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
      const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
      const distanceCenter = Math.sqrt(
        dxCenter * dxCenter + dyCenter * dyCenter,
      );

      // Size of stars if they are close.
      const distanceScale = Math.max(0, (2000 - z) / 2000);


      //Wideness of the star.
      star.sprite.scale.x = distanceScale * starBaseSize;

      // Does so the stars stretches and become lines when the speed changes.
      star.sprite.scale.y =
        distanceScale * starBaseSize +
        (distanceScale * speed * starStretch * distanceCenter) /
          app.renderer.screen.width;

      //Position of the "lines" the stars become.
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
  });
})();