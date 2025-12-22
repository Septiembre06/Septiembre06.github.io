
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('regForm');
  const teamsList=document.getElementById('teams-list');
  const teamsEmpty=document.getElementById('teams-empty');
  const msg=document.getElementById('form-msg');
  const menuBtn=document.getElementById('menuBtn');
  const nav=document.getElementById('nav');

  menuBtn.addEventListener('click',()=>{
    const shown = nav.style.display === 'block';
    nav.style.display = shown ? '' : 'block';
  });


  const showTableBtnNav = document.getElementById('showTableBtn');
  const showCalendarBtnNav = document.getElementById('showCalendarBtn');
  document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const id = href.slice(1);
  
      if(id === 'fixture' && showTableBtnNav){
        e.preventDefault();
        showTableBtnNav.click();
        return;
      }
      if(id === 'calendar' && showCalendarBtnNav){
        e.preventDefault();
        showCalendarBtnNav.click();
        return;
      }
      const target = document.getElementById(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
      
      if(window.innerWidth <= 520 && nav){ nav.style.display = ''; }
    });
  });

  const showTableBtn = document.getElementById('showTableBtn');
  const fixtureSection = document.getElementById('fixture');
  const closeTableBtn = document.getElementById('closeTableBtn');

  // Abrir la tabla en una página separada en lugar de mostrarla en la misma página
  if(showTableBtn){
    showTableBtn.addEventListener('click', ()=>{
      window.location.href = 'tabla.html';
    });
  }

  if(closeTableBtn && fixtureSection){
    closeTableBtn.addEventListener('click', ()=>{
      fixtureSection.style.display = 'none';
      showTableBtn.focus();
    });
  }


  const showCalendarBtn = document.getElementById('showCalendarBtn');
  const calendarSection = document.getElementById('calendar');
  const closeCalendarBtn = document.getElementById('closeCalendarBtn');

  // Abrir el calendario en una página separada en lugar de mostrarlo en la misma página
  if(showCalendarBtn){
    showCalendarBtn.addEventListener('click', ()=>{
      window.location.href = 'calendar.html';
    });
  }

  if(closeCalendarBtn && calendarSection){
    closeCalendarBtn.addEventListener('click', ()=>{
      calendarSection.style.display = 'none';
      showCalendarBtn.focus();
    });
  }


  const showTeamsBtn = document.getElementById('showTeamsBtn');
  const teamsSection = document.getElementById('teams');
  const closeTeamsBtn = document.getElementById('closeTeamsBtn');

  // Abrir la página de equipos en lugar de mostrarla en la misma página
  if(showTeamsBtn){
    showTeamsBtn.addEventListener('click', ()=>{
      window.location.href = 'equipos.html';
    });
  }

  if(closeTeamsBtn && teamsSection){
    closeTeamsBtn.addEventListener('click', ()=>{
      teamsSection.style.display = 'none';
      showTeamsBtn.focus();
    });
  }


  // Replace inline team controls with a modal-based editor for players
  function teamPlayersStorageKey(teamName){ return `team::${encodeURIComponent(teamName)}::players`; }

  function loadPlayersByName(name){ if(!name) return []; try{ const raw = localStorage.getItem(teamPlayersStorageKey(name)); return raw ? JSON.parse(raw) : []; }catch(e){ return []; } }
  function savePlayersByName(name, players){ if(!name) return; try{ localStorage.setItem(teamPlayersStorageKey(name), JSON.stringify(players)); }catch(e){ console.error('save players',e); } }

  function renderPlayersIn(container, name){
    const players = loadPlayersByName(name) || [];
    container.innerHTML = '';
    if(!players.length){ const li = document.createElement('li'); li.className='muted'; li.textContent='Sin jugadores registrados'; container.appendChild(li); return; }
    players.forEach((p, idx)=>{
      const li = document.createElement('li'); li.style.display='flex'; li.style.justifyContent='space-between'; li.style.alignItems='center';
      const left = document.createElement('span');
      left.innerHTML = `${p.name} <small style="color:var(--muted)">#${p.number}</small>`;
      if(p.captain){ const cap = document.createElement('span'); cap.className = 'player-captain'; cap.textContent = 'C'; cap.style.marginLeft = '8px'; left.appendChild(cap); }
      li.appendChild(left);
      const del = document.createElement('button'); del.textContent='Eliminar'; del.type='button'; del.style.background='transparent'; del.style.border='0'; del.style.color='var(--muted)'; del.style.cursor='pointer';
      del.addEventListener('click', ()=>{ const arr = loadPlayersByName(name); arr.splice(idx,1); savePlayersByName(name, arr); renderPlayersIn(container, name); updateTeamItemUI(name); });
      li.appendChild(del);
      container.appendChild(li);
    });
  }

  // Update the in-page team item UI (team-players list) for all occurrences of a team
  function updateTeamItemUI(teamName){
    if(!teamName) return;
    // update any .team-item entries
    const items = document.querySelectorAll(`.teams-list .team-item[data-team-name]`);
    items.forEach(item=>{
      const nameAttr = item.getAttribute('data-team-name') || item.querySelector('.team-name')?.textContent;
      if(!nameAttr) return;
      if(nameAttr.trim().toLowerCase() !== teamName.trim().toLowerCase()) return;
      const info = item.querySelector('.team-info'); if(!info) return;
      let ul = info.querySelector('.team-players');
      if(!ul){ ul = document.createElement('ul'); ul.className = 'team-players small muted'; info.insertBefore(ul, info.querySelector('.muted') || null); }
      const players = loadPlayersByName(teamName) || [];
      ul.innerHTML = '';
      if(!players.length){ ul.innerHTML = '<li class="muted">Sin jugadores registrados</li>'; return; }
      players.forEach((p, idx)=>{
        const li = document.createElement('li'); li.style.display = 'flex'; li.style.justifyContent = 'space-between'; li.style.alignItems = 'center';
        const left = document.createElement('span'); left.innerHTML = `${p.name} <small style=\"color:var(--muted)\">#${p.number}</small>`;
        if(p.captain){ const cap = document.createElement('span'); cap.className='player-captain'; cap.textContent='C'; cap.style.marginLeft='8px'; left.appendChild(cap); }
        li.appendChild(left);
        const del = document.createElement('button'); del.textContent = 'Eliminar'; del.type='button'; del.style.background='transparent'; del.style.border='0'; del.style.color='var(--muted)'; del.style.cursor='pointer';
        del.addEventListener('click', ()=>{ const arr = loadPlayersByName(teamName); arr.splice(idx,1); savePlayersByName(teamName, arr); updateTeamItemUI(teamName); const rosterEl = document.getElementById('teamRoster'); if(rosterEl) renderPlayersIn(rosterEl, teamName); });
        li.appendChild(del);
        ul.appendChild(li);
      });
    });
  }

  function createTeamModalIfMissing(){
    if(document.getElementById('teamModal')) return;
    const html = `
    <div id="teamModal" class="team-modal" aria-hidden="true">
      <div class="team-modal-backdrop" id="teamModalBackdrop"></div>
      <div class="team-modal-panel" role="dialog" aria-modal="true" aria-labelledby="teamModalTitle">
        <button id="closeTeamModal" class="modal-close" aria-label="Cerrar panel">✕</button>
        <div class="team-panel-inner">
          <div class="team-left">
            <div class="team-card card">
              <img id="teamModalLogo" src="" alt="Logo equipo" class="team-logo">
              <div class="team-badge-label">Equipo</div>
              <h3 id="teamModalName">Equipo</h3>
              <p class="muted">Estadísticas del equipo</p>
            </div>
            <div class="card stats-compact">
              <h4>Plantilla</h4>
              <ul id="teamRoster" class="roster-list muted"></ul>
            </div>
          </div>
          <div class="team-right">
            <div class="card roster-card">
              <h4 id="teamModalTitle">Gestionar jugadores</h4>
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                <input id="modalPlayerName" placeholder="Nombre" style="flex:1;padding:.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:var(--text)">
                <input id="modalPlayerNumber" placeholder="#" style="width:80px;padding:.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:var(--text)">
                <button id="modalAddPlayer" class="btn">Añadir</button>
              </div>
              <div id="modalPlayersMsg" class="muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    const div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div.firstElementChild);
  }

  function openTeamModalWith(name, logo){
    if(!name) return;
    createTeamModalIfMissing();
    const teamModalEl = document.getElementById('teamModal');
    const backdrop = document.getElementById('teamModalBackdrop');
    const closeBtn = document.getElementById('closeTeamModal');
    const logoEl = document.getElementById('teamModalLogo');
    const nameEl = document.getElementById('teamModalName');
    const rosterEl = document.getElementById('teamRoster');
    const addName = document.getElementById('modalPlayerName');
    const addNum = document.getElementById('modalPlayerNumber');
    const addBtn = document.getElementById('modalAddPlayer');
    const msgEl = document.getElementById('modalPlayersMsg');

    logoEl.src = logo || '';
    logoEl.alt = `Logo ${name}`;
    nameEl.textContent = name;
    renderPlayersIn(rosterEl, name);

    addBtn.onclick = ()=>{
      const nm = addName.value.trim(); const num = addNum.value.trim(); if(!nm){ msgEl.textContent = 'Ingresa nombre'; return; }
      const arr = loadPlayersByName(name); arr.push({name:nm, number:num||''}); savePlayersByName(name, arr); renderPlayersIn(rosterEl, name);
      updateTeamItemUI(name);
      addName.value = ''; addNum.value = ''; msgEl.textContent = 'Jugador añadido'; setTimeout(()=>msgEl.textContent='','1200');
    };

    function close(){ teamModalEl.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
    function show(){ teamModalEl.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; if(closeBtn) closeBtn.focus(); }

    if(closeBtn) closeBtn.onclick = close;
    if(backdrop) backdrop.onclick = close;
    document.addEventListener('keydown', function onEsc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', onEsc); } });

    show();
  }

  // bind team-name clicks to open modal
  document.querySelectorAll('.teams-list .team-name').forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const item = btn.closest('.team-item'); if(!item) return;
      const name = item.getAttribute('data-team-name') || btn.textContent.trim();
      const logo = item.querySelector('.team-thumb')?.src || '';
      openTeamModalWith(name, logo);
    });
    btn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
  });

  // Initialize in-page team lists from storage
  document.querySelectorAll('.teams-list .team-item').forEach(item=>{
    const name = item.getAttribute('data-team-name') || item.querySelector('.team-name')?.textContent?.trim();
    if(name) updateTeamItemUI(name);
  });

  // Attach inline add-form handlers (equipos.html)
  document.querySelectorAll('.team-add-form').forEach(form => {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const teamName = form.getAttribute('data-team-name') || '';
      const nameInput = form.querySelector('[name="playerName"]');
      const numInput = form.querySelector('[name="playerNumber"]');
      const capInput = form.querySelector('[name="captain"]');
      const playerName = (nameInput && nameInput.value || '').trim();
      const playerNumber = (numInput && numInput.value || '').trim() || '';
      const isCaptain = !!(capInput && capInput.checked);
      if(!playerName) { if(nameInput) nameInput.focus(); return; }
      const arr = loadPlayersByName(teamName) || [];
      arr.push({ name: playerName, number: playerNumber, captain: isCaptain });
      try{
        savePlayersByName(teamName, arr);
      }catch(err){
        console.error('error saving players', err);
      }
      // update the list in the same team card immediately
      const parentItem = form.closest('.team-item') || form.closest('.team-info');
      let teamList = parentItem && parentItem.querySelector('.team-players');
      if(!teamList && parentItem){
        teamList = document.createElement('ul');
        teamList.className = 'team-players small muted';
        (parentItem.querySelector('.team-info') || parentItem).appendChild(teamList);
      }
      if(teamList) renderPlayersIn(teamList, teamName);
      // also update other occurrences and modal roster if open
      updateTeamItemUI(teamName);
      const rosterEl = document.getElementById('teamRoster'); if(rosterEl) renderPlayersIn(rosterEl, teamName);
      // clear form
      if(nameInput) nameInput.value = '';
      if(numInput) numInput.value = '';
      if(capInput) capInput.checked = false;
      // show temporary saved message
      let msg = form.querySelector('.form-save-msg');
      if(!msg){ msg = document.createElement('div'); msg.className = 'form-save-msg muted'; msg.style.marginTop = '6px'; msg.style.fontSize = '0.9rem'; form.appendChild(msg); }
      msg.textContent = 'Guardado';
      setTimeout(()=>{ if(msg) msg.textContent = ''; }, 1500);
    });
  });

  
  const showPlayerLink = document.getElementById('showPlayerLink');
  const playerSection = document.getElementById('player');
  const closePlayerBtn = document.getElementById('closePlayerBtn');

  if(showPlayerLink && playerSection){
    showPlayerLink.addEventListener('click', (e)=>{
      e.preventDefault();
      playerSection.style.display = 'block';
      playerSection.scrollIntoView({behavior:'smooth'});
    });
  }

  if(closePlayerBtn && playerSection){
    closePlayerBtn.addEventListener('click', ()=>{
      playerSection.style.display = 'none';
      if(showPlayerLink) showPlayerLink.focus();
    });
  }

  document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.querySelectorAll('.item').forEach(item => {
      const header = item.querySelector('.item-header');
      if(!header) return;
      header.addEventListener('click', ()=>{
        const isOpen = item.classList.contains('open');
       
        accordion.querySelectorAll('.item').forEach(i=>i.classList.remove('open'));
        if(!isOpen) item.classList.add('open');
      });
    });
  });

  function addTeamToDOM(team){
   
    if(teamsList){
      const li=document.createElement('li');
      li.textContent = `${team.name} — capitán: ${team.captain} (${team.players} jugadores)`;
      li.className = 'team-item';
      teamsList.appendChild(li);
      if(teamsEmpty) teamsEmpty.style.display='none';
    }
  }


  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name=document.getElementById('teamName').value.trim();
      const captain=document.getElementById('captainName').value.trim();
      const phone=document.getElementById('phone').value.trim();
      const email=document.getElementById('email').value.trim();
      const players=document.getElementById('playersCount').value;

      if(!name || !captain){
        if(msg) {
          msg.textContent='Por favor completa el nombre del equipo y del capitán.';
          msg.style.color='crimson';
        }
        return;
      }

     
      const team={name, captain, phone, email, players};
      addTeamToDOM(team);
      if(msg){
        msg.textContent='Inscripción recibida. ¡Gracias!';
        msg.style.color='green';
      }
      form.reset();
    });
  }
  const teamModal = document.getElementById('teamModal');
  const teamModalBackdrop = document.getElementById('teamModalBackdrop');
  const closeTeamModal = document.getElementById('closeTeamModal');
  const teamModalLogo = document.getElementById('teamModalLogo');
  const teamModalName = document.getElementById('teamModalName');

  function openTeamModalWith(teamName, teamLogo){
    if(!teamModal) return;
    teamModalLogo.src = teamLogo || '';
    teamModalLogo.alt = `Logo ${teamName || ''}`;
    teamModalName.textContent = teamName || '';

    const rosterEl = document.getElementById('teamRoster');
    if(rosterEl){
      if(teamName === 'Gladiadores'){
        rosterEl.innerHTML = `
          <ul class="roster-list">
            <li class="player-item"><div class="player-left"><div class="player-avatar"></div><div class="player-name">Kevin <span class="player-captain">C</span></div></div><div class="player-number">8</div></li>
            <li class="player-item"><div class="player-left"><div class="player-avatar"></div><div class="player-name">Adan</div></div><div class="player-number">3</div></li>
            <li class="player-item"><div class="player-left"><div class="player-avatar"></div><div class="player-name">Haley</div></div><div class="player-number">5</div></li>
            <li class="player-item"><div class="player-left"><div class="player-avatar"></div><div class="player-name">Alian</div></div><div class="player-number">1</div></li>
            <li class="player-item"><div class="player-left"><div class="player-avatar"></div><div class="player-name">Juliyo</div></div><div class="player-number">7</div></li>
          </ul>
        `;
      } else {
        rosterEl.innerHTML = '<div class="muted">No hay jugadores registrados para este equipo</div>';
      }
    }
    teamModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if(closeTeamModal) closeTeamModal.focus();
  }

  function closeTeam(){
    if(!teamModal) return;
    teamModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';

    const firstBadge = document.querySelector('.badge-img[tabindex]');
    if(firstBadge) firstBadge.focus();
  }

  document.querySelectorAll('.badge-img[data-team-name]').forEach(b => {
    const name = b.getAttribute('data-team-name');
    const logo = b.getAttribute('data-team-logo') || b.src;
    b.addEventListener('click', ()=> openTeamModalWith(name, logo));
    b.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTeamModalWith(name, logo); } });
  });

  if(closeTeamModal) closeTeamModal.addEventListener('click', closeTeam);
  if(teamModalBackdrop) teamModalBackdrop.addEventListener('click', closeTeam);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeTeam(); });
  
});