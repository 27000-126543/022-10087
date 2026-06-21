export interface AdminConfig {
  id: string
  type: 'store-expression' | 'banned-claim' | 'promotion' | 'complaint-template'
  title: string
  content: string
  active: boolean
}

const adminDefaults: AdminConfig[] = [
  {
    id: 'admin-expr-1',
    type: 'store-expression',
    title: '欢迎到店问候',
    content: '您好，欢迎来到我们门店，请问今天想了解哪方面的项目呢？我们有专业的顾问为您做一对一的皮肤分析和方案推荐。',
    active: true,
  },
  {
    id: 'admin-expr-2',
    type: 'store-expression',
    title: '项目推荐开场',
    content: '根据您的皮肤检测结果，我为您推荐几个最适合的方案，您可以了解一下，不着急做决定，我们慢慢聊。',
    active: true,
  },
  {
    id: 'admin-expr-3',
    type: 'store-expression',
    title: '送客结语',
    content: '感谢您今天的到店咨询，回去后有任何问题随时联系我们。我们会在三天内回访了解您的恢复情况，祝您越来越好！',
    active: true,
  },
  {
    id: 'admin-expr-4',
    type: 'store-expression',
    title: '术后关怀话术',
    content: '您好，您做完项目已经X天了，恢复情况怎么样？有没有不舒服的地方？术后护理方面我再跟您确认一下注意事项。',
    active: true,
  },
  {
    id: 'admin-banned-1',
    type: 'banned-claim',
    title: '禁止绝对化效果承诺',
    content: '禁止使用"保证根治""永久有效""100%有效""一次搞定"等绝对化表述，应使用"显著改善""多数客人反馈""临床数据显示"等客观表述。',
    active: true,
  },
  {
    id: 'admin-banned-2',
    type: 'banned-claim',
    title: '禁止医疗术语误导',
    content: '禁止将生活美容项目描述为医疗行为，禁止使用"手术""治疗""治愈"等医疗术语描述非医疗项目，避免误导消费者。',
    active: true,
  },
  {
    id: 'admin-banned-3',
    type: 'banned-claim',
    title: '禁止贬低竞品',
    content: '禁止使用贬低性语言评价其他机构或产品，如"他们家做的都不行""那种产品很烂"等，应客观比较，用数据和事实说话。',
    active: true,
  },
  {
    id: 'admin-banned-4',
    type: 'banned-claim',
    title: '禁止夸大适应症',
    content: '禁止超范围宣传项目适应症，如将补水项目宣传为抗衰、将除皱项目宣传为瘦脸等，须严格按产品注册适应症描述。',
    active: true,
  },
  {
    id: 'admin-promo-1',
    type: 'promotion',
    title: '新客首次体验套餐',
    content: '新客专享：皮肤检测+水光针/光子嫩肤二选一，首次体验价XXX元（原价XXX元），限量预约中。仅限首次到店客人使用，不可与其他优惠叠加。',
    active: true,
  },
  {
    id: 'admin-promo-2',
    type: 'promotion',
    title: '抗衰联合疗程优惠',
    content: '热玛吉+超声刀联合抗衰疗程，立减XXX元，另赠3次水光针补水保养。联合治疗效果1+1>2，名额有限，预约从速。',
    active: true,
  },
  {
    id: 'admin-promo-3',
    type: 'promotion',
    title: '老客带新客奖励',
    content: '老客推荐新客到店，双方各获赠1次光子嫩肤体验。推荐越多奖励越多，年度推荐王更有专属大礼包！',
    active: true,
  },
  {
    id: 'admin-complaint-1',
    type: 'complaint-template',
    title: '术后效果不满意',
    content: '非常抱歉您对术后效果不满意，我们理解您的感受。请您先不要着急，安排您到院由医生面诊评估，根据具体情况制定调整方案。我们的目标始终是让您满意。',
    active: true,
  },
  {
    id: 'admin-complaint-2',
    type: 'complaint-template',
    title: '术后不良反应',
    content: '收到您的反馈我们非常重视，术后的不适感让您受苦了我们深表歉意。请您详细描述目前的症状和出现时间，我们立即安排医生跟进。如情况紧急请直接到院，我们会第一时间处理。',
    active: true,
  },
  {
    id: 'admin-complaint-3',
    type: 'complaint-template',
    title: '服务态度投诉',
    content: '感谢您的反馈，对于服务中的不足我们深表歉意。我们始终重视每一位客人的体验，会立即调查核实并改进。我们会安排专人跟进，给您一个满意的答复。',
    active: true,
  },
]

export default adminDefaults
export { adminDefaults as defaultAdminConfigs }
