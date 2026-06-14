const MEETING_UTC_HOUR = 22; // fixed UTC — displays as 3PM PDT in summer, 2PM PST in winter

function pad(n) {
    return String(n).padStart(2, '0');
}

function nextMeeting() {
    const now = new Date();
    const candidate = new Date(now);

    const daysUntilSunday = candidate.getUTCDay() === 0 ? 0 : 7 - candidate.getUTCDay();
    candidate.setUTCDate(candidate.getUTCDate() + daysUntilSunday);
    candidate.setUTCHours(MEETING_UTC_HOUR, 0, 0, 0);

    if (candidate <= now) {
        candidate.setUTCDate(candidate.getUTCDate() + 7);
    }

    return candidate;
}

function formatDate(d) {
    return d.toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

let target = nextMeeting();

const timeEl = document.getElementById('fc-time');
const tzEl   = document.getElementById('fc-tz');

function updateDateDisplay() {
    timeEl.textContent = formatDate(target);
    timeEl.setAttribute('datetime', target.toISOString());
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