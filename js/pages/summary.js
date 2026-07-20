import { listSessions, listMembers, listAttendanceForSession, listAllAttendance } from '../services/db.js';
import { formatTime, isSameDay, escapeHtml } from '../utils/format.js';

export async function mountPage() {
  const searchInput = document.getElementById('summary-session-search');
  const sessionListEl = document.getElementById('summary-session-list');
  const attendanceTitleEl = document.getElementById('summary-session-title');
  const attendanceListEl = document.getElementById('summary-attendance-list');
  const tilesEl = document.getElementById('summary-tiles');

  const config = await fetch('./config/app-config.json').then((r) => r.json());

  let sessions = [];
  let members = [];
  let allAttendance = [];
  let selectedSessionId = null;

  function tileColorClass(color) {
    return `color-${color || 'info'}`;
  }

  function renderTiles() {
    const today = new Date();
    const todayCheckins = allAttendance.filter((a) => isSameDay(a.checkedInAt, today)).length;

    let activeSessionRate = '—';
    if (selectedSessionId && members.length) {
      const count = allAttendance.filter((a) => a.sessionId === selectedSessionId).length;
      activeSessionRate = `${Math.round((count / members.length) * 100)}%`;
    }

    const values = {
      totalSessions: sessions.length,
      totalMembers: members.length,
      todayCheckins,
      activeSessionRate,
    };

    tilesEl.innerHTML = (config.summaryTiles || [])
      .map(
        (tile) => `
        <div class="tile">
          <div class="tile-value ${tileColorClass(tile.color)}">${values[tile.key] ?? '—'}</div>
          <div class="tile-label">${escapeHtml(tile.label)}</div>
        </div>`
      )
      .join('');
  }

  function renderSessionList() {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = term
      ? sessions.filter(
          (s) => s.name.toLowerCase().includes(term) || (s.date || '').includes(term)
        )
      : sessions;

    if (!filtered.length) {
      sessionListEl.innerHTML = `
        <div class="list-empty">
          <div class="list-empty-title">${sessions.length ? '沒有符合的場次' : '尚無任何場次'}</div>
          <div class="list-empty-desc">${sessions.length ? '換個關鍵字試試' : '在「場次管理」建立第一個場次'}</div>
        </div>`;
      return;
    }

    sessionListEl.innerHTML = filtered
      .map((s) => {
        const count = allAttendance.filter((a) => a.sessionId === s.id).length;
        return `
        <div class="card-inner session-card ${s.id === selectedSessionId ? 'is-active' : ''}" data-id="${s.id}" style="border:1px solid var(--border-soft);">
          <div class="session-card-top">
            <span class="session-card-name">${escapeHtml(s.name)}</span>
            <span class="badge badge-info">${count} 人</span>
          </div>
          <span class="session-card-date">${escapeHtml(s.date || '未設定日期')}</span>
        </div>`;
      })
      .join('');

    sessionListEl.querySelectorAll('.session-card').forEach((el) => {
      el.addEventListener('click', () => {
        selectSession(el.dataset.id);
      });
    });
  }

  async function selectSession(sessionId) {
    selectedSessionId = sessionId;
    renderSessionList();
    renderTiles();

    const session = sessions.find((s) => s.id === sessionId);
    attendanceTitleEl.textContent = session ? session.name : '請選擇場次';
    attendanceListEl.innerHTML = '<div class="state-block"><div class="spinner"></div>載入中…</div>';

    try {
      const records = await listAttendanceForSession(sessionId);
      if (!records.length) {
        attendanceListEl.innerHTML = `
          <div class="list-empty">
            <div class="list-empty-title">此場次尚無簽到紀錄</div>
            <div class="list-empty-desc">到「點名讀卡」開始感應</div>
          </div>`;
        return;
      }
      attendanceListEl.innerHTML = records
        .map(
          (r) => `
          <div class="list-row">
            <div class="list-row-main">
              <div class="list-row-name">${escapeHtml(r.memberName)}</div>
              <div class="list-row-meta">卡號 ${escapeHtml(r.cardUID || '—')}</div>
            </div>
            <span class="badge badge-success">${formatTime(r.checkedInAt)}</span>
          </div>`
        )
        .join('');
    } catch (err) {
      attendanceListEl.innerHTML = `<div class="error-banner">載入出席名單失敗：${escapeHtml(err.message || '')}</div>`;
    }
  }

  async function loadAll() {
    try {
      [sessions, members, allAttendance] = await Promise.all([
        listSessions(),
        listMembers(),
        listAllAttendance(),
      ]);
      renderTiles();
      renderSessionList();
      if (sessions.length) {
        await selectSession(sessions[0].id);
      }
    } catch (err) {
      sessionListEl.innerHTML = `<div class="error-banner">載入資料失敗：${escapeHtml(err.message || '')}</div>`;
    }
  }

  searchInput.addEventListener('input', renderSessionList);

  await loadAll();

  return () => {
    // no global listeners to clean up
  };
}
