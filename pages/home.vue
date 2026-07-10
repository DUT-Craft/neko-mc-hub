<template>
<main class="page" data-od-id="home-main">
    <section class="page-title home-title" data-od-id="home-title">
      <span class="page-kicker">今日大厅</span>
      <h1>今晚去哪一服？</h1>
      <p class="lead">先复制地址，再去大厅集合；想安静挖方块就走建筑路线。</p>
    </section>

    <section class="lobby-shell" data-od-id="home-lobby-map">
      <div class="lobby-column lobby-column-left">
      <article class="n-card recommend-panel" data-od-id="today-recommendation">
        <div class="minecraft-strip" aria-hidden="true"></div>
        <div class="card-pad recommend-body">
          <div class="event-meta">
            <span class="n-tag tag-active">19:45 大厅集合</span>
            <span class="n-tag tag-event">速通挑战</span>
            <span class="n-tag tag-gold">20:00 开局</span>
            <span class="n-tag">12/30 人</span>
          </div>
          <div>
            <h2>19:45 到大厅，20:00 进活动服</h2>
            <p class="lead">新人先跟猫娘向导进大厅；老玩家直接复制活动服地址。建筑党可以跳到建筑路线。</p>
          </div>
          <ol class="route-ribbon" aria-label="今晚开服动线">
            <li><span>01</span><strong>复制地址</strong></li>
            <li><span>02</span><strong>大厅集合</strong></li>
            <li><span>03</span><strong>进传送门</strong></li>
          </ol>
          <div class="address-line">
            <span>服务器地址</span>
            <strong>event.neko-mc.club</strong>
          </div>
          <div class="button-row">
            <button class="n-button primary" type="button" data-copy="event.neko-mc.club" data-od-id="copy-event-address">复制活动服地址</button>
            <a class="n-button ghost" href="/activities" data-od-id="view-event-rules">查看活动规则</a>
          </div>
        </div>
      </article>

      <aside class="n-card neko-kit" data-od-id="home-neko-kit">
        <span class="neko-avatar" aria-hidden="true"><i></i></span>
        <div class="neko-kit-copy">
          <strong>猫娘向导提示</strong>
          <p>不知道去哪就按物品选：红石做机器，钻石剑打冒险，石英块搭建筑，指南针找路线。</p>
        </div>
        <div class="neko-item-row" aria-label="玩法物品提示">
          <span><span class="pixi pixi-redstone" aria-hidden="true"></span>生电</span>
          <span><span class="pixi pixi-adventure" aria-hidden="true"></span>冒险</span>
          <span><span class="pixi pixi-build" aria-hidden="true"></span>建筑</span>
          <span><span class="pixi pixi-explore" aria-hidden="true"></span>探索</span>
        </div>
      </aside>
      </div>

      <div class="lobby-column lobby-column-right">
      <div class="lobby-map" aria-label="服务器大厅地图" data-od-id="lobby-map">
        <div class="map-path path-x" aria-hidden="true"></div>
        <div class="map-path path-y" aria-hidden="true"></div>
        <a class="map-node portal-node portal-event" href="/servers" data-od-id="portal-event">
          <span class="pixi pixi-event" aria-hidden="true"></span>
          <strong>活动服传送门</strong>
          <em>12/30 · 进行中</em>
        </a>
        <a class="map-node portal-node portal-redstone" href="/servers" data-od-id="portal-redstone">
          <span class="pixi pixi-redstone" aria-hidden="true"></span>
          <strong>生电服传送门</strong>
          <em>5/40 · 常驻</em>
        </a>
        <a class="map-node portal-node portal-lobby" href="/servers" data-od-id="portal-lobby">
          <span class="pixi pixi-lobby" aria-hidden="true"></span>
          <strong>大厅服入口</strong>
          <em>1/60 · 新人先来</em>
        </a>
        <a class="map-node portal-node portal-resource is-muted" href="/servers" data-od-id="portal-resource">
          <span class="pixi pixi-resource" aria-hidden="true"></span>
          <strong>资源服</strong>
          <em>维护中</em>
        </a>
        <a class="map-node sign-node" href="/announcements" data-od-id="map-sign-announcements">
          <span class="pixi pixi-sign" aria-hidden="true"></span>
          <strong>告示牌</strong>
          <em>公告 / 规则</em>
        </a>
        <a class="map-node chest-node" href="/wiki" data-od-id="map-chest-wiki">
          <span class="pixi pixi-chest" aria-hidden="true"></span>
          <strong>箱子</strong>
          <em>Wiki / 整合包</em>
        </a>
        <div class="map-core" data-od-id="map-core">
          <span class="paw-dot" aria-hidden="true"></span>
          <strong>大厅中央</strong>
          <em>先看今晚动线</em>
        </div>
      </div>

      <figure class="lobby-thumb" data-od-id="home-lobby-thumb">
        <img src="/assets/image2-lobby.png" alt="猫娘社 Minecraft 大厅、传送门、箱子和告示牌" />
        <figcaption>
          <span class="neko-guide-line">
            <span class="neko-avatar" aria-hidden="true"><i></i></span>
            <span><strong>猫娘社向导</strong><br />走错也没事，回大厅中央重新选。</span>
          </span>
          <span class="minecraft-trinkets" aria-hidden="true">
            <i class="trinket-grass"></i>
            <i class="trinket-redstone"></i>
            <i class="trinket-sword"></i>
            <i class="trinket-quartz"></i>
          </span>
        </figcaption>
      </figure>
      </div>
    </section>

    <section class="section" data-od-id="home-portal-selector">
      <div class="section-head">
        <h2>传送门选择器</h2>
        <p>按今晚最可能用到的顺序排好，看到地址就能进。</p>
      </div>
      <div class="portal-selector">
        <article class="portal-ticket is-event" data-od-id="portal-ticket-event">
          <span class="pixi pixi-event" aria-hidden="true"></span>
          <div class="portal-ticket-main">
            <h3>活动服</h3>
            <span class="n-tag tag-event">进行中</span>
            <span class="n-tag tag-active">12/30 人</span>
            <code>event.neko-mc.club</code>
          </div>
          <button class="n-button primary" type="button" data-copy="event.neko-mc.club">复制地址</button>
        </article>
        <article class="portal-ticket is-permanent" data-od-id="portal-ticket-redstone">
          <span class="pixi pixi-redstone" aria-hidden="true"></span>
          <div class="portal-ticket-main">
            <h3>生电服</h3>
            <span class="n-tag tag-active">常驻</span>
            <span class="n-tag">5/40 人</span>
            <code>redstone.neko-mc.club</code>
          </div>
          <button class="n-button" type="button" data-copy="redstone.neko-mc.club">复制地址</button>
        </article>
        <article class="portal-ticket is-permanent" data-od-id="portal-ticket-lobby">
          <span class="pixi pixi-lobby" aria-hidden="true"></span>
          <div class="portal-ticket-main">
            <h3>大厅服</h3>
            <span class="n-tag tag-active">新人入口</span>
            <span class="n-tag">1/60 人</span>
            <code>play.neko-mc.club</code>
          </div>
          <button class="n-button" type="button" data-copy="play.neko-mc.club">复制地址</button>
        </article>
        <article class="portal-ticket is-maintenance" data-od-id="portal-ticket-resource">
          <span class="pixi pixi-resource" aria-hidden="true"></span>
          <div class="portal-ticket-main">
            <h3>资源服</h3>
            <span class="n-tag tag-muted">维护中</span>
            <span class="n-tag">0/30 人</span>
            <code>resource.neko-mc.club</code>
          </div>
          <a class="n-button ghost" href="/announcements">查看说明</a>
        </article>
      </div>
    </section>

    <section class="section quiet-dock" data-od-id="home-quiet-dock">
      <a class="dock-sign" href="/announcements" data-od-id="dock-announcements"><span>公告墙</span><strong>速通分组、资源服维护和值班安排</strong></a>
      <a class="dock-sign" href="/applications" data-od-id="dock-applications"><span>申请台</span><strong>邀请码、临时开服和值班申请</strong></a>
      <a class="dock-sign" href="/wiki" data-od-id="dock-wiki"><span>工具箱</span><strong>启动器、皮肤站、规则、整合包</strong></a>
      <a class="dock-sign" href="/history" data-od-id="dock-history"><span>展示廊</span><strong>历史截图、活动记录和建筑回顾</strong></a>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "今日服务器大厅 - 猫娘社 MC 主站" });
</script>
