(() => {
  'use strict';
  const article = document.querySelector('.changes-article');
  if (!article) return;
  const sections = [...article.querySelectorAll('section')];
  const items = [...article.querySelectorAll('.changes-item')];
  const filter = document.getElementById('latest-changes');
  const count = document.getElementById('changes-count');
  const room = document.getElementById('print-room');
  const printButton = document.getElementById('print-changes');
  const feedback = document.getElementById('changes-feedback');
  const originalTitle = document.title;
  let preparing = false;
  let clipboardField;

  sections.forEach(section => {
    room.add(new Option(section.querySelector('h2').textContent, section.id));
  });

  function applyFilter() {
    const onlyLatest = filter.checked;
    items.forEach(item => item.classList.toggle('is-filtered', onlyLatest && !item.dataset.update));
    sections.forEach(section => {
      const empty = !section.querySelector('.changes-item:not(.is-filtered)');
      section.classList.toggle('is-filtered', empty);
      const link = document.querySelector(`.changes-contents a[href="#${section.id}"]`);
      if (link) link.hidden = empty;
      // An introductory paragraph belongs to the whole room, not the latest update.
      [...section.children].forEach(child => {
        if (child.matches('p')) child.classList.toggle('is-filtered', onlyLatest);
      });
    });
    const changed = items.filter(item => item.dataset.update).length;
    count.textContent = onlyLatest ? `${changed} z ${items.length} punktów · aktualizacja 20.10.2026` : `${items.length} punkty · ${changed} nowych lub zmienionych`;
    filter.setAttribute('aria-describedby', 'changes-count');
  }
  filter.addEventListener('change', applyFilter);
  applyFilter();

  function revealLinkedItem() {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (!target?.matches('.changes-item')) return;
    if (target.classList.contains('is-filtered')) {
      filter.checked = false;
      applyFilter();
    }
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', revealLinkedItem);
  revealLinkedItem();

  items.forEach(item => {
    const button = item.querySelector('.copy-change-link');
    button.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.search = '';
      url.hash = item.id;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(url.href);
        clipboardField?.remove();
        button.textContent = 'Link skopiowany';
        setTimeout(() => { button.textContent = 'Kopiuj link'; }, 2500);
        feedback.textContent = 'Skopiowano link do punktu. Możesz go wkleić do wiadomości.';
      } catch {
        clipboardField?.remove();
        clipboardField = document.createElement('input');
        clipboardField.type = 'text';
        clipboardField.readOnly = true;
        clipboardField.className = 'change-link-fallback';
        clipboardField.setAttribute('aria-label', 'Link do punktu — skopiuj adres');
        clipboardField.value = url.href;
        item.querySelector('.changes-item-tools').after(clipboardField);
        clipboardField.focus();
        clipboardField.select();
        feedback.textContent = 'Przeglądarka nie pozwoliła skopiować linku. Skopiuj zaznaczony adres.';
      }
    });
  });

  function clearPrintState() {
    document.body.classList.remove('printing-changes');
    sections.forEach(section => section.classList.remove('print-excluded', 'print-first'));
    document.title = originalTitle;
  }

  function setPrintScope() {
    clearPrintState();
    document.body.classList.add('printing-changes');
    const selected = sections.filter(section => room.value === 'all' || section.id === room.value);
    sections.forEach(section => section.classList.toggle('print-excluded', !selected.includes(section)));
    selected[0]?.classList.add('print-first');
    const label = room.selectedOptions[0].textContent;
    article.querySelector('.changes-print-scope').textContent = label;
    document.title = `Zmiany do projektu — ${label} — 2026-10-20`;
    return selected;
  }

  // Native Ctrl/Cmd+P uses the same clean layout and selected scope.
  window.addEventListener('beforeprint', setPrintScope);
  window.addEventListener('afterprint', clearPrintState);

  printButton.addEventListener('click', async () => {
    if (preparing) return;
    preparing = true;
    printButton.disabled = true;
    room.disabled = true;
    printButton.setAttribute('aria-busy', 'true');
    const selected = sections.filter(section => room.value === 'all' || section.id === room.value);
    const images = selected.flatMap(section => [...section.querySelectorAll('img')]);
    feedback.textContent = `Przygotowuję zdjęcia do wydruku (${images.length})…`;
    try {
      await Promise.all(images.map(image => {
        image.loading = 'eager';
        return image.decode();
      }));
      await document.fonts.ready;
      setPrintScope();
      // Let the browser apply the print scope before opening its dialog.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      feedback.textContent = 'Dokument gotowy. W oknie drukowania możesz wybrać „Zapisz jako PDF”.';
      window.print();
    } catch {
      clearPrintState();
      feedback.textContent = 'Nie udało się wczytać wszystkich zdjęć. Sprawdź połączenie i spróbuj ponownie.';
    } finally {
      preparing = false;
      printButton.disabled = false;
      room.disabled = false;
      printButton.removeAttribute('aria-busy');
    }
  });
})();
