/* Keepsake app: decides what to show.
     ?p=ID         -> a published page (what visitors see)
     ?preview=1    -> the live preview inside the builder
     otherwise     -> the builder (home, editor, publish)                                           */
(function () {
  'use strict';
  const KS = window.KS, u = KS.util, el = u.el, $ = u.$, B = KS.backend;
  const IDS = ['garden', 'birthday', 'wedding', 'wedding-hindu', 'wedding-muslim', 'wedding-christian', 'wedding-modern'];
  const stage = () => $('#stage'), app = () => $('#app');
  let current = null; // the template currently on screen

  function unmount() {
    if (current) { try { current.ctl && current.ctl.destroy(); } catch (_) {} current.music.destroy(); current = null; }
    stage().textContent = ''; stage().className = ''; stage().style.cssText = '';
  }
  async function mountPage(page, opts) {
    const T = await KS.loadTemplate(page.t);
    unmount();
    const music = KS.createMusic(opts.preview ? null : page.m);
    const ctx = { preview: !!opts.preview, music, start: () => music.start() };
    const data = page.d || {};
    document.title = (T.title ? T.title(data) : '') || 'Keepsake';
    current = { music, ctl: T.mount(stage(), data, ctx) };
  }

  /* ---------------- visitor view ---------------- */
  async function viewer(id) {
    stage().append(el('div', { class: 'center' }, 'Opening…'));
    let page = null;
    try {
      if (!B.configured()) throw new Error('setup');
      page = await B.getPage(id);
    } catch (e) {
      stage().textContent = '';
      return stage().append(el('div', { class: 'center' }, e.message === 'setup' ? 'This site is not connected to its database yet.' : 'We could not open this page. Please check your connection and try again.'));
    }
    if (!page || !page.t) { stage().textContent = ''; return stage().append(el('div', { class: 'center' }, 'This page could not be found. The link may be wrong or the page may have been removed.')); }
    try { await mountPage(page, { preview: false }); } catch (e) { stage().textContent = ''; stage().append(el('div', { class: 'center' }, 'Sorry, this page could not be shown.')); }
  }

  /* ---------------- live preview (inside the builder) ---------------- */
  function previewMode() {
    addEventListener('message', async e => {
      const m = e.data; if (e.source !== parent || !m || m.type !== 'ks-render') return;
      const y = scrollY;
      try { await mountPage({ t: m.t, d: m.d, m: m.m }, { preview: !m.live }); if (!m.live) scrollTo(0, y); } catch (_) {}
    });
    parent.postMessage({ type: 'ks-ready' }, '*');
  }

  /* ---------------- builder ---------------- */
  const stripBlobs = v => JSON.parse(JSON.stringify(v, (k, x) => (u.isBlobUrl(x) ? '' : x)));
  const hasBlobs = v => JSON.stringify(v).includes('"blob:');
  let teardown = null;

  async function loadAll() { await Promise.all(IDS.map(id => KS.loadTemplate(id))); }

  function brand() {
    return el('div', { class: 'brand', html: '<svg viewBox="0 0 24 24" fill="none" stroke="#b4475f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9-9.2C1.6 8 4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3 0 5.4 3 4 6.8C19 16.5 12 21 12 21z"/></svg>' }, el('span', {}, 'Keepsake'));
  }

  function home() {
    if (teardown) { teardown(); teardown = null; }
    unmount(); document.title = 'Keepsake: beautiful pages for the people you love'; document.body.className = 'is-app'; window.scrollTo(0, 0);
    const mine = B.myPages();
    const card = id => { const T = KS.templates[id];
      return el('button', { class: 'tcard', type: 'button', onclick: () => { location.hash = '#/new/' + id; } },
        el('div', { class: 'thumb', html: T.thumb || '' }),
        el('div', { class: 'tinfo' }, el('h3', {}, T.name), el('p', {}, T.tagline), el('small', {}, T.for || ''), el('span', { class: 'go' }, 'Start with this →'))); };
    const groups = []; // templates can name a group; the home screen shows one heading and one grid per group
    IDS.forEach(id => { const g = KS.templates[id].group || ''; let x = groups.find(y => y.g === g); if (!x) groups.push(x = { g, ids: [] }); x.ids.push(id); });
    const sections = groups.map(x => el('section', { class: 'grp' }, x.g ? el('h2', {}, x.g) : null, el('div', { class: 'cards' }, x.ids.map(card))));
    app().textContent = '';
    app().append(el('div', { class: 'wrap' },
      el('div', { class: 'top' }, brand()),
      el('section', { class: 'hero' },
        el('h1', { html: 'Make something <em>worth keeping</em>.' }),
        el('p', {}, 'Pick a style, add your words, photos, places, dates and a song. Publish it, and send the link to someone you love.'),
        B.configured() ? null : el('div', { class: 'notice', html: '<b>Publishing is not switched on yet.</b> You can design and preview everything now. To share pages, connect a free Supabase project: open <code>SETUP.md</code> in this folder and follow the steps.' })),
      sections,
      el('section', { class: 'feat' },
        el('div', {}, el('b', {}, 'Your words'), 'Letters, wishes, schedules, all editable.'),
        el('div', {}, el('b', {}, 'Photos and places'), 'Add pictures and a map link for the venue.'),
        el('div', {}, el('b', {}, 'Music'), 'Pick one of ours, upload yours, or paste a YouTube link.'),
        el('div', {}, el('b', {}, 'One short link'), 'Send it anywhere. It opens on any phone.')),
      mine.length ? el('section', { class: 'mine' }, el('h2', {}, 'Your pages'), mine.map(p => myRow(p))) : null,
      el('div', { class: 'foot' }, 'Made with care.')));
  }

  function myRow(p) {
    const T = KS.templates[p.t];
    return el('div', { class: 'mrow' },
      el('div', { class: 'mt' }, el('b', {}, p.title || 'Untitled'), el('small', {}, (T ? T.name : p.t) + ' · ' + new Date(p.created).toLocaleDateString())),
      el('a', { class: 'btn', href: B.pageLink(p.id), target: '_blank', rel: 'noopener' }, 'View'),
      el('button', { class: 'btn', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(B.pageLink(p.id)); u.toast('Link copied'); } catch (_) { u.toast(B.pageLink(p.id)); } } }, 'Copy link'),
      el('button', { class: 'btn', type: 'button', onclick: () => { location.hash = '#/edit/' + p.id; } }, 'Edit'),
      el('button', { class: 'link', type: 'button', onclick: () => { if (confirm('Remove this from your list? The page itself stays online.')) { B.forgetPage(p.id); home(); } } }, 'Remove from list'));
  }

  async function editor(tplId, editing) {
    await loadAll();
    const T = KS.templates[tplId]; if (!T) return (location.hash = '#/');
    if (teardown) { teardown(); teardown = null; }
    unmount(); document.body.className = 'is-app'; window.scrollTo(0, 0); document.title = 'Editing: ' + T.name;

    const blankMusic = () => Object.assign({ type: 'none', id: '', src: '', name: '' }, u.clone(T.defaultMusic || {}));
    const draftKey = 'ks.draft.' + T.id;
    let data, music, restored = false;
    if (editing) { data = Object.assign(u.clone(T.sample), editing.page.d || {}); music = Object.assign(blankMusic(), editing.page.m || {}); }
    else {
      try { const dr = JSON.parse(localStorage.getItem(draftKey) || 'null'); if (dr && dr.d) { data = Object.assign(u.clone(T.sample), dr.d); music = Object.assign(blankMusic(), dr.m || {}); restored = true; } } catch (_) {}
      if (!data) { data = u.clone(T.sample); music = blankMusic(); }
    }

    if (T.migrate) T.migrate(data); // lets a template upgrade fields saved by an older version

    /* preview iframe */
    let ready = false, live = false, timer = 0, saveT = 0;
    const iframe = el('iframe', { src: location.pathname + '?preview=1', title: 'Preview' });
    const send = () => { if (ready && !live) iframe.contentWindow.postMessage({ type: 'ks-render', t: T.id, d: data, m: music, live: false }, '*'); };
    const onMsg = e => { if (e.source === iframe.contentWindow && e.data && e.data.type === 'ks-ready') { ready = true; send(); } };
    addEventListener('message', onMsg);
    const changed = () => {
      clearTimeout(timer); timer = setTimeout(send, 220);
      if (!editing) { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify({ d: stripBlobs(data), m: stripBlobs(music) })); } catch (_) {} }, 700); }
    };

    /* layout */
    const formHost = el('div'), musicHost = el('div');
    const liveBtn = el('button', { type: 'button', class: 'btn', onclick: () => {
      live = !live; liveBtn.textContent = live ? '■ Stop' : '▶ Play as a visitor';
      if (live) iframe.contentWindow.postMessage({ type: 'ks-render', t: T.id, d: data, m: music, live: true }, '*'); else send();
    } }, '▶ Play as a visitor');
    const frame = el('div', { class: 'pvframe' }, iframe);
    const dev = el('div', { class: 'seg dev' }, ['Phone', 'Desktop'].map((n, i) => el('button', { type: 'button', 'aria-pressed': String(i === 0), onclick: e => {
      frame.classList.toggle('desktop', i === 1); [...e.target.parentNode.children].forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    } }, n)));
    const tabs = el('div', { class: 'tabs', role: 'tablist' }, ['edit', 'preview'].map(t => el('button', { role: 'tab', type: 'button', 'aria-selected': String(t === 'edit'), onclick: e => {
      root.dataset.tab = t; [...tabs.children].forEach(b => b.setAttribute('aria-selected', String(b === e.currentTarget)));
    } }, t === 'edit' ? 'Edit' : 'Preview')));
    const pubBtn = el('button', { type: 'button', class: 'btn primary', onclick: () => publish() }, editing ? 'Save changes' : 'Publish');
    const root = el('div', { class: 'ed', 'data-tab': 'edit' },
      el('div', { class: 'ed-top' },
        el('button', { type: 'button', class: 'btn ghost', onclick: () => { if (confirm('Leave the editor? Your work is saved as a draft on this device (photos and songs will need adding again).')) location.hash = '#/'; } }, '← Back'),
        el('div', { class: 'ttl' }, T.name, el('small', {}, editing ? 'editing a published page' : 'draft saved automatically')), tabs, pubBtn),
      el('div', { class: 'ed-main' },
        el('div', { class: 'ed-form' },
          restored ? el('div', { class: 'draftbar' }, el('span', {}, 'Restored your last draft.'), el('button', { class: 'link', type: 'button', onclick: () => { try { localStorage.removeItem(draftKey); } catch (_) {} editor(tplId); } }, 'Start over')) : null,
          formHost, el('details', { class: 'sec' }, el('summary', {}, 'Music'), el('div', { class: 'secbody' }, musicHost))),
        el('div', { class: 'ed-pv' }, el('div', { class: 'pvbar' }, dev, liveBtn, el('button', { class: 'btn ghost', type: 'button', onclick: () => { ready && (live = false, liveBtn.textContent = '▶ Play as a visitor', send()); } }, '↻ Refresh')), el('div', { class: 'pvstage' }, frame))));
    app().textContent = ''; app().append(root);

    KS.buildEditor(formHost, T.schema, data, changed);
    const me = KS.buildMusicEditor(musicHost, music, changed);
    teardown = () => { removeEventListener('message', onMsg); clearTimeout(timer); clearTimeout(saveT); me.stop(); };

    /* publishing */
    async function publish() {
      const ov = el('div', { class: 'ov' }), dlg = el('div', { class: 'dlg', role: 'dialog', 'aria-modal': 'true' }); ov.append(dlg); document.body.append(ov);
      const close = () => ov.remove();
      const show = (...kids) => { dlg.textContent = ''; dlg.append(...kids); };

      if (!B.configured()) {
        return show(el('h2', {}, 'One setup step left'), el('p', {}, 'Publishing needs a free Supabase project to store your page, photos and song. It takes about five minutes.'),
          el('p', { html: 'Open <code>SETUP.md</code> in your project folder and follow the steps, then come back. Your draft is saved.' }), el('div', { class: 'dact' }, el('button', { class: 'btn primary', type: 'button', onclick: close }, 'OK')));
      }
      const payload = { v: 1, t: T.id, d: u.clone(data), m: u.clone(music) };
      if (payload.m.type === 'upload' && !payload.m.src) payload.m = { type: 'none' };
      if (payload.m.type === 'youtube' && !u.youtubeId(payload.m.src)) payload.m = { type: 'none' };
      if (payload.m.type === 'library' && !KS.trackOf(payload.m.id)) payload.m = { type: 'none' };
      if (payload.m.type === 'none') payload.m = { type: 'none' };

      const bar = el('i'), msg = el('p', {}, 'Getting things ready…');
      show(el('h2', {}, editing ? 'Saving your page…' : 'Publishing…'), msg, el('div', { class: 'bar' }, bar));
      try {
        const id = editing ? editing.id : B.newId(), key = editing ? editing.key : B.newKey();
        const out = await B.uploadBlobs(payload, id, (d, n) => { msg.textContent = n ? 'Uploading photos and music (' + d + ' of ' + n + ')…' : 'Saving…'; bar.style.width = (n ? Math.round(d / n * 80) : 30) + '%'; });
        if (JSON.stringify(out).length > 280000) throw new Error('There is too much text on this page. Try shortening it.');
        msg.textContent = 'Saving…'; bar.style.width = '92%';
        if (editing) await B.updatePage(id, key, out); else await B.createPage(id, key, out);
        bar.style.width = '100%';
        B.rememberPage({ id, key, t: T.id, title: T.title ? T.title(out.d) : T.name, created: Date.now() });
        if (!editing) { try { localStorage.removeItem(draftKey); } catch (_) {} editing = { id, key, page: out }; pubBtn.textContent = 'Save changes'; }
        // published pictures now have permanent addresses: use them in the editor from here on
        Object.keys(out.d).forEach(k => { if (JSON.stringify(out.d[k]) !== JSON.stringify(data[k]) && hasBlobs(data[k])) data[k] = out.d[k]; });
        if (out.m && out.m.src && u.isBlobUrl(music.src)) music.src = out.m.src;
        const link = B.pageLink(id);
        const box = el('input', { type: 'text', readonly: true, value: link, 'aria-label': 'Your link' }); box.addEventListener('focus', () => box.select());
        show(el('h2', {}, 'It is live ✨'), el('p', {}, 'Send this link to anyone. It opens on any phone or computer.'),
          el('div', { class: 'linkbox' }, box, el('button', { class: 'btn primary', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(link); u.toast('Link copied'); } catch (_) { box.select(); u.toast('Press Cmd/Ctrl+C to copy'); } } }, 'Copy')),
          el('div', { class: 'dact' },
            el('a', { class: 'btn', href: link, target: '_blank', rel: 'noopener' }, 'Open it'),
            navigator.share ? el('button', { class: 'btn', type: 'button', onclick: () => navigator.share({ title: document.title, url: link }).catch(() => {}) }, 'Share…') : null,
            el('button', { class: 'btn ghost', type: 'button', onclick: close }, 'Keep editing'),
            el('button', { class: 'btn ghost', type: 'button', onclick: () => { close(); location.hash = '#/'; } }, 'Done')),
          el('p', { class: 'help', style: 'margin-top:14px' }, 'You can come back and fix or change anything from "Your pages" on the home screen, on this device.'));
      } catch (e) {
        show(el('h2', {}, 'That did not work'), el('p', { class: 'err' }, e.message || 'Something went wrong.'), el('p', {}, 'Your work is still here. Check your connection and try again.'),
          el('div', { class: 'dact' }, el('button', { class: 'btn primary', type: 'button', onclick: () => { close(); publish(); } }, 'Try again'), el('button', { class: 'btn ghost', type: 'button', onclick: close }, 'Close')));
      }
    }
  }

  async function route() {
    const h = location.hash.replace(/^#\/?/, '').split('/');
    await loadAll();
    if (h[0] === 'new' && KS.templates[h[1]]) return editor(h[1]);
    if (h[0] === 'edit' && h[1]) {
      const rec = B.myPages().find(p => p.id === h[1]);
      if (!rec) { u.toast('You can only edit pages made on this device.'); location.hash = '#/'; return; }
      try { const page = await B.getPage(rec.id); if (!page) throw new Error('missing'); return editor(page.t, { id: rec.id, key: rec.key, page }); }
      catch (_) { u.toast('Could not load that page right now.'); location.hash = '#/'; return; }
    }
    home();
  }

  /* ---------------- boot ---------------- */
  function boot() {
    const q = new URLSearchParams(location.search);
    if (q.has('p')) return viewer(q.get('p'));
    if (q.has('preview')) return previewMode();
    u.font('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
    document.body.classList.add('is-app');
    addEventListener('hashchange', route);
    route();
  }
  boot();
})();
