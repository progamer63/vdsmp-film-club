const MEETING_HOUR = 15; // 3:00 PM

function pad(n) {
    return String(n).padStart(2, '0');
}

function nextMeeting() {
    const now = new Date();

    // Find this week's Sunday at 3PM
    const candidate = new Date(now);
    const dayOfWeek = candidate.getDay(); // 0 = Sunday
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    candidate.setDate(candidate.getDate() + daysUntilSunday);
    candidate.setHours(MEETING_HOUR, 0, 0, 0);

    // If that moment has already passed, go to next Sunday
    if (candidate <= now) {
        candidate.setDate(candidate.getDate() + 7);
    }

    return candidate;
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