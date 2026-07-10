<template>
<main class="page" data-od-id="wiki-main">
    <section class="page-title compact-title" data-od-id="wiki-title">
      <span class="page-kicker">Wiki</span>
      <h1>工具箱与物品栏</h1>
      <p class="lead">启动器、皮肤站、规则和整合包入口集中放在一个物品栏里。</p>
    </section>

    <section class="toolbox-layout" data-od-id="wiki-toolbox">
      <aside class="toolbox-note" data-od-id="wiki-helper-note">
        <span class="paw-dot" aria-hidden="true"></span>
        <h2>值班提示</h2>
        <p>新人先复制大厅服地址，再按传送牌去活动服、常驻服或冒险组。</p>
        <button class="n-button primary" type="button" data-copy="play.neko-mc.club">复制大厅服地址</button>
      </aside>

      <section class="inventory-panel" aria-label="Wiki 工具箱">
        <div class="inventory-bar">
          <span class="n-tag tag-active">新人推荐</span>
          <span class="n-tag tag-event">指南</span>
          <span class="n-tag tag-gold">整合包</span>
        </div>
        <div class="inventory-grid" data-od-id="wiki-inventory-grid">
          <a class="inventory-slot is-featured" href="#" data-od-id="guide-quick-start">
            <span class="pixi pixi-lobby" aria-hidden="true"></span>
            <strong>快速入服</strong>
            <em>大厅服 → 传送牌 → 目标服务器</em>
          </a>
          <a class="inventory-slot" href="#" data-od-id="guide-hmcl">
            <span class="pixi pixi-guide" aria-hidden="true"></span>
            <strong>HMCL 下载</strong>
            <em>推荐启动器</em>
          </a>
          <a class="inventory-slot" href="#" data-od-id="guide-pcl">
            <span class="pixi pixi-guide" aria-hidden="true"></span>
            <strong>PCL 下载</strong>
            <em>备用启动器</em>
          </a>
          <a class="inventory-slot" href="/applications" data-od-id="guide-skin">
            <span class="pixi pixi-apply" aria-hidden="true"></span>
            <strong>皮肤站注册</strong>
            <em>需要邀请码</em>
          </a>
          <a class="inventory-slot" href="/activities" data-od-id="guide-pack">
            <span class="pixi pixi-pack" aria-hidden="true"></span>
            <strong>整合包安装</strong>
            <em>冒险组 / 小组服</em>
          </a>
          <a class="inventory-slot" href="/announcements" data-od-id="guide-rules">
            <span class="pixi pixi-rules" aria-hidden="true"></span>
            <strong>服务器规则</strong>
            <em>公共资源与活动规则</em>
          </a>
          <a class="inventory-slot" href="/servers" data-od-id="guide-server-status">
            <span class="pixi pixi-server" aria-hidden="true"></span>
            <strong>服务器状态</strong>
            <em>在线 / 维护 / 地址</em>
          </a>
          <a class="inventory-slot" href="/history" data-od-id="guide-gallery">
            <span class="pixi pixi-history" aria-hidden="true"></span>
            <strong>活动展示廊</strong>
            <em>截图与记录</em>
          </a>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "社团 Wiki 与入服指南 - 猫娘社 MC 主站" });
</script>
