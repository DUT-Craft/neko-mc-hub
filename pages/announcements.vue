<template>
<main class="page" data-od-id="announcements-main">
    <section class="page-title compact-title" data-od-id="announcements-title">
      <span class="page-kicker">公告</span>
      <h1>告示牌墙</h1>
      <p class="lead">活动、维护、规则和值班管理都贴在这里。</p>
    </section>

    <section class="notice-wall" data-od-id="notice-wall">
      <article class="notice-sign notice-sign-large" data-od-id="latest-announcement-sign">
        <div class="tag-row"><span class="n-tag tag-gold">最新公告</span><span class="n-tag tag-event">活动通知</span><span class="n-tag">今天 18:20</span></div>
        <h2>本周速通挑战今晚开局</h2>
        <p>活动服 20:00 开放，19:45 到大厅服集合。冒险组玩家请先确认整合包版本，缺人时会在群内补位。</p>
        <div class="button-row">
          <a class="n-button primary" href="/activities">查看活动页</a>
          <button class="n-button" type="button" data-copy="event.neko-mc.club">复制活动服地址</button>
        </div>
      </article>

      <div class="notice-pinboard" data-od-id="announcement-pinboard">
        <article class="notice-paper" data-od-id="notice-item-event">
          <span class="n-tag tag-event">活动通知</span>
          <time>今天 18:20</time>
          <h3>每周速通挑战分组说明</h3>
          <p>本周开放两队，缺人优先补到活动服 A 队。</p>
        </article>
        <article class="notice-paper" data-od-id="notice-item-maintenance">
          <span class="n-tag tag-muted">维护通知</span>
          <time>昨天 22:10</time>
          <h3>资源服换周目维护</h3>
          <p>资源服预计维护到周五晚，期间不要尝试进入。</p>
        </article>
        <article class="notice-paper" data-od-id="notice-item-update">
          <span class="n-tag tag-active">服务器更新</span>
          <time>周三 12:30</time>
          <h3>大厅服新增传送牌</h3>
          <p>新人可直接从大厅服查看所有服务器入口。</p>
        </article>
        <article class="notice-paper" data-od-id="notice-item-duty">
          <span class="n-tag tag-gold">社团通知</span>
          <time>周一 09:00</time>
          <h3>本周值班管理安排</h3>
          <p>皮肤站、活动、技术和值班问题按事项联系。</p>
        </article>
      </div>

      <aside class="duty-board" data-od-id="manager-contact-card">
        <span class="n-tag tag-active">值班管理</span>
        <h2>不知道找谁？先找本周值班。</h2>
        <p>申请和技术问题请带上 Minecraft ID，活动问题带上服务器名。</p>
        <div class="manager-line"><strong>小樱</strong><span>QQ 12345678 · 皮肤站 / 注册 / 邀请码</span></div>
        <div class="manager-line"><strong>石英</strong><span>QQ 23456789 · 开服 / 技术 / 整合包</span></div>
        <div class="manager-line"><strong>木牌</strong><span>QQ 34567890 · 活动 / 规则 / 值班</span></div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "公告栏 - 猫娘社 MC 主站" });
</script>
