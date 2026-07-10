<template>
<main class="page" data-od-id="servers-main">
    <section class="page-title compact-title" data-od-id="servers-title">
      <span class="page-kicker">服务器</span>
      <h1>服务器状态终端</h1>
      <p class="lead">先看状态和在线人数，再复制地址；说明文字只放在详情里。</p>
    </section>

    <section class="server-console" data-od-id="server-console">
      <div class="filters terminal-filters" data-filter-group>
        <button class="filter-chip is-active" type="button" data-filter="all">全部</button>
        <button class="filter-chip" type="button" data-filter="activity">活动服</button>
        <button class="filter-chip" type="button" data-filter="permanent">常驻</button>
        <button class="filter-chip" type="button" data-filter="pack">整合包</button>
        <button class="filter-chip" type="button" data-filter="maintenance">维护中</button>
        <button class="filter-chip" type="button" data-filter="online">有人在线</button>
      </div>

      <div class="server-terminal" data-od-id="server-terminal">
        <section class="server-select-list" aria-label="服务器列表">
          <article class="server-row is-selected is-event" tabindex="0" data-server-card data-terminal-card data-type="activity online" data-name="活动服" data-status="活动中" data-online="12/30 人" data-address="event.neko-mc.club" data-version="1.21.1" data-pack="不需要整合包" data-rules="速通期间禁止提前破坏出生点资源，分组以当晚公告为准。" data-desc="每周速通挑战、小游戏和临时小组服都从这里进入。" data-od-id="server-row-event">
            <span class="pixi pixi-event" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>活动服</h3>
              <span class="n-tag tag-event">活动中</span>
              <span class="n-tag tag-active">12/30 人</span>
              <code>event.neko-mc.club</code>
            </div>
            <button class="n-button primary" type="button" data-copy="event.neko-mc.club">复制地址</button>
          </article>

          <article class="server-row is-permanent" tabindex="0" data-server-card data-terminal-card data-type="permanent online" data-name="生电服" data-status="常驻" data-online="5/40 人" data-address="redstone.neko-mc.club" data-version="1.20.4" data-pack="不需要整合包" data-rules="公共机器先登记再改动，长期材料仓库按区域领取。" data-desc="长期生电、材料生产线和公共工程建设。" data-od-id="server-row-redstone">
            <span class="pixi pixi-redstone" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>生电服</h3>
              <span class="n-tag tag-active">常驻</span>
              <span class="n-tag">5/40 人</span>
              <code>redstone.neko-mc.club</code>
            </div>
            <button class="n-button" type="button" data-copy="redstone.neko-mc.club">复制地址</button>
          </article>

          <article class="server-row is-event" tabindex="0" data-server-card data-terminal-card data-type="activity pack online" data-name="冒险组" data-status="小组活动" data-online="3/20 人" data-address="adventure.neko-mc.club" data-version="1.20.1 Forge" data-pack="QQ群文件：猫娘社冒险组整合包 v3" data-rules="进入前必须安装整合包，组队路线由当天队长确认。" data-desc="冒险组、剧情探索和模组合作玩法。" data-od-id="server-row-adventure">
            <span class="pixi pixi-adventure" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>冒险组</h3>
              <span class="n-tag tag-event">活动/小组</span>
              <span class="n-tag tag-gold">3/20 人</span>
              <code>adventure.neko-mc.club</code>
            </div>
            <button class="n-button" type="button" data-copy="adventure.neko-mc.club">复制地址</button>
          </article>

          <article class="server-row is-permanent" tabindex="0" data-server-card data-terminal-card data-type="permanent" data-name="建筑服" data-status="常驻开放" data-online="0/30 人" data-address="build.neko-mc.club" data-version="1.21.1" data-pack="不需要整合包" data-rules="公共建筑请先登记位置，避免占用主路和公共景观。" data-desc="建筑、截图、社团展示区和慢节奏创作。这个服现在没人，适合安静盖房。" data-od-id="server-row-build">
            <span class="pixi pixi-build" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>建筑服</h3>
              <span class="n-tag tag-active">常驻</span>
              <span class="n-tag">0/30 人</span>
              <code>build.neko-mc.club</code>
            </div>
            <button class="n-button" type="button" data-copy="build.neko-mc.club">复制地址</button>
          </article>

          <article class="server-row is-permanent" tabindex="0" data-server-card data-terminal-card data-type="permanent online" data-name="大厅服" data-status="新人入口" data-online="1/60 人" data-address="play.neko-mc.club" data-version="1.21.1" data-pack="不需要整合包" data-rules="新人先在大厅服阅读公告牌，再根据传送牌进入对应服务器。" data-desc="新人集合、公告牌、传送牌和基础教程入口。" data-od-id="server-row-lobby">
            <span class="pixi pixi-lobby" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>大厅服</h3>
              <span class="n-tag tag-active">新人入口</span>
              <span class="n-tag">1/60 人</span>
              <code>play.neko-mc.club</code>
            </div>
            <button class="n-button" type="button" data-copy="play.neko-mc.club">复制地址</button>
          </article>

          <article class="server-row is-maintenance" tabindex="0" data-server-card data-terminal-card data-type="permanent maintenance" data-name="资源服" data-status="维护中" data-online="0/30 人" data-address="resource.neko-mc.club" data-version="1.20.4" data-pack="不需要整合包" data-rules="资源服维护期间不可进入，开放时间以公告栏维护通知为准。" data-desc="资源、养老、采集和临时周目，当前正在换周目。" data-od-id="server-row-resource">
            <span class="pixi pixi-resource" aria-hidden="true"></span>
            <div class="server-row-main">
              <h3>资源服</h3>
              <span class="n-tag tag-muted">维护中</span>
              <span class="n-tag">0/30 人</span>
              <code>resource.neko-mc.club</code>
            </div>
            <a class="n-button ghost" href="/announcements">维护说明</a>
          </article>
        </section>

        <aside class="n-card terminal-panel" data-od-id="server-detail-terminal">
          <div class="terminal-topline">
            <span class="paw-dot" aria-hidden="true"></span>
            <span>选中服务器</span>
          </div>
          <div class="terminal-hero">
            <span class="pixi pixi-event" data-terminal-icon aria-hidden="true"></span>
            <div>
              <h2 data-terminal-name>活动服</h2>
              <p data-terminal-desc>每周速通挑战、小游戏和临时小组服都从这里进入。</p>
            </div>
          </div>
          <dl class="status-grid">
            <div><dt>状态</dt><dd data-terminal-status>活动中</dd></div>
            <div><dt>在线</dt><dd data-terminal-online>12/30 人</dd></div>
            <div><dt>版本</dt><dd data-terminal-version>1.21.1</dd></div>
            <div><dt>整合包</dt><dd data-terminal-pack>不需要整合包</dd></div>
          </dl>
          <div class="terminal-address">
            <span>地址</span>
            <strong data-terminal-address>event.neko-mc.club</strong>
          </div>
          <p class="terminal-rules" data-terminal-rules>速通期间禁止提前破坏出生点资源，分组以当晚公告为准。</p>
          <div class="button-row">
            <button class="n-button primary" type="button" data-copy="event.neko-mc.club" data-terminal-copy>复制地址</button>
            <a class="n-button ghost" href="/announcements">查看规则</a>
          </div>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "全部服务器 - 猫娘社 MC 主站" });
</script>
