import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve from this file so the check works from both the project and app folders.
const root = fileURLToPath(new URL('../../', import.meta.url));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8').replace(/^\uFEFF/, ''));
const exists = relative => typeof relative === 'string' && fs.existsSync(path.resolve(root, relative));
const count = rows => rows.reduce((result, row) => {
  result[row.status] = (result[row.status] || 0) + 1;
  return result;
}, {});
const sameCounts = (left, right) => JSON.stringify(Object.entries(left || {}).sort()) === JSON.stringify(Object.entries(right || {}).sort());
const missingLinks = [];
const linkedPaths = new Set();
let checkedLinks = 0;
for (const document of ['app/验收说明.md', 'app/交接记录.md']) {
  const source = fs.readFileSync(path.join(root, document), 'utf8');
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || /^(?:https?:|mailto:|#)/i.test(target)) continue;
    const absolute = path.resolve(root, path.dirname(document), decodeURIComponent(target));
    checkedLinks++;
    linkedPaths.add(absolute);
    if (!fs.existsSync(absolute)) missingLinks.push({ document, target });
  }
  expect(!/^\|.*\|\s*(?:未验证|待修复)\s*\|/m.test(source), `${document}: unresolved acceptance row`);
}
expect(missingLinks.length === 0, 'Acceptance or handoff contains missing evidence links');

const coverage = read('app/checks/coverage.json');
const interactions = read('app/checks/interaction-comparisons.json');
const snapshotStates = new Set(['1440/search', '1440/columns', '1440/table-view', '390/search', '390/columns']);
const snapshotReason = '原站最新稳定交互采样显示0条记录，本地保留较早稳定采样的3条记录；数据状态不同。';
const snapshotRows = interactions.filter(row => row.key === 'user_score_log' && snapshotStates.has(`${row.width}/${row.state}`));
expect(snapshotRows.length === 5, 'Exactly five documented point-log snapshot differences are required');
expect(new Set(snapshotRows.map(row => `${row.width}/${row.state}`)).size === 5, 'Snapshot difference states must be unique');
for (const row of snapshotRows) {
  const label = `${row.key}/${row.width}/${row.state}`;
  expect(row.reason === snapshotReason, `${label}: snapshot reason changed or missing`);
  expect(row.result?.comparable && row.result.perceptual_similarity < .98, `${label}: preserve the measured below-threshold result`);
  expect(row.before?.replaceAll('\\', '/').startsWith(`capture/admin/dialog-investigation/user_score_log-stable-${row.width}/`), `${label}: unexpected source evidence`);
  expect(row.after?.replaceAll('\\', '/').startsWith(`capture/admin/local-states/user_score_log-interactive-${row.width}/`), `${label}: unexpected local evidence`);
  for (const image of [row.before, row.after]) {
    expect(exists(image), `${label}: missing image ${image}`);
    expect(exists(image?.replace(/\.png$/i, '.html')), `${label}: missing companion DOM`);
  }
}
const interactionRows = interactions.map(row => ({
  ...row,
  status: row.result?.comparable && row.result.perceptual_similarity >= .98 ? '已验证'
    : snapshotRows.includes(row) && row.reason === snapshotReason ? '已记录数据差异' : '待修复'
}));
const pageStatus = count(coverage.rows);
const stateStatus = count(interactionRows);
expect(sameCounts(pageStatus, coverage.statusCounts), 'Page status totals disagree with coverage rows');
expect(sameCounts(stateStatus, coverage.interactionStatusCounts), 'Interaction status totals disagree with recorded evidence');
expect(stateStatus['已记录数据差异'] === 5, 'Five snapshot differences must remain separately classified');
expect(coverage.widthChecks === coverage.rows.length, 'Page-width count disagrees with evidence rows');
expect(coverage.interactionStates === interactionRows.length, 'Interaction count disagrees with evidence rows');

const login = read('app/checks/login-closure.json');
const loginRows = login.rows || [];
const allowedLoginStatuses = new Set(['已验证', '已验证（保留差异）']);
expect(loginRows.length === 6, 'Login closure requires three states at both 1440 and 390');
expect(new Set(loginRows.map(row => row.state)).size === 3, 'Login closure requires three distinct states');
expect(new Set(loginRows.map(row => `${row.state}/${row.width}`)).size === 6, 'Login state-width pairs must be unique');
for (const row of loginRows) {
  const label = `login/${row.state}/${row.width}`;
  expect([1440, 390].includes(row.width), `${label}: unexpected viewport width`);
  expect(allowedLoginStatuses.has(row.status), `${label}: unresolved status`);
  expect(typeof row.reason === 'string' && row.reason.trim().length > 0, `${label}: missing verification or retained-difference reason`);
  expect(Array.isArray(row.evidenceIds) && row.evidenceIds.length > 0, `${label}: missing evidence identifiers`);
  expect(row.comparison?.comparable === true, `${label}: missing completed visual comparison`);
  for (const image of [row.sourceImage, row.localImage]) {
    expect(typeof image === 'string' && /\.png$/i.test(image), `${label}: image must name a PNG capture`);
    expect(exists(image), `${label}: missing image ${image}`);
    const dom = image?.replace(/\.png$/i, '.html');
    expect(exists(dom), `${label}: missing companion DOM`);
    if (image) expect(linkedPaths.has(path.resolve(root, image)), `${label}: image absent from acceptance/handoff links`);
    if (dom) expect(linkedPaths.has(path.resolve(root, dom)), `${label}: DOM absent from acceptance/handoff links`);
  }
}
const loginStatus = count(loginRows);
expect(coverage.loginChecks === loginRows.length, 'Login count disagrees with coverage');
expect(sameCounts(loginStatus, coverage.loginStatusCounts), 'Login status totals disagree with coverage');
expect(JSON.stringify(coverage.loginRows) === JSON.stringify(loginRows), 'Coverage login rows differ from login closure evidence');
expect(coverage.closure?.status === 'complete' && coverage.closure?.unverified === 0 && coverage.closure?.needsFix === 0, 'Coverage must explicitly declare completed closure with zero unresolved items');
const unverifiedRows = [...coverage.rows, ...interactionRows, ...loginRows].filter(row => !['已验证', '已记录数据差异', '已验证（保留差异）'].includes(row.status)).length;
expect(unverifiedRows === 0, 'There are unresolved acceptance rows');

const report = {
  updated: new Date().toISOString(),
  pageCount: coverage.pages,
  widthChecks: coverage.rows.length,
  pageStatus,
  states: interactionRows.length,
  stateStatus,
  loginChecks: loginRows.length,
  loginStatus,
  documentedSnapshotDifferences: snapshotRows.length,
  checkedLinks,
  missingLinks,
  unverifiedRows,
  closure: failures.length ? 'failed' : 'complete',
  failures
};
fs.writeFileSync(path.join(root, 'app/checks/acceptance-links.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
