import dayjs from 'dayjs';
import Vue from 'vue';
import _ from 'lodash';

export function toPrecision(value: number, precision: number) {
  if (value >= (Math.pow(10, precision))) {
    return value.toString();
  } else if (value >= 1) {
    return value.toPrecision(precision);
  }

  return value.toFixed(precision - 1);
}

export function formatSize(value: number) {
  const units = 'KMGTP';
  let index = -1;

  while (value >= 1000) {
    index++;
    value /= 1024;
  }

  const unit = index < 0 ? 'B' : units[index] + 'iB';

  return `${toPrecision(value, 3)} ${unit}`;
}

Vue.filter('formatSize', formatSize);
Vue.filter('size', formatSize);

export interface DurationOptions {
  dayLimit?: number;
  maxUnitSize?: number;
}

export function formatDuration(value: number, options?: DurationOptions) {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  const durations = [year, day, hour, minute, 1];
  const units = 'ydhms';

  let index = 0;
  let unitSize = 0;
  const parts = [];

  const defaultOptions: DurationOptions = {
    maxUnitSize: 1,
    dayLimit: 0,
  };

  const opt = options ? Object.assign(defaultOptions, options) : defaultOptions;

  if (opt.dayLimit && value >= opt.dayLimit * day) {
    return '∞';
  }

  while (true) {
    if ((opt.maxUnitSize && unitSize === opt.maxUnitSize) || index === durations.length) {
      break;
    }

    const duration = durations[index];
    if (value < duration) {
      index++;
      continue;
    }
    const result = Math.floor(value / duration);
    parts.push(result + units[index]);

    value %= duration;
    index++;
    unitSize++;
  }

  // if (unitSize < 2 && index !== durations.length) {
  //   const result = Math.floor(value / durations[index]);
  //   parts.push(result + units[index]);
  // }

  return parts.join(' ');
}

Vue.filter('formatDuration', formatDuration);
Vue.filter('boolean', val=>val?'是':'否');

Vue.filter('formatTimestamp', (timestamp: number) => {
  if (timestamp === null) {
    return '';
  }

  const m = dayjs.unix(timestamp);
  return m.format('YYYY-MM-DD HH:mm:ss');
});

Vue.filter('formatDate', (date: string) => {
  if (!date) {
    return '';
  }

  const m = dayjs(date);
  return m.format('YYYY-MM-DD HH:mm:ss');
});

export function formatAsDuration(date: number, options?: DurationOptions) {
    const duration = (Date.now() / 1000) - date;
    return formatDuration(duration, options);
}

Vue.filter('formatAsDuration', formatAsDuration);

export function formatProgress(progress: number) {
  progress = progress * 100;
  return toPrecision(progress, 3) + '%';
}

Vue.filter('progress', formatProgress);

Vue.filter('torrentStatus',(state: string)=>{
  return _.get({
    'metaDL':'',
    'allocating':'分配中',
    'downloading':'下载中',
    'forcedDL':'强制下载',
    'uploading':'上传中',
    'forcedUP':'强制上传',
    'stalledDL':'等待下载',
    'stalledUP':'等待上传',
    'pausedDL':'暂停下载',
    'pausedUP':'暂停上传',
    'queuedDL':'队列下载',
    'queuedUP':'队列上传',
    'checkingDL':'检查下载',
    'checkingUP':'检查上传',
    'queuedForChecking':'检查队列',
    'checkingResumeData':'检查hash',
    'moving':'移动中',
    'error':'错误',
    'unknown':'未知',
    'missingFiles':'丢失文件'
    },state,state)
})
