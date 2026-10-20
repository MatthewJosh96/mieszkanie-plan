(() => {
  'use strict';
  const panel = document.getElementById('tour-panel');
  const frame = document.getElementById('tour-frame');
  const room = document.getElementById('tour-room');
  const status = document.getElementById('tour-status');
  const external = document.getElementById('tour-external');
  const stage = document.getElementById('tour-stage');
  const fullscreen = document.getElementById('tour-fullscreen');
  const base = 'https://data.sentiovr.com/spaces/57061/space_1792060388/vtour/tour.html';
  let started = false;
  let timer;

  function loadRoom() {
    const url = new URL(base);
    url.searchParams.set('startscene', `scene_scene${room.value}`);
    external.href = url.href;
    status.textContent = 'Wczytywanie spaceru 360°…';
    frame.setAttribute('aria-busy', 'true');
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.textContent = 'Wczytywanie trwa dłużej. Możesz też wybrać „Otwórz osobno”.';
    }, 15000);
    frame.src = url.href;
    started = true;
  }

  frame.addEventListener('load', () => {
    if (!started) return;
    clearTimeout(timer);
    frame.removeAttribute('aria-busy');
    // A cross-origin load event cannot confirm whether the panorama has rendered.
    status.textContent = 'Jeśli widok się nie pojawia, wybierz „Otwórz osobno”.';
  });
  frame.addEventListener('error', () => {
    clearTimeout(timer);
    frame.removeAttribute('aria-busy');
    status.textContent = 'Nie udało się wczytać spaceru. Spróbuj otworzyć go osobno.';
  });
  window.addEventListener('tour-open', () => { if (!started) loadRoom(); });
  room.addEventListener('change', loadRoom);
  if (!stage.requestFullscreen) fullscreen.hidden = true;
  fullscreen.addEventListener('click', async () => {
    try {
      await stage.requestFullscreen();
    } catch {
      status.textContent = 'Pełny ekran jest niedostępny w tej przeglądarce. Możesz otworzyć spacer osobno.';
    }
  });
  document.getElementById('tour-exit-fullscreen').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
  });
  if (!panel.hidden) loadRoom();
})();
