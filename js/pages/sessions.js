import { listSessions, addSession, updateSession, deleteSession } from '../services/db.js';
import { openModal, confirmModal } from '../ui/modal.js';
import { showToast } from '../ui/toast.js';
import { icon } from '../utils/icon.js';
import { todayDateInputValue } from '../utils/format.js';
import { escapeHtml } from '../utils/format.js';

export async function mountPage() {
  const listEl = document.getElementById('session-list');
  const addBtn = document.getElementById('add-session-btn');

  async function refresh() {
    listEl.innerHTML = '<div class="state-block"><div class="spinner"></div>載入中…</div>';
    try {
      const sessions = await listSessions();
      renderList(sessions);
    } catch (err) {
      listEl.innerHTML = `<div class="error-banner">載入場次失敗：${escapeHtml(err.message || '')}</div>`;
    }
  }

  function renderList(sessions) {
    if (!sessions.length) {
      listEl.innerHTML = `
        <div class="list-empty">
          <div class="list-empty-title">尚未建立任何場次</div>
          <div class="list-empty-desc">點右上角「新增場次」開始第一次點名</div>
        </div>`;
      return;
    }

    listEl.innerHTML = sessions
      .map(
        (s) => `
        <div class="list-row" data-id="${s.id}">
          <div class="list-row-main">
            <div class="list-row-name">${escapeHtml(s.name)}</div>
            <div class="list-row-meta">${escapeHtml(s.date || '')}${s.note ? ' · ' + escapeHtml(s.note) : ''}</div>
          </div>
          <div class="list-row-actions">
            <button type="button" class="btn btn-icon btn-ghost" data-action="edit" title="編輯">${icon('edit')}</button>
            <button type="button" class="btn btn-icon btn-ghost" data-action="delete" title="刪除">${icon('trash')}</button>
          </div>
        </div>`
      )
      .join('');

    listEl.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.list-row').dataset.id;
        const session = sessions.find((s) => s.id === id);
        openSessionForm(session);
      });
    });

    listEl.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.closest('.list-row').dataset.id;
        const session = sessions.find((s) => s.id === id);
        const ok = await confirmModal({
          title: '刪除場次',
          message: `確定要刪除場次「${escapeHtml(session.name)}」嗎？此操作無法復原，該場次的點名紀錄仍會保留在資料庫中，但無法再由此清單管理。`,
        });
        if (!ok) return;
        try {
          await deleteSession(id);
          showToast('已刪除場次', 'success');
          refresh();
        } catch (err) {
          showToast(`刪除失敗：${err.message || ''}`, 'danger');
        }
      });
    });
  }

  function openSessionForm(existing) {
    const isEdit = Boolean(existing);
    const { close } = openModal({
      title: isEdit ? '編輯場次' : '新增場次',
      bodyHtml: `
        <div class="field">
          <label class="field-label" for="session-name">場次名稱</label>
          <input class="input" id="session-name" value="${isEdit ? escapeHtml(existing.name) : ''}" placeholder="例如：7/20 第一梯次工作坊" />
        </div>
        <div class="field">
          <label class="field-label" for="session-date">日期</label>
          <input class="input" id="session-date" type="date" value="${isEdit ? existing.date || '' : todayDateInputValue()}" />
        </div>
        <div class="field">
          <label class="field-label" for="session-note">備註（選填）</label>
          <input class="input" id="session-note" value="${isEdit ? escapeHtml(existing.note || '') : ''}" placeholder="例如：地點、講師" />
        </div>
      `,
      buttons: [
        { label: '取消', className: 'btn-ghost', onClick: (c) => c() },
        {
          label: isEdit ? '儲存變更' : '建立場次',
          className: 'btn-primary',
          onClick: async (c) => {
            const name = document.getElementById('session-name').value.trim();
            const date = document.getElementById('session-date').value;
            const note = document.getElementById('session-note').value.trim();
            if (!name) {
              showToast('請輸入場次名稱', 'warning');
              return;
            }
            try {
              if (isEdit) {
                await updateSession(existing.id, { name, date, note });
                showToast('已更新場次', 'success');
              } else {
                await addSession({ name, date, note });
                showToast('已建立場次', 'success');
              }
              c();
              refresh();
            } catch (err) {
              showToast(`儲存失敗：${err.message || ''}`, 'danger');
            }
          },
        },
      ],
    });
    void close;
  }

  addBtn.addEventListener('click', () => openSessionForm(null));

  await refresh();

  return () => {
    // no global listeners to clean up
  };
}
