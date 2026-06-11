const MEETING_HOUR = 15; // 3:00 PM — matches "3PM PST" in your about text

function firstSundayOf(year, month) {
    const d = new Date(year, month, 1);
    const dayOfWeek = d.getDay(); // 0 = Sunday
    const offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    return new Date(year, month, 1 + offset, MEETING_HOUR, 0, 0);
}

function nextMeeting() {
    const now = new Date();
    let candidate = firstSundayOf(now.getFullYear(), now.getMonth());

    if (candidate <= now) {
        const nextMonth = now.getMonth() === 11
            ? new Date(now.getFullYear() + 1, 0, 1)
            : new Date(now.getFullYear(), now.getMonth() + 1, 1);
        candidate = firstSundayOf(nextMonth.getFullYear(), nextMonth.getMonth());
    }

    return candidate;
}

function pad(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d) {
    return d.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isoLocal(d) {
    const off = -d.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    const hh = pad(Math.floor(Math.abs(off) / 60));
    const mm = pad(Math.abs(off) % 60);
    const yyyy = d.getFullYear();
    const mo = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const H = pad(d.getHours());
    const M = pad(d.getMinutes());
    const S = pad(d.getSeconds());
    return `${yyyy}-${mo}-${dd}T${H}:${M}:${S}${sign}${hh}:${mm}`;
}

let target = nextMeeting();

const timeEl = document.getElementById('fc-time');
const tzEl   = document.getElementById('fc-tz');

function updateDateDisplay() {
    timeEl.textContent = formatDate(target) + ' at 3:00 PM';
    timeEl.setAttribute('datetime', isoLocal(target));
}

tzEl.textContent =
    'times shown in your local timezone: ' +
    Intl.DateTimeFormat().resolvedOptions().timeZone;

updateDateDisplay();

function tick() {
    const now = new Date();

    if (now >= target) {
        target = nextMeeting();
        updateDateDisplay();
    }

    const diff      = Math.max(0, target - now);
    const totalSecs = Math.floor(diff / 1000);
    const secs      = totalSecs % 60;
    const mins      = Math.floor(totalSecs / 60) % 60;
    const hours     = Math.floor(totalSecs / 3600) % 24;
    const days      = Math.floor(totalSecs / 86400);

    document.getElementById('fc-days').textContent  = days;
    document.getElementById('fc-hours').textContent = pad(hours);
    document.getElementById('fc-mins').textContent  = pad(mins);
    document.getElementById('fc-secs').textContent  = pad(secs);
}

tick();
setInterval(tick, 1000);
