/* Overflowism immersive gallery. Vanilla JS, no tracking or external runtime dependencies. */
(function () {
  'use strict';
  const atlas = window.OVERFLOW_ATLAS;
  const gallery = window.galleryData || {};
  if (!atlas) return;
  const $ = selector => document.querySelector(selector);
  const worlds = new Map(atlas.worlds.map(w => [w.id, w]));
  const rooms = new Map(atlas.rooms.map(r => [r.id, r]));
  const allScreens = [...document.querySelectorAll('[data-screen]')];
  const roomPositions = new Map(atlas.rooms.map((room, index) => [room.id, index]));
  let chosenEntry = 2;
  let currentRoomId = 'the-mirror';
  let atlasFilter = 'all';
  let lastArtworkTrigger = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function anchor(label, href, className) {
    const a = make('a', className, label);
    a.href = href;
    return a;
  }
  function theme(node, world) {
    node.style.setProperty('--world-dark', world.colors[0]);
    node.style.setProperty('--world-mid', world.colors[1]);
    node.style.setProperty('--world-light', world.colors[2]);
  }
  function nameOf(id) { return rooms.get(id)?.name || id; }

  const entryChoices = $('#entrance-choices');
  const entryAction = $('#enter-choice');
  atlas.pathways.forEach((item, index) => {
    const button = make('button', 'entry-option');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === chosenEntry));
    button.textContent = item.label;
    const detail = make('small', null, item.detail);
    detail.hidden = index !== chosenEntry;
    button.append(detail);
    button.addEventListener('click', () => {
      chosenEntry = index;
      [...entryChoices.children].forEach((el, i) => {
        el.setAttribute('aria-pressed', String(i === index));
        el.querySelector('small').hidden = i !== index;
      });
      entryAction.href = '#room/' + item.room;
    });
    entryChoices.append(button);
  });
  entryAction.href = '#room/' + atlas.pathways[chosenEntry].room;

  const worldGrid = $('#world-grid');
  atlas.worlds.filter(w => w.id !== 'undercurrent').forEach((world, index) => {
    const card = anchor('', '#world/' + world.id, 'world-card');
    theme(card, world);
    card.append(
      make('span', 'world-card-index', 'WORLD 0' + (index + 1)),
      make('span', 'world-card-symbol', world.symbol)
    );
    const bottom = make('div', 'world-card-bottom');
    bottom.append(
      make('div', 'world-card-name', world.name),
      make('div', 'world-card-desc', world.label)
    );
    const cta = make('div', 'world-card-cta');
    cta.append(make('span', null, 'STEP INSIDE'), make('span', null, '↗'));
    bottom.append(cta);
    card.append(bottom);
    worldGrid.append(card);
  });

  function renderWorld(id) {
    const world = worlds.get(id);
    if (!world) return false;
    theme($('#world-hero'), world);
    $('#world-label').textContent = world.label.toUpperCase();
    $('#world-title').textContent = world.name;
    $('#world-line').textContent = world.line;
    $('#world-symbol').textContent = world.symbol;
    const matching = atlas.rooms.filter(r => r.world === id);
    $('#world-count').textContent = matching.length + ' ROOMS TO DISCOVER';
    const target = $('#room-grid');
    target.replaceChildren();
    matching.forEach((room, index) => {
      const card = anchor('', '#room/' + room.id, 'room-card');
      theme(card, world);
      const top = make('div', 'room-card-top');
      top.append(make('span', null, 'ROOM ' + String(index + 1).padStart(2, '0')),
        make('span', null, atlas.firstChapter.includes(room.id) ? '✳ FIRST CHAPTER' : '↗'));
      card.append(top, make('h3', null, room.name), make('p', null, room.quote));
      const foot = make('div', 'room-card-footer');
      foot.append(make('span', null, room.feelings.slice(0, 2).join(' · ')),
        make('span', null, '↗'));
      card.append(foot);
      target.append(card);
    });
    return true;
  }

  function matchingArt(room) {
    if (room.id !== 'fairy-tale-forest' && room.id !== 'butterfly-garden-walkway') return null;
    return (gallery.artworks || []).find(art => !art.placeholder && art.title === 'Untitled') || null;
  }


  // Physical scene dressing is generated in one place; rooms keep the same navigation model.
  // Decorative elements are hidden from assistive technology and disabled by reduced motion.
  function decorateRoom(room, world) {
    const stage = $('#installation');
    stage.dataset.world = world.id;
    stage.dataset.scene = room.id;
    const prior = stage.querySelector('.scene-environment');
    if (prior) prior.remove();
    const env = make('div', 'scene-environment');
    env.setAttribute('aria-hidden', 'true');
    if (world.id === 'bloom') {
      env.append(make('span', 'scene-sky'), make('span', 'scene-sun'),
        make('span', 'scene-mountain mountain-back'), make('span', 'scene-mountain mountain-front'),
        make('span', 'scene-earth'), make('span', 'scene-garden-path'));
      for (let i = 0; i < 33; i++) {
        const blossom = make('span', 'scene-blossom', i % 4 === 0 ? '✼' : i % 3 === 0 ? '✿' : '❀');
        blossom.style.setProperty('--idx', i);
        blossom.style.setProperty('--pos', ((i * 37 + 7) % 102) + '%');
        blossom.style.setProperty('--scale', (0.65 + (i % 5) * .19).toFixed(2));
        blossom.style.setProperty('--delay', (i % 8 * -.73).toFixed(2) + 's');
        env.append(blossom);
      }
      for (let i = 0; i < 7; i++) {
        const butterfly = make('span', 'scene-wing');
        butterfly.style.setProperty('--idx', i);
        butterfly.style.setProperty('--pos', (8 + ((i * 17) % 85)) + '%');
        butterfly.style.setProperty('--high', (18 + ((i * 29) % 38)) + '%');
        butterfly.style.setProperty('--delay', (i * -1.4) + 's');
        env.append(butterfly);
      }
      if (room.id === 'fairy-tale-forest') {
        env.append(make('span', 'scene-tree tree-left'), make('span', 'scene-tree tree-right'));
      }
    } else if (world.id === 'noise') {
      for (let i = 0; i < 20; i++) {
        const line = make('span', 'scene-thought');
        line.style.setProperty('--idx', i);
        line.style.setProperty('--pos', ((i * 41 + 9) % 100) + '%');
        line.style.setProperty('--high', ((i * 31 + 7) % 90) + '%');
        env.append(line);
      }
    } else if (world.id === 'heart') {
      for (let i = 0; i < 14; i++) {
        const petal = make('span', 'scene-heart-petal', i % 3 === 0 ? '✧' : '❦');
        petal.style.setProperty('--idx', i);
        petal.style.setProperty('--pos', ((i * 31 + 11) % 100) + '%');
        env.append(petal);
      }
    } else if (world.id === 'watchers') {
      for (let i = 0; i < 5; i++) {
        const mirror = make('span', 'scene-mirror');
        mirror.style.setProperty('--idx', i);
        env.append(mirror);
      }
    } else {
      env.append(make('span', 'scene-water'));
    }
    stage.prepend(env);
  }

  // Pointer-responsive viewpoint: ambient parallax rather than forced scrolling.
  // Mouse movement never changes the focused element, keyboard route or artwork.
  function enableViewpoint() {
    const entry = $('#entrance');
    entry.addEventListener('pointermove', event => {
      if (document.documentElement.classList.contains('motion-off') || event.pointerType === 'touch') return;
      const rect = entry.getBoundingClientRect();
      entry.style.setProperty('--look-x', (((event.clientX - rect.left) / rect.width - .5) * 26).toFixed(1) + 'px');
      entry.style.setProperty('--look-y', (((event.clientY - rect.top) / rect.height - .5) * 16).toFixed(1) + 'px');
    }, { passive: true });
    entry.addEventListener('pointerleave', () => {
      entry.style.setProperty('--look-x', '0px');
      entry.style.setProperty('--look-y', '0px');
    });
  }
  enableViewpoint();

  function renderRoom(id) {
    const room = rooms.get(id);
    if (!room) return false;
    currentRoomId = id;
    const world = worlds.get(room.world);
    const installation = $('#installation');
    theme(installation, world);
    decorateRoom(room, world);
    $('#room-back').href = '#world/' + world.id;
    $('#room-position').textContent = world.name + ' / ROOM ' + String(atlas.rooms.filter(r => r.world === world.id).findIndex(r => r.id === id) + 1).padStart(2, '0');
    $('#room-title').textContent = room.name;
    $('#room-quote').textContent = '“' + room.quote + '”';
    $('#room-emblem').textContent = world.symbol;
    const feelings = $('#room-feelings');
    feelings.replaceChildren();
    room.feelings.forEach(feeling => feelings.append(make('span', 'feeling-chip', feeling)));
    const art = matchingArt(room);
    const imageRoot = $('#frame-image');
    imageRoot.replaceChildren();
    if (art) {
      const img = make('img');
      img.src = art.image;
      img.alt = art.alt;
      img.loading = 'lazy';
      imageRoot.append(img);
      $('#frame-label').textContent = art.title.toUpperCase() + ' · ORIGINAL PAINTING';
      $('#look-art').setAttribute('aria-label', 'View original painting ' + art.title);
    } else {
      imageRoot.append(make('span', 'placeholder-paint'));
      $('#frame-label').textContent = 'ARTWORK SPACE · COMING SOON';
      $('#look-art').setAttribute('aria-label', 'Explore artwork placeholder in ' + room.name);
    }
    const portals = $('#portal-links');
    portals.replaceChildren();
    const neighbors = [...new Set([...(atlas.links[id] || []), ...atlas.rooms.filter(r => (atlas.links[r.id] || []).includes(id)).map(r => r.id)])]
      .filter(other => rooms.has(other) && other !== id).slice(0, 4);
    const fallback = atlas.rooms.filter(r => r.world === room.world && r.id !== id).slice(0, 3).map(r => r.id);
    (neighbors.length ? neighbors : fallback).forEach(other => portals.append(anchor(nameOf(other) + ' ↗', '#room/' + other, 'portal-link')));
    const inWorld = atlas.rooms.filter(r => r.world === room.world);
    const index = inWorld.findIndex(r => r.id === id);
    $('#room-previous').href = '#room/' + inWorld[(index - 1 + inWorld.length) % inWorld.length].id;
    $('#room-next').href = '#room/' + inWorld[(index + 1) % inWorld.length].id;
    $('#room-previous').textContent = '← ' + inWorld[(index - 1 + inWorld.length) % inWorld.length].name.toUpperCase();
    $('#room-next').textContent = inWorld[(index + 1) % inWorld.length].name.toUpperCase() + ' →';
    return true;
  }

  function renderAtlas() {
    const search = $('#atlas-search').value.trim().toLowerCase();
    const filtered = atlas.rooms.filter(room =>
      (atlasFilter === 'all' || room.world === atlasFilter) &&
      [room.name, room.quote, ...room.feelings, worlds.get(room.world).name].join(' ').toLowerCase().includes(search));
    $('#atlas-count').textContent = filtered.length + ' ROOMS FOUND';
    const results = $('#atlas-results');
    results.replaceChildren();
    if (!filtered.length) {
      results.append(make('p', null, 'No rooms found. Try a different feeling.'));
      return;
    }
    filtered.forEach(room => {
      const card = anchor('', '#room/' + room.id, 'atlas-result');
      card.append(make('span', null, worlds.get(room.world).name),
        make('h3', null, room.name), make('p', null, room.feelings.join(' · ')));
      results.append(card);
    });
  }
  const atlasFilters = $('#atlas-filters');
  [{ id: 'all', name: 'ALL WORLDS' }, ...atlas.worlds].forEach(world => {
    const button = make('button', 'filter-button', world.name);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(world.id === atlasFilter));
    button.addEventListener('click', () => {
      atlasFilter = world.id;
      [...atlasFilters.children].forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      renderAtlas();
    });
    atlasFilters.append(button);
  });
  $('#atlas-search').addEventListener('input', renderAtlas);
  renderAtlas();

  const dialog = $('#art-dialog');
  $('#look-art').addEventListener('click', event => {
    lastArtworkTrigger = event.currentTarget;
    const room = rooms.get(currentRoomId);
    const art = matchingArt(room);
    const visual = $('#dialog-visual');
    visual.replaceChildren();
    if (art) {
      const img = make('img');
      img.src = art.image;
      img.alt = art.alt;
      visual.append(img);
      $('#art-dialog-title').textContent = art.title;
      $('#dialog-description').textContent = art.description;
      $('#dialog-details').textContent = art.details;
      $('#dialog-inquire').hidden = false;
      $('#dialog-inquire').href = 'mailto:' + encodeURIComponent(gallery.contactEmail || 'hello@overflowism.com') + '?subject=' + encodeURIComponent('Artwork inquiry: ' + art.title);
    } else {
      visual.append(make('div', 'dialog-placeholder'));
      $('#art-dialog-title').textContent = room.name;
      $('#dialog-description').textContent = 'This frame is waiting for an original Overflowism painting. The emotional room is already here; the art will arrive as the collection grows.';
      $('#dialog-details').textContent = 'PLACEHOLDER ARTWORK · ' + worlds.get(room.world).name;
      $('#dialog-inquire').hidden = true;
    }
    dialog.showModal();
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (lastArtworkTrigger && !$('#room-screen').hidden) lastArtworkTrigger.focus();
  });

  const motionButton = $('#motion-toggle');
  function applyMotion(off) {
    document.documentElement.classList.toggle('motion-off', off);
    motionButton.setAttribute('aria-pressed', String(off));
    $('#motion-label').textContent = off ? 'RESUME MOTION' : 'PAUSE MOTION';
    motionButton.title = off ? 'Turn animations on' : 'Turn animations off';
  }
  let motionOverride = false;
  applyMotion(reduceMotion.matches);
  motionButton.addEventListener('click', () => {
    motionOverride = true;
    applyMotion(!document.documentElement.classList.contains('motion-off'));
  });
  reduceMotion.addEventListener?.('change', event => { if (!motionOverride) applyMotion(event.matches); });

  function navigate() {
    const route = decodeURIComponent(location.hash.slice(1) || 'entrance');
    const [prefix, id] = route.split('/');
    let selected;
    if (prefix === 'entrance' || prefix === 'home') selected = 'entrance';
    else if (prefix === 'atrium' || prefix === 'gallery') selected = 'atrium';
    else if (prefix === 'atlas') selected = 'atlas';
    else if (prefix === 'about') selected = 'about';
    else if (prefix === 'world' && renderWorld(id)) selected = 'world';
    else if (prefix === 'room' && renderRoom(id)) selected = 'room';
    else selected = 'entrance';
    allScreens.forEach(screen => { screen.hidden = screen.dataset.screen !== selected; });
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === selected || (selected === 'world' && link.dataset.nav === 'atrium') || (selected === 'room' && link.dataset.nav === 'atrium');
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (dialog.open) dialog.close();
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = (selected === 'room' ? nameOf(currentRoomId) + ' — ' : selected === 'world' ? worlds.get(id).name + ' — ' : '') + 'Overflowism';
  }
  window.addEventListener('hashchange', navigate);
  navigate();
})();
