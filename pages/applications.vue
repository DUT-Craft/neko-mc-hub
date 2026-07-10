<template>
<main class="page" data-od-id="applications-main">
    <section class="page-title compact-title" data-od-id="applications-title">
      <span class="page-kicker">申请</span>
      <h1>任务委托板</h1>
      <p class="lead">选择一张委托，填写必要信息，值班管理会按顺序处理。</p>
    </section>

    <section class="commission-board" data-tabs data-od-id="application-layout">
      <aside class="task-menu" data-od-id="application-tabs-card">
        <h2>申请类型</h2>
        <div class="n-tabs">
          <button class="tab-btn is-active" type="button" data-tab-target="skin-form"><span>皮肤站邀请码</span><em>注册账号</em></button>
          <button class="tab-btn" type="button" data-tab-target="server-form"><span>开服申请</span><em>临时服务器</em></button>
          <button class="tab-btn" type="button" data-tab-target="duty-form"><span>值班申请</span><em>协助社员</em></button>
        </div>
        <p class="form-note">尽量填写能让管理核对的信息；不知道怎么填时可以先联系本周值班。</p>
      </aside>

      <section class="n-card card-pad commission-form" data-od-id="application-form-card">
        <form class="n-form tab-panel is-active" id="skin-form" data-tab-panel data-application-form data-od-id="skin-application-form">
          <div class="quest-head">
            <span class="n-tag tag-active">任务目标：注册皮肤站账号</span>
            <h2>皮肤站邀请码申请</h2>
            <p class="form-note">填写姓名、学号、QQ 和 Minecraft ID，方便值班管理核对。</p>
          </div>
          <div class="form-grid">
            <div class="field"><label for="skin-name">姓名</label><input id="skin-name" name="name" placeholder="请输入姓名" required /></div>
            <div class="field"><label for="skin-student">学号</label><input id="skin-student" name="student" placeholder="用于社团身份核对" required /></div>
            <div class="field"><label for="skin-qq">QQ</label><input id="skin-qq" name="qq" placeholder="例如 12345678" required /></div>
            <div class="field"><label for="skin-mcid">Minecraft ID</label><input id="skin-mcid" name="mcid" placeholder="游戏内 ID" required /></div>
          </div>
          <div class="field"><label for="skin-reason">申请理由</label><textarea id="skin-reason" name="reason" placeholder="简单说明你是谁，以及为什么需要邀请码"></textarea></div>
          <div class="result"></div>
          <div class="button-row"><button class="n-button primary" type="submit">提交邀请码申请</button></div>
        </form>

        <form class="n-form tab-panel" id="server-form" data-tab-panel data-application-form data-od-id="server-application-form">
          <div class="quest-head">
            <span class="n-tag tag-event">任务目标：申请临时小组服务器</span>
            <h2>开服申请</h2>
            <p class="form-note">用于活动、小组玩法或临时服务器申请，方便管理评估资源和时间。</p>
          </div>
          <div class="form-grid">
            <div class="field"><label for="server-owner">申请人</label><input id="server-owner" name="owner" placeholder="你的昵称或姓名" required /></div>
            <div class="field"><label for="server-count">参与人数</label><input id="server-count" name="count" placeholder="例如 8 人" required /></div>
            <div class="field"><label for="server-purpose">服务器用途</label><select id="server-purpose" name="purpose"><option>速通活动</option><option>小游戏</option><option>冒险组</option><option>建筑测试</option></select></div>
            <div class="field"><label for="server-time">预计时间</label><input id="server-time" name="time" placeholder="例如 本周六晚" /></div>
          </div>
          <div class="field"><label for="server-plugin">插件 / 整合包需求</label><textarea id="server-plugin" name="plugin" placeholder="说明是否需要插件、模组、地图或白名单"></textarea></div>
          <div class="field"><label for="server-contact">联系方式</label><input id="server-contact" name="contact" placeholder="QQ 或群昵称" /></div>
          <div class="result"></div>
          <div class="button-row"><button class="n-button primary" type="submit">提交开服申请</button></div>
        </form>

        <form class="n-form tab-panel" id="duty-form" data-tab-panel data-application-form data-od-id="duty-application-form">
          <div class="quest-head">
            <span class="n-tag tag-gold">任务目标：协助新人和活动</span>
            <h2>值班申请</h2>
            <p class="form-note">适合愿意协助新人、活动、规则提醒或技术排障的社员。</p>
          </div>
          <div class="form-grid">
            <div class="field"><label for="duty-name">姓名</label><input id="duty-name" name="name" placeholder="请输入姓名" required /></div>
            <div class="field"><label for="duty-qq">QQ</label><input id="duty-qq" name="qq" placeholder="例如 12345678" required /></div>
            <div class="field"><label for="duty-time">可值班时间</label><input id="duty-time" name="time" placeholder="例如 周五晚 / 周末下午" /></div>
            <div class="field"><label for="duty-skill">擅长内容</label><select id="duty-skill" name="skill"><option>新人引导</option><option>活动组织</option><option>技术排障</option><option>规则维护</option></select></div>
          </div>
          <div class="field"><label for="duty-note">备注</label><textarea id="duty-note" name="note" placeholder="还有什么想让管理知道的"></textarea></div>
          <div class="result"></div>
          <div class="button-row"><button class="n-button primary" type="submit">提交值班申请</button></div>
        </form>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({ title: "申请中心 - 猫娘社 MC 主站" });
</script>
