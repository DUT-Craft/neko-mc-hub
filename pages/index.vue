<template>
<main class="page" data-od-id="launcher-main">
    <section class="page-title home-title" data-od-id="launcher-title">
      <span class="page-kicker">入口大厅</span>
      <h1>猫娘社服务器大厅入口</h1>
      <p class="lead">马上开玩先进今日大厅；查规则、申请和值班安排，直接看下面的告示牌。</p>
    </section>

    <section class="entry-concourse" data-od-id="launcher-concourse">
      <a class="entry-primary" href="/home" data-od-id="launcher-home">
        <span class="pixi pixi-lobby" aria-hidden="true"></span>
        <div>
          <span class="n-tag tag-active">推荐入口</span>
          <h2>进入今日服务器大厅</h2>
          <p>今晚去哪一服、谁在线、地址复制，都先在这里确认。</p>
          <span class="neko-guide-badge"><span class="neko-avatar" aria-hidden="true"><i></i></span>猫娘向导在大厅门口递路线牌</span>
        </div>
      </a>

      <div class="entry-status-board" data-od-id="launcher-status">
        <div><strong class="num">18</strong><span>当前在线</span></div>
        <div><strong class="num">6</strong><span>登记服务器</span></div>
        <div><strong class="num">3</strong><span>本周活动</span></div>
        <div><strong class="num">3</strong><span>申请类型</span></div>
      </div>
    </section>

    <section class="quiet-dock" data-od-id="launcher-pages">
      <a class="dock-sign" href="/servers" data-od-id="launcher-card-servers"><span>状态终端</span><strong>服务器、在线、版本、地址</strong></a>
      <a class="dock-sign" href="/activities" data-od-id="launcher-card-activities"><span>任务板</span><strong>速通、小游戏、冒险组</strong></a>
      <a class="dock-sign" href="/announcements" data-od-id="launcher-card-announcements"><span>告示牌墙</span><strong>公告、维护和值班管理</strong></a>
      <a class="dock-sign" href="/applications" data-od-id="launcher-card-applications"><span>委托板</span><strong>邀请码、开服和值班申请</strong></a>
      <a class="dock-sign" href="/wiki" data-od-id="launcher-card-wiki"><span>工具箱</span><strong>启动器、皮肤站、规则</strong></a>
      <a class="dock-sign" href="/history" data-od-id="launcher-card-history"><span>展示廊</span><strong>截图墙和活动回顾</strong></a>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "猫娘社 MC 主站入口" });
</script>
