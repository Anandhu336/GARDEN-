/* Template: Wedding invitation. An envelope opens onto an elegant scrolling invitation. */
(function () {
  'use strict';
  const KS = window.KS, u = KS.util, el = u.el, esc = u.esc;

  const THEMES = {
    ivory:    { bg: '#fbf7f0', paper: '#fffdf9', ink: '#3a332c', muted: '#8b7f73', accent: '#b8935a', soft: '#eadfc9', leaf: '#8a9a72', env: '#f1e6d0', env2: '#ead9b9', seal: '#8f2f3b' },
    blush:    { bg: '#fdf1f0', paper: '#fffaf9', ink: '#4a3a3c', muted: '#957f80', accent: '#c4787f', soft: '#f0d6d3', leaf: '#8fa78c', env: '#f7dcda', env2: '#f0c9c6', seal: '#8a3a4a' },
    midnight: { bg: '#10162b', paper: '#171e38', ink: '#efe8d8', muted: '#a8a3b8', accent: '#d9b56a', soft: '#2a3358', leaf: '#6f8c86', env: '#232c4d', env2: '#1c2440', seal: '#a3323f' }
  };

  const CSS = `
  .tpl-wedding{--sc:'Great Vibes',cursive;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Montserrat',system-ui,sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;overflow-x:hidden;font-family:var(--serif)}
  .tpl-wedding *{box-sizing:border-box}
  .tpl-wedding a{color:inherit}
  .w-wrap{width:min(920px,100%);margin:0 auto;padding:0 22px}
  .w-sec{padding:clamp(48px,9vw,96px) 0;position:relative}
  .w-eyebrow{font:500 11.5px var(--sans);letter-spacing:.34em;text-transform:uppercase;color:var(--accent);text-align:center;margin:0 0 14px}
  .w-h2{font:400 clamp(30px,6vw,46px)/1.1 var(--serif);text-align:center;margin:0 0 10px;font-style:italic}
  .w-div{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--accent);margin:18px auto;max-width:280px}
  .w-div::before,.w-div::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--accent))}
  .w-div::after{transform:scaleX(-1)}
  .w-div svg{width:18px;height:18px;flex:none}
  .w-reveal{opacity:0;transform:translateY(22px);transition:opacity 1s ease,transform 1s ease}
  .w-reveal.in{opacity:1;transform:none}
  .is-static .w-reveal{opacity:1;transform:none;transition:none}

  /* hero */
  .w-hero{min-height:100vh;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:70px 22px 90px;position:relative;overflow:hidden;background:
    radial-gradient(70% 50% at 50% 0%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 70%)}
  .w-sprig{position:absolute;width:min(46vw,300px);color:var(--leaf);opacity:.55;pointer-events:none}
  .w-sprig.tl{top:-6px;left:-10px}.w-sprig.br{bottom:-6px;right:-10px;transform:rotate(180deg)}
  .w-sprig.tr{top:-6px;right:-10px;transform:scaleX(-1)}.w-sprig.bl{bottom:-6px;left:-10px;transform:scale(-1,-1)}
  .w-arch{width:min(56vw,250px);aspect-ratio:3/4;border-radius:999px 999px 14px 14px;background:var(--soft) center/cover;border:1px solid var(--accent);padding:0;box-shadow:0 0 0 7px var(--bg),0 0 0 8px var(--accent);margin-bottom:34px}
  .w-top{font:500 11px var(--sans);letter-spacing:.38em;text-transform:uppercase;color:var(--muted);margin:0 0 6px;max-width:420px;line-height:1.9}
  .w-names{font:400 clamp(58px,15vw,118px)/1.05 var(--sc);color:var(--accent);margin:8px 0 2px;display:flex;flex-direction:column;align-items:center}
  .w-names .amp{font:italic 400 clamp(24px,4.6vw,36px)/1 var(--serif);color:var(--muted);margin:10px 0 4px}
  .w-married{font:italic 400 clamp(18px,3.4vw,24px) var(--serif);color:var(--muted);margin:10px 0 22px}
  .w-date{font:500 clamp(12px,2.6vw,15px) var(--sans);letter-spacing:.34em;text-transform:uppercase;border-top:1px solid var(--accent);border-bottom:1px solid var(--accent);padding:13px 22px;display:inline-block}
  .w-place{font:italic 400 19px var(--serif);color:var(--muted);margin-top:16px}
  .w-scroll{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);font:500 10px var(--sans);letter-spacing:.3em;text-transform:uppercase;color:var(--muted);display:flex;flex-direction:column;align-items:center;gap:8px}
  .w-scroll i{width:1px;height:34px;background:linear-gradient(var(--accent),transparent);animation:wdrop 2s ease-in-out infinite}
  @keyframes wdrop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
  .is-static .w-scroll i{animation:none}
  .w-hero .w-in{opacity:0;transform:translateY(18px);animation:win 1.2s ease forwards}
  @keyframes win{to{opacity:1;transform:none}}
  .is-static .w-hero .w-in{animation:none;opacity:1;transform:none}

  /* intro text */
  .w-intro{font:italic 400 clamp(20px,3.6vw,27px)/1.6 var(--serif);text-align:center;max-width:640px;margin:0 auto;color:var(--ink)}

  /* countdown */
  .w-count{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(8px,2vw,16px);max-width:520px;margin:26px auto 0}
  .w-count div{background:var(--paper);border:1px solid var(--soft);border-radius:14px;padding:clamp(12px,3vw,20px) 4px;text-align:center}
  .w-count b{display:block;font:500 clamp(28px,7vw,44px)/1 var(--serif);color:var(--accent)}
  .w-count span{font:500 9.5px var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--muted)}
  .w-big{font:400 clamp(30px,7vw,48px) var(--sc);color:var(--accent);text-align:center;margin-top:20px}

  /* events */
  .w-events{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:22px;margin-top:30px}
  .w-card{background:var(--paper);border:1px solid var(--soft);border-radius:20px;padding:clamp(24px,4vw,34px);text-align:center;position:relative;box-shadow:0 14px 40px color-mix(in srgb,var(--ink) 7%,transparent)}
  .w-card::before{content:'';position:absolute;inset:8px;border:1px solid var(--soft);border-radius:14px;pointer-events:none}
  .w-card h3{font:400 34px var(--sc);color:var(--accent);margin:0 0 6px}
  .w-card .when{font:500 12px var(--sans);letter-spacing:.2em;text-transform:uppercase;margin:8px 0 2px}
  .w-card .day{font:italic 400 18px var(--serif);color:var(--muted);margin:0 0 14px}
  .w-card .venue{font:600 21px var(--serif);margin:0}
  .w-card .addr{font:400 16.5px/1.5 var(--serif);color:var(--muted);margin:4px 0 0}
  .w-card .note{font:italic 400 17px/1.5 var(--serif);margin:14px 0 0;color:var(--ink)}
  .w-map{margin-top:16px;border-radius:12px;overflow:hidden;border:1px solid var(--soft);height:190px}.w-map iframe{width:100%;height:100%;border:0;filter:saturate(.85)}
  .w-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:18px}
  .w-btn{appearance:none;cursor:pointer;text-decoration:none;font:600 11px var(--sans);letter-spacing:.2em;text-transform:uppercase;padding:12px 18px;border-radius:999px;border:1px solid var(--accent);color:var(--accent);background:transparent;transition:all .2s}
  .w-btn:hover{background:var(--accent);color:var(--paper)}
  .w-btn.solid{background:var(--accent);color:var(--paper)}.w-btn.solid:hover{filter:brightness(1.08)}

  /* schedule */
  .w-time{max-width:560px;margin:34px auto 0;position:relative;padding-left:0}
  .w-time::before{content:'';position:absolute;left:50%;top:6px;bottom:6px;width:1px;background:var(--soft)}
  .w-ti{display:grid;grid-template-columns:1fr 26px 1fr;gap:12px;align-items:start;margin-bottom:26px}
  .w-ti .t{text-align:right;font:600 13px var(--sans);letter-spacing:.14em;color:var(--accent);padding-top:3px}
  .w-ti .dot{width:11px;height:11px;border-radius:50%;background:var(--bg);border:2px solid var(--accent);margin:6px auto 0;position:relative;z-index:1}
  .w-ti .x b{display:block;font:600 20px var(--serif)}.w-ti .x span{font:italic 400 16.5px/1.4 var(--serif);color:var(--muted)}
  .w-ti:nth-child(even) .t{order:3;text-align:left}.w-ti:nth-child(even) .x{order:1;text-align:right}.w-ti:nth-child(even) .dot{order:2}

  /* story + gallery */
  .w-story{display:grid;grid-template-columns:1fr;gap:30px;align-items:center}
  .w-story.has-photo{grid-template-columns:1fr 1fr}
  @media(max-width:700px){.w-story.has-photo{grid-template-columns:1fr}}
  .w-story p{font:400 clamp(18px,3vw,21px)/1.75 var(--serif);margin:0 0 1em;white-space:pre-line}
  .w-oval{width:100%;aspect-ratio:4/5;border-radius:999px;background:var(--soft) center/cover;border:1px solid var(--accent);box-shadow:0 0 0 7px var(--bg),0 0 0 8px var(--accent);max-width:340px;margin:0 auto}
  .w-gal{columns:3 200px;column-gap:12px;margin-top:30px}
  .w-gal figure{margin:0 0 12px;break-inside:avoid;cursor:zoom-in;position:relative;overflow:hidden;border-radius:10px;background:var(--soft)}
  .w-gal img{width:100%;display:block;transition:transform .5s}.w-gal figure:hover img{transform:scale(1.04)}
  .w-gal figcaption{font:italic 400 15px var(--serif);padding:8px 10px;color:var(--muted);background:var(--paper)}
  .w-lb{position:fixed;inset:0;z-index:80;background:rgba(10,8,6,.9);display:grid;place-items:center;padding:20px;animation:win .25s ease}
  .w-lb figure{margin:0;max-width:min(94vw,900px);text-align:center}.w-lb img{max-width:100%;max-height:80vh;border-radius:8px}
  .w-lb figcaption{color:#eee;font:italic 400 19px var(--serif);margin-top:12px}
  .w-lb button{position:absolute;appearance:none;border:0;background:rgba(255,255,255,.14);color:#fff;width:46px;height:46px;border-radius:50%;font-size:22px;cursor:pointer}
  .w-lb .x{top:16px;right:16px}.w-lb .p{left:14px;top:50%}.w-lb .n{right:14px;top:50%}

  /* info + rsvp */
  .w-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:16px;margin-top:28px}
  .w-info div{background:var(--paper);border:1px solid var(--soft);border-radius:16px;padding:22px}
  .w-info b{display:block;font:italic 500 23px var(--serif);color:var(--accent);margin-bottom:6px}
  .w-info p{margin:0;font:400 17px/1.6 var(--serif);white-space:pre-line}
  .w-rsvp{background:var(--paper);border:1px solid var(--soft);border-radius:24px;padding:clamp(28px,6vw,52px);text-align:center;max-width:620px;margin:0 auto;position:relative}
  .w-rsvp::before{content:'';position:absolute;inset:8px;border:1px solid var(--soft);border-radius:18px;pointer-events:none}
  .w-rsvp p{font:italic 400 20px/1.6 var(--serif);margin:0 0 6px}
  .w-by{font:600 12px var(--sans)!important;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);font-style:normal!important;margin:10px 0 18px!important}
  .w-close{text-align:center;padding:60px 22px 90px}
  .w-close .sign{font:400 clamp(34px,8vw,58px)/1.2 var(--sc);color:var(--accent);margin:0}
  .w-close .tag{font:500 12px var(--sans);letter-spacing:.3em;text-transform:uppercase;color:var(--muted);margin-top:14px}

  /* envelope */
  .w-env{position:fixed;inset:0;z-index:60;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding:22px;transition:opacity 1s ease,visibility 1s}
  .w-env.gone{opacity:0;visibility:hidden}
  .w-env .hint{font:500 11px var(--sans);letter-spacing:.32em;text-transform:uppercase;color:var(--muted);text-align:center;min-height:16px}
  .w-env h1{font:400 clamp(30px,8vw,46px) var(--sc);color:var(--accent);margin:0;text-align:center}
  .env{width:min(88vw,430px);aspect-ratio:1.5;position:relative;perspective:1100px;filter:drop-shadow(0 22px 30px color-mix(in srgb,var(--ink) 25%,transparent))}
  .env>*{position:absolute}
  .env-back{inset:0;background:var(--env2);border-radius:6px;z-index:1}
  .env-card{left:7%;right:7%;top:9%;bottom:9%;background:var(--paper);border-radius:4px;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px;transition:transform 1.1s cubic-bezier(.3,.7,.2,1) .55s;border:1px solid var(--soft)}
  .env-card b{font:400 clamp(24px,7vw,36px)/1 var(--sc);color:var(--accent)}.env-card span{font:500 8.5px var(--sans);letter-spacing:.3em;text-transform:uppercase;color:var(--muted)}
  .env-front{inset:0;z-index:4;background:var(--env);clip-path:polygon(0 0,50% 54%,100% 0,100% 100%,0 100%);border-radius:6px}
  .env-flap{left:0;right:0;top:0;height:56%;background:var(--env);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top;z-index:5;transition:transform .9s ease,z-index 0s .45s;backface-visibility:visible;filter:brightness(.97)}
  .seal{left:50%;top:54%;width:clamp(58px,15vw,74px);aspect-ratio:1;margin:calc(clamp(58px,15vw,74px)/-2) 0 0 calc(clamp(58px,15vw,74px)/-2);border-radius:50%;z-index:6;cursor:pointer;appearance:none;border:0;padding:0;
    background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--seal) 70%,#fff),var(--seal) 55%,color-mix(in srgb,var(--seal) 70%,#000));box-shadow:0 3px 8px rgba(0,0,0,.35),inset 0 0 0 3px color-mix(in srgb,var(--seal) 80%,#000);color:#f6e7d0;font:400 clamp(22px,6vw,30px) var(--sc);display:grid;place-items:center;transition:transform .3s,opacity .5s;animation:wpulse 2.2s ease-in-out infinite}
  @keyframes wpulse{50%{transform:scale(1.07)}}
  .env.open .env-flap{transform:rotateX(180deg);z-index:2}
  .env.open .env-card{transform:translateY(-62%)}
  .env.open .seal{opacity:0;transform:scale(.5);animation:none;pointer-events:none}
  @media(prefers-reduced-motion:reduce){.w-reveal,.w-hero .w-in{transition:none;animation:none;opacity:1;transform:none}.seal,.w-scroll i{animation:none}}
  `;

  const SPRIG = '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6 8C60 20 110 62 150 130" /><g fill="currentColor" fill-opacity=".22">' +
    [[30, 18, 20, -30], [52, 30, 22, -20], [72, 46, 22, -8], [92, 66, 22, 6], [110, 88, 22, 20], [128, 112, 20, 34], [26, 26, 16, 60], [50, 42, 18, 68], [72, 62, 18, 76], [94, 86, 18, 86], [116, 112, 16, 96]]
      .map(([x, y, l, r]) => `<ellipse cx="${x}" cy="${y}" rx="${l * .32}" ry="${l * .78}" transform="rotate(${r} ${x} ${y}) translate(0 -${l * .6})"/>`).join('') + '</g></svg>';
  const HEART = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9-9.2C1.6 8 4 5 7 5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3 0 5.4 3 4 6.8C19 16.5 12 21 12 21z"/></svg>';
  const divider = () => `<div class="w-div">${HEART}</div>`;

  const inDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  KS.registerTemplate({
    id: 'wedding',
    name: 'Wedding invitation',
    tagline: 'An envelope opens onto an elegant invitation with your story, schedule, maps and RSVP.',
    for: 'Weddings, engagements, anniversaries, vow renewals',
    title: d => (d.name1 || d.name2 ? [d.name1, d.name2].filter(Boolean).join(' & ') + ' are getting married' : 'You are invited'),
    defaultMusic: { type: 'library', id: 'g1' },

    sample: {
      theme: 'ivory', name1: 'Amelia', name2: 'James', top: 'Together with their families',
      intro: 'request the pleasure of your company at the celebration of their marriage.',
      date: inDays(150), heroPhoto: '', envelope: true,
      cerTime: '15:30', cerPlace: { name: "St. Mary's Chapel", address: '12 Church Lane, Riverside', url: '' }, cerNote: '',
      recOn: true, recTime: '18:00', recPlace: { name: 'The Rosewood Hall', address: '40 Garden Road, Riverside', url: '' }, recNote: 'Dinner, dancing and cake to follow.',
      schedule: [{ time: '15:30', title: 'Ceremony', note: 'Please be seated by 15:15.' }, { time: '17:00', title: 'Cocktails and photos', note: '' }, { time: '18:00', title: 'Dinner and dancing', note: '' }],
      story: '', storyPhoto: '', gallery: [],
      info: [{ title: 'Dress code', text: 'Formal. Soft pastels are welcome.' }, { title: 'Gifts', text: 'Your presence is the greatest gift.' }],
      rsvpOn: true, rsvpBy: '', rsvpMethod: 'whatsapp', rsvpContact: '', rsvpNote: 'We would love to know if you can join us.', rsvpLabel: 'RSVP',
      showCountdown: true, showMap: false, closing: 'We cannot wait to celebrate with you.', hashtag: ''
    },

    schema: [
      { id: 'couple', title: 'The couple', open: true, fields: [
        { key: 'name1', type: 'text', label: 'First name', max: 30 },
        { key: 'name2', type: 'text', label: 'Second name', max: 30 },
        { key: 'top', type: 'text', label: 'Line above the names', max: 70, placeholder: 'e.g. Together with their families' },
        { key: 'intro', type: 'textarea', label: 'Invitation words', rows: 3, help: 'Shown in italics below the countdown.' },
        { key: 'date', type: 'date', label: 'Wedding date' },
        { key: 'heroPhoto', type: 'image', label: 'Cover photo (optional)', help: 'Shown in an arch above your names.' },
        { key: 'theme', type: 'choice', label: 'Colours', options: [{ v: 'ivory', l: 'Ivory and gold', c: '#b8935a' }, { v: 'blush', l: 'Blush and rose', c: '#c4787f' }, { v: 'midnight', l: 'Midnight and gold', c: '#10162b' }] },
        { key: 'envelope', type: 'toggle', label: 'Start with a closing envelope', help: 'Guests tap the wax seal to open it. This is also when the music begins.' }
      ] },
      { id: 'ceremony', title: 'Ceremony', fields: [
        { key: 'cerTime', type: 'time', label: 'Time' },
        { key: 'cerPlace', type: 'place', label: 'Where' },
        { key: 'cerNote', type: 'textarea', label: 'A note (optional)', rows: 2, placeholder: 'e.g. Doors open at 3pm' }
      ] },
      { id: 'reception', title: 'Reception', fields: [
        { key: 'recOn', type: 'toggle', label: 'Include a reception' },
        { key: 'recTime', type: 'time', label: 'Time', show: d => d.recOn },
        { key: 'recPlace', type: 'place', label: 'Where', show: d => d.recOn },
        { key: 'recNote', type: 'textarea', label: 'A note (optional)', rows: 2, show: d => d.recOn },
        { key: 'showMap', type: 'toggle', label: 'Show small maps on the cards', help: 'Uses the address you typed. Turn off if the venue is hard to find on a map.' }
      ] },
      { id: 'schedule', title: 'Schedule of the day', fields: [
        { key: 'schedule', type: 'repeater', label: '', max: 14, addLabel: 'Add a moment', itemLabel: 'Moment', title: i => [i.time, i.title].filter(Boolean).join('  ·  '), blank: { time: '', title: '', note: '' },
          fields: [{ key: 'time', type: 'time', label: 'Time' }, { key: 'title', type: 'text', label: 'What happens', max: 60 }, { key: 'note', type: 'text', label: 'Small note (optional)', max: 120 }] }
      ] },
      { id: 'story', title: 'Our story', fields: [
        { key: 'story', type: 'textarea', label: 'How it began', rows: 6, help: 'Optional. Leave empty to hide this section.' },
        { key: 'storyPhoto', type: 'image', label: 'Photo for the story' }
      ] },
      { id: 'photos', title: 'Photo gallery', fields: [
        { key: 'gallery', type: 'repeater', label: '', max: 12, addLabel: 'Add a photo', itemLabel: 'Photo', title: i => i.caption, blank: { img: '', caption: '' },
          fields: [{ key: 'img', type: 'image', label: 'Photo' }, { key: 'caption', type: 'text', label: 'Caption (optional)', max: 80 }] }
      ] },
      { id: 'info', title: 'Good to know', fields: [
        { key: 'info', type: 'repeater', label: '', max: 8, addLabel: 'Add a detail', itemLabel: 'Detail', title: i => i.title, blank: { title: '', text: '' },
          help: 'Dress code, gifts, hotels, parking, children, dietary needs...',
          fields: [{ key: 'title', type: 'text', label: 'Heading', max: 40 }, { key: 'text', type: 'textarea', label: 'Details', rows: 3 }] }
      ] },
      { id: 'rsvp', title: 'RSVP', fields: [
        { key: 'rsvpOn', type: 'toggle', label: 'Ask guests to reply' },
        { key: 'rsvpNote', type: 'text', label: 'Message', max: 140, show: d => d.rsvpOn },
        { key: 'rsvpBy', type: 'date', label: 'Reply by', show: d => d.rsvpOn },
        { key: 'rsvpMethod', type: 'choice', label: 'How should they reply?', options: [{ v: 'whatsapp', l: 'WhatsApp' }, { v: 'sms', l: 'Text message' }, { v: 'email', l: 'Email' }, { v: 'link', l: 'A web link' }], show: d => d.rsvpOn },
        { key: 'rsvpContact', type: 'text', label: 'Phone number, email or link', max: 120, placeholder: 'e.g. +44 7700 900123', show: d => d.rsvpOn, help: 'For WhatsApp use the full number with country code.' },
        { key: 'rsvpLabel', type: 'text', label: 'Button text', max: 24, show: d => d.rsvpOn }
      ] },
      { id: 'extras', title: 'Final touches', fields: [
        { key: 'showCountdown', type: 'toggle', label: 'Show a countdown to the day' },
        { key: 'closing', type: 'text', label: 'Closing words', max: 120 },
        { key: 'hashtag', type: 'text', label: 'Wedding hashtag (optional)', max: 40, placeholder: '#AmeliaAndJames' }
      ] }
    ],

    mount(root, data, ctx) {
      const th = THEMES[data.theme] || THEMES.ivory;
      const preview = !!ctx.preview;
      u.font('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@500;600&display=swap');
      const style = u.el('style', {}, CSS); document.head.append(style);
      const prevBg = document.body.style.background, prevOv = document.body.style.overflow;
      document.body.style.background = th.bg;
      root.className = 'tpl-wedding' + (preview ? ' is-static' : '');
      root.style.cssText = Object.entries({ bg: th.bg, paper: th.paper, ink: th.ink, muted: th.muted, accent: th.accent, soft: th.soft, leaf: th.leaf, env: th.env, env2: th.env2, seal: th.seal }).map(([k, v]) => `--${k}:${v}`).join(';');

      const n1 = (data.name1 || '').trim(), n2 = (data.name2 || '').trim();
      const names = n1 && n2 ? [n1, n2] : [n1 || n2 || 'Your names'];
      const date = data.date || '', when = u.parseDate(date, data.cerTime);
      const longDate = u.fmtDate(date), shortDate = date ? u.fmtDate(date, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      const initials = (n1[0] || '') + (n2 ? '&' + n2[0] : '');
      const mapsBtn = p => { const url = u.mapsUrl(p); return url ? `<a class="w-btn" href="${esc(url)}" target="_blank" rel="noopener">Get directions</a>` : ''; };
      const icsHref = (label, time, place, note) => date ? u.ics({ title: names.join(' & ') + ' ' + label, date, time, place, note }) : '';
      const hasPlace = p => p && (p.name || p.address);

      function eventCard(title, time, place, note, label) {
        const ics = icsHref(label, time, place, note);
        const embed = data.showMap && hasPlace(place) ? u.mapsEmbed(place) : '';
        return `<div class="w-card w-reveal"><h3>${esc(title)}</h3>
          ${time ? `<p class="when">${esc(u.fmtTime(time))}</p>` : ''}${longDate ? `<p class="day">${esc(longDate)}</p>` : ''}
          ${hasPlace(place) ? `<p class="venue">${esc(place.name || '')}</p><p class="addr">${esc(place.address || '')}</p>` : ''}
          ${note ? `<p class="note">${esc(note)}</p>` : ''}
          ${embed ? `<div class="w-map"><iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${esc(embed)}" title="Map"></iframe></div>` : ''}
          <div class="w-btns">${mapsBtn(place)}${ics ? `<a class="w-btn" href="${ics}" download="${esc(title.toLowerCase().replace(/\W+/g, '-'))}.ics">Add to calendar</a>` : ''}</div></div>`;
      }

      const sections = [];
      /* hero */
      sections.push(`<header class="w-hero">
        <div class="w-sprig tl">${SPRIG}</div><div class="w-sprig br">${SPRIG}</div>
        ${data.heroPhoto ? `<div class="w-arch w-in" style="background-image:url('${esc(data.heroPhoto)}');animation-delay:.1s"></div>` : ''}
        ${data.top ? `<p class="w-top w-in" style="animation-delay:.25s">${esc(data.top)}</p>` : ''}
        <h1 class="w-names w-in" style="animation-delay:.45s">${names.length === 2 ? `<span>${esc(names[0])}</span><span class="amp">and</span><span>${esc(names[1])}</span>` : `<span>${esc(names[0])}</span>`}</h1>
        <p class="w-married w-in" style="animation-delay:.7s">are getting married</p>
        ${shortDate ? `<div class="w-in" style="animation-delay:.9s"><span class="w-date">${esc(shortDate)}</span></div>` : ''}
        ${hasPlace(data.cerPlace) && data.cerPlace.name ? `<p class="w-place w-in" style="animation-delay:1.05s">${esc(data.cerPlace.name)}</p>` : ''}
        <div class="w-scroll"><span>Scroll</span><i></i></div></header>`);
      /* invitation + countdown */
      const introBlock = (data.intro || data.showCountdown) ? `<section class="w-sec"><div class="w-wrap">
        ${data.intro ? `<p class="w-intro w-reveal">${esc(data.intro)}</p>${divider()}` : ''}
        ${data.showCountdown && when ? '<div id="wCount"></div>' : ''}</div></section>` : '';
      sections.push(introBlock);
      /* events */
      const events = [];
      if (hasPlace(data.cerPlace) || data.cerTime || data.cerNote) events.push(eventCard('Ceremony', data.cerTime, data.cerPlace, data.cerNote, 'ceremony'));
      if (data.recOn && (hasPlace(data.recPlace) || data.recTime || data.recNote)) events.push(eventCard('Reception', data.recTime, data.recPlace, data.recNote, 'reception'));
      if (events.length) sections.push(`<section class="w-sec"><div class="w-wrap"><p class="w-eyebrow w-reveal">The day</p><h2 class="w-h2 w-reveal">Where and when</h2><div class="w-events">${events.join('')}</div></div></section>`);
      /* schedule */
      const sched = (data.schedule || []).filter(s => s.title || s.time);
      if (sched.length) sections.push(`<section class="w-sec"><div class="w-wrap"><p class="w-eyebrow w-reveal">Timeline</p><h2 class="w-h2 w-reveal">The order of the day</h2><div class="w-time">${sched.map(s =>
        `<div class="w-ti w-reveal"><div class="t">${esc(u.fmtTime(s.time))}</div><div class="dot"></div><div class="x"><b>${esc(s.title)}</b>${s.note ? `<span>${esc(s.note)}</span>` : ''}</div></div>`).join('')}</div></div></section>`);
      /* story */
      if ((data.story || '').trim()) sections.push(`<section class="w-sec"><div class="w-wrap"><p class="w-eyebrow w-reveal">Our story</p><h2 class="w-h2 w-reveal">How it began</h2>${divider()}
        <div class="w-story ${data.storyPhoto ? 'has-photo' : ''} w-reveal"><div>${(data.story || '').split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('')}</div>${data.storyPhoto ? `<div class="w-oval" style="background-image:url('${esc(data.storyPhoto)}')"></div>` : ''}</div></div></section>`);
      /* gallery */
      const gal = (data.gallery || []).filter(g => g.img);
      if (gal.length) sections.push(`<section class="w-sec"><div class="w-wrap"><p class="w-eyebrow w-reveal">Moments</p><h2 class="w-h2 w-reveal">A few favourites</h2><div class="w-gal">${gal.map((g, i) =>
        `<figure class="w-reveal" data-i="${i}"><img loading="lazy" src="${esc(g.img)}" alt="${esc(g.caption || 'Photo')}">${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('')}</div></div></section>`);
      /* info */
      const info = (data.info || []).filter(i => i.title || i.text);
      if (info.length) sections.push(`<section class="w-sec"><div class="w-wrap"><p class="w-eyebrow w-reveal">Good to know</p><h2 class="w-h2 w-reveal">Details</h2><div class="w-info">${info.map(i => `<div class="w-reveal"><b>${esc(i.title)}</b><p>${esc(i.text)}</p></div>`).join('')}</div></div></section>`);
      /* rsvp */
      if (data.rsvpOn) {
        const c = (data.rsvpContact || '').trim(), text = encodeURIComponent('Hello! Replying to the invitation for ' + names.join(' & ') + "'s wedding. ");
        let href = '';
        if (c) {
          if (data.rsvpMethod === 'whatsapp') { const digits = c.replace(/[^\d]/g, ''); if (digits) href = 'https://wa.me/' + digits + '?text=' + text; }
          else if (data.rsvpMethod === 'sms') href = 'sms:' + c.replace(/[^\d+]/g, '') + '?&body=' + text;
          else if (data.rsvpMethod === 'email') href = 'mailto:' + c + '?subject=' + encodeURIComponent('RSVP: ' + names.join(' & ')) + '&body=' + text;
          else href = u.safeUrl(c);
        }
        sections.push(`<section class="w-sec"><div class="w-wrap"><div class="w-rsvp w-reveal"><p class="w-eyebrow">Will you join us?</p>${data.rsvpNote ? `<p>${esc(data.rsvpNote)}</p>` : ''}
          ${data.rsvpBy ? `<p class="w-by">Please reply by ${esc(u.fmtDate(data.rsvpBy, { day: 'numeric', month: 'long', year: 'numeric' }))}</p>` : ''}
          ${href ? `<a class="w-btn solid" href="${esc(href)}" target="_blank" rel="noopener">${esc(data.rsvpLabel || 'RSVP')}</a>` : ''}</div></div></section>`);
      }
      /* closing */
      sections.push(`<footer class="w-close w-reveal">${divider()}<p class="sign">${esc(data.closing || '')}</p>${data.hashtag ? `<p class="tag">${esc(data.hashtag)}</p>` : ''}</footer>`);

      const useEnvelope = !preview && data.envelope !== false;
      root.innerHTML = sections.join('') +
        (useEnvelope ? `<div class="w-env" id="wEnv"><h1>You are invited</h1>
          <div class="env" id="env"><div class="env-back"></div>
            <div class="env-card"><b>${esc(names.join(' & '))}</b><span>${esc(shortDate || 'Save the date')}</span></div>
            <div class="env-front"></div><div class="env-flap"></div>
            <button class="seal" id="seal" type="button" aria-label="Open the invitation">${esc(initials || '♥')}</button></div>
          <div class="hint">Tap the seal to open</div></div>` : '');

      /* scroll reveal */
      let io = null;
      if (!preview && 'IntersectionObserver' in window) {
        io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
        root.querySelectorAll('.w-reveal').forEach(n => io.observe(n));
      } else root.querySelectorAll('.w-reveal').forEach(n => n.classList.add('in'));

      /* countdown */
      let tick = 0;
      const cd = root.querySelector('#wCount');
      if (cd && when) {
        const draw = () => {
          const ms = when - new Date();
          if (ms <= 0) { cd.innerHTML = `<p class="w-big">${u.daysUntil(date) === 0 ? 'Today is the day!' : 'Married!'}</p>`; return; }
          const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
          cd.innerHTML = `<div class="w-count w-reveal in">${[[d, 'Days'], [h, 'Hours'], [m, 'Minutes'], [s, 'Seconds']].map(([v, l]) => `<div><b>${String(v).padStart(2, '0')}</b><span>${l}</span></div>`).join('')}</div>`;
        };
        draw(); if (!preview) tick = setInterval(draw, 1000); else tick = setInterval(draw, 30000);
      }

      /* lightbox */
      let lb = null;
      const closeLb = () => { if (lb) { lb.remove(); lb = null; } };
      const openLb = i => {
        closeLb(); const g = gal[i]; if (!g) return;
        lb = el('div', { class: 'w-lb', onclick: e => { if (e.target === lb) closeLb(); } },
          el('figure', {}, el('img', { src: g.img, alt: g.caption || '' }), g.caption ? el('figcaption', {}, g.caption) : null),
          el('button', { class: 'x', type: 'button', 'aria-label': 'Close', onclick: closeLb }, '✕'),
          gal.length > 1 ? el('button', { class: 'p', type: 'button', 'aria-label': 'Previous', onclick: () => openLb((i - 1 + gal.length) % gal.length) }, '‹') : null,
          gal.length > 1 ? el('button', { class: 'n', type: 'button', 'aria-label': 'Next', onclick: () => openLb((i + 1) % gal.length) }, '›') : null);
        document.body.append(lb);
      };
      root.querySelectorAll('.w-gal figure').forEach(f => f.addEventListener('click', () => openLb(+f.dataset.i)));
      const onKey = e => { if (lb && e.key === 'Escape') closeLb(); };
      addEventListener('keydown', onKey);

      /* envelope */
      if (useEnvelope) {
        document.body.style.overflow = 'hidden';
        const envWrap = root.querySelector('#wEnv'), env = root.querySelector('#env');
        root.querySelector('#seal').addEventListener('click', () => {
          ctx.start(); env.classList.add('open'); const hint = root.querySelector('.hint'); if (hint) hint.textContent = '';
          setTimeout(() => { envWrap.classList.add('gone'); document.body.style.overflow = prevOv; }, 2300);
          setTimeout(() => envWrap.remove(), 3500);
        });
      }

      return {
        destroy() {
          clearInterval(tick); if (io) io.disconnect(); closeLb(); removeEventListener('keydown', onKey);
          style.remove(); root.textContent = ''; root.className = ''; root.style.cssText = ''; document.body.style.background = prevBg; document.body.style.overflow = prevOv;
        }
      };
    },

    thumb: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#fbf7f0"/>
      <g fill="none" stroke="#8a9a72" stroke-width="1.6" opacity=".7"><path d="M-10 20C60 40 120 90 160 170"/><path d="M410 280C340 260 280 210 240 130"/></g>
      <g fill="#8a9a72" opacity=".35"><ellipse cx="40" cy="42" rx="7" ry="16" transform="rotate(-40 40 42)"/><ellipse cx="72" cy="70" rx="7" ry="16" transform="rotate(-25 72 70)"/><ellipse cx="100" cy="106" rx="7" ry="16" transform="rotate(-10 100 106)"/><ellipse cx="360" cy="258" rx="7" ry="16" transform="rotate(140 360 258)"/><ellipse cx="328" cy="230" rx="7" ry="16" transform="rotate(155 328 230)"/></g>
      <text x="200" y="118" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="54" fill="#b8935a">Amelia</text>
      <text x="200" y="146" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="17" fill="#8b7f73">and</text>
      <text x="200" y="196" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="54" fill="#b8935a">James</text>
      <line x1="130" y1="222" x2="270" y2="222" stroke="#b8935a"/><text x="200" y="245" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="4" fill="#3a332c">24 OCTOBER 2026</text></svg>`
  });
})();
