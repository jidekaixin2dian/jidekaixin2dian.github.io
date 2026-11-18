(() => {
  const { prs, asOf } = window.PORTFOLIO_ACTIVITY;
  const checked = document.querySelector('#contributions time');
  checked.dateTime = asOf;
  checked.textContent = asOf.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$1 年 $2 月 $3 日');
  const projects = window.PORTFOLIO_PROJECTS;
  const statusLabels = { merged: '已合入', open: '开放中', closed: '已关闭 · 未合入' };
  const releaseList = document.getElementById('release-list');
  const releases = projects.filter(item => item.release).sort((a,b) => b.release.date.localeCompare(a.release.date));
  for (const project of releases) {
    const link = document.createElement('a');
    link.className = 'release-entry';
    link.href = 'https://github.com/jidekaixin2dian/' + project.repo + '/releases/tag/v' + project.release.version;
    link.innerHTML = `<span><strong>${project.name}</strong><small>v${project.release.version} ↗</small></span><p>${project.release.summary}</p><time datetime="${project.release.date}">${project.release.date}</time>`;
    releaseList.append(link);
  }

  function prLink(pr, showDate = false) {
    const link = document.createElement('a');
    link.className = 'pr-entry';
    link.href = 'https://github.com/' + pr.repo + '/pull/' + pr.number;
    link.innerHTML = `<span><small>${pr.repo.split('/')[1]} #${pr.number}</small><small class="pr-state">${statusLabels[pr.status]}</small></span><strong>${pr.title} ↗</strong>`;
    if (showDate) {
      const date = document.createElement('time');
      date.dateTime = pr.date;
      date.textContent = pr.date + ' ' + ({open:'提交',merged:'合入',closed:'关闭'})[pr.status];
      link.append(date);
    }
    return link;
  }
  const count = status => prs.filter(pr => pr.status === status).length;
  const catalogMerges = prs.filter(pr => pr.status === 'merged' && pr.repo === 'awesome-dsh-plugin/awesome-dsh-plugin').length;
  document.getElementById('pr-count').textContent = `${count('merged')} 个已合入（含 ${catalogMerges} 项插件目录更新）· ${count('open')} 个开放中 · ${count('closed')} 个已关闭未合入`;
  const highlights = document.getElementById('pr-highlights');
  const featured = new Set(['dsh-windows-mcp/13','dsh-wallpaper-engine/347','pi-web/1462','DSH-better-sidebar/738']);
  for (const pr of prs) {
    if (featured.has(pr.repo.split('/')[1] + '/' + pr.number)) highlights.append(prLink(pr));
  }
  const archive = document.getElementById('pr-list');
  for (const pr of prs) archive.append(prLink(pr, true));
  document.querySelector('#pr-archive summary').textContent = '查看全部 ' + prs.length + ' 个 PR';
})();
