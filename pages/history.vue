<template>
<main class="page" data-od-id="history-main">
    <section class="page-title compact-title" data-od-id="history-title">
      <span class="page-kicker">回顾</span>
      <h1>活动照片展示廊</h1>
      <p class="lead">速通、小游戏、冒险组和建筑活动用截图墙保存。</p>
    </section>

    <section class="gallery-wall" data-od-id="history-gallery-wall">
      <article class="polaroid polaroid-large" data-od-id="cover-speedrun">
        <img src="/assets_activity-speedrun-image2.png" alt="夏季速通夜活动截图" />
        <div><strong>夏季速通夜</strong><span>7 月 5 日 · 活动服 · 24 张截图</span></div>
      </article>
      <article class="polaroid" data-od-id="cover-adventure">
        <img src="/assets/bg-neko-portal-soft.png" alt="暮色冒险组活动截图" />
        <div><strong>暮色冒险组</strong><span>6 月 28 日 · 冒险组 · 18 张截图</span></div>
      </article>
      <article class="polaroid" data-od-id="cover-build">
        <img src="/assets/bg-neko-corner-soft.png" alt="木屋建筑赛活动截图" />
        <div><strong>木屋建筑赛</strong><span>6 月 16 日 · 建筑服 · 32 张截图</span></div>
      </article>
      <article class="polaroid" data-od-id="cover-minigame">
        <img src="/image-gpt-image-2-mr831dx0.png" alt="方块接力赛活动截图" />
        <div><strong>方块接力赛</strong><span>6 月 8 日 · 活动服 · 15 张截图</span></div>
      </article>
      <article class="polaroid" data-od-id="cover-site-record">
        <img src="/mraw9rm5-QQ_1783443597445.png" alt="主站活动记录截图" />
        <div><strong>主站记录整理</strong><span>站内截图 · 申请与公告迭代</span></div>
      </article>
    </section>

    <section class="section record-rail" data-od-id="history-records">
      <div class="section-head">
        <h2>最近记录</h2>
        <p>每条记录保留活动时间、服务器和回看入口。</p>
      </div>
      <div class="record-list">
        <article class="record-row" data-od-id="history-speedrun-card"><span class="pixi pixi-event" aria-hidden="true"></span><strong>夏季速通夜</strong><span>7 月 5 日 · 活动服</span><button class="n-button" type="button">查看记录</button></article>
        <article class="record-row" data-od-id="history-adventure-card"><span class="pixi pixi-explore" aria-hidden="true"></span><strong>暮色探索小队</strong><span>6 月 28 日 · 冒险组</span><button class="n-button" type="button">查看记录</button></article>
        <article class="record-row" data-od-id="history-build-card"><span class="pixi pixi-build" aria-hidden="true"></span><strong>木屋建筑赛</strong><span>6 月 16 日 · 建筑服</span><button class="n-button" type="button">查看记录</button></article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "历史活动记录 - 猫娘社 MC 主站" });
</script>
