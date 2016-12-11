import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';
import LogMonitor from 'redux-devtools-log-monitor';
import React from 'react';

const VERBOSE = process.argv.includes('--verbose');

// Filter out the playback time updates unless verbosely debugging
const blacklist = VERBOSE ? [] : ['GPM_CHANGE_PLAYBACK_TIME'];

export default createDevTools(
  <FilterMonitor blacklist={blacklist}>
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
      <LogMonitor />
    </DockMonitor>
  </FilterMonitor>,
);
