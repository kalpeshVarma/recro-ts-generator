import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { BUILTIN_HOLIDAYS_2026, HolidayMap, HolidaySource } from './holidays';

const CACHE_FILE = path.join(process.cwd(), '.holidays_cache.json');

// In-memory cache (per process)
const memCache: Record<number, HolidayMap> = {};

function readDiskCache(): Record<string, HolidayMap> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch { /* ignore */ }
  return {};
}

function writeDiskCache(data: Record<string, HolidayMap>): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch { /* ignore */ }
}

async function fetchFromNSE(year: number): Promise<HolidayMap | null> {
  const MONTH_ABBR: Record<string, number> = {
    Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
    Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12,
  };

  try {
    const { data } = await axios.get('https://www.nseindia.com/api/holiday-master?type=trading', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json, */*',
        'Referer': 'https://www.nseindia.com/',
      },
      timeout: 8000,
    });

    const cm: Array<{ tradingDate: string; description: string }> = data?.CM ?? [];
    const map: HolidayMap = {};

    for (const h of cm) {
      // format: "26-Jan-2026"
      const [dd, mon, yyyy] = h.tradingDate.split('-');
      const yr = parseInt(yyyy);
      const mo = MONTH_ABBR[mon];
      const da = parseInt(dd);
      if (!mo || isNaN(yr) || isNaN(da) || yr !== year) continue;
      map[`${yr}-${mo}-${da}`] = h.description;
    }

    return map;
  } catch {
    return null;
  }
}

export async function getHolidays(year: number): Promise<{ map: HolidayMap; source: HolidaySource }> {
  // 1. In-memory
  if (memCache[year]) return { map: memCache[year], source: 'cache' };

  // 2. Disk cache
  const disk = readDiskCache();
  if (disk[String(year)]) {
    memCache[year] = disk[String(year)];
    return { map: memCache[year], source: 'cache' };
  }

  // 3. Live NSE fetch
  const liveMap = await fetchFromNSE(year);
  if (liveMap) {
    memCache[year] = liveMap;
    disk[String(year)] = liveMap;
    writeDiskCache(disk);
    return { map: liveMap, source: 'nse' };
  }

  // 4. Built-in fallback
  if (year === 2026) return { map: BUILTIN_HOLIDAYS_2026, source: 'builtin' };
  return { map: {}, source: 'builtin' };
}

export async function refreshHolidays(year: number): Promise<{ map: HolidayMap; source: HolidaySource }> {
  delete memCache[year];
  const disk = readDiskCache();
  delete disk[String(year)];
  writeDiskCache(disk);
  return getHolidays(year);
}
