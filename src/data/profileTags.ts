export interface ProfileTag {
  id: string
  name: string
  group: 'frequency' | 'skin' | 'urgency' | 'spending' | 'personality'
  toneModifier: 'warm' | 'professional' | 'urgent' | 'cautious' | 'enthusiastic'
  description: string
}

const profileTags: ProfileTag[] = [
  {
    id: 'tag-new-customer',
    name: '新客',
    group: 'frequency',
    toneModifier: 'warm',
    description: '首次到店或首次咨询的客人，需要更多项目介绍和信任建立，话术应亲切耐心，避免过度推销。',
  },
  {
    id: 'tag-regular-customer',
    name: '熟客',
    group: 'frequency',
    toneModifier: 'professional',
    description: '多次到店的老客人，对项目有一定了解，话术可以更专业高效，注重效果数据和方案优化。',
  },
  {
    id: 'tag-sensitive-skin',
    name: '敏感肌',
    group: 'skin',
    toneModifier: 'cautious',
    description: '皮肤容易泛红、过敏的客人，话术需强调安全性、低刺激性，推荐温和项目和逐步方案。',
  },
  {
    id: 'tag-dull-skin',
    name: '暗沉肌',
    group: 'skin',
    toneModifier: 'warm',
    description: '肤色暗沉无光泽的客人，注重提亮和补水项目推荐，话术以改善效果为导向。',
  },
  {
    id: 'tag-acne-skin',
    name: '痘痘肌',
    group: 'skin',
    toneModifier: 'cautious',
    description: '有痘痘或痘印问题的客人，需注意项目选择避免加重炎症，话术谨慎推荐适合的消炎和修复方案。',
  },
  {
    id: 'tag-wedding-urgent',
    name: '婚前急需',
    group: 'urgency',
    toneModifier: 'urgent',
    description: '婚期临近需要快速改善皮肤状态的客人，话术侧重见效快、恢复期短的项目组合方案。',
  },
  {
    id: 'tag-postop-repair',
    name: '术后返修',
    group: 'urgency',
    toneModifier: 'cautious',
    description: '之前在他处做过项目效果不理想或出现问题的客人，话术需共情安抚，谨慎评估后再制定修复方案。',
  },
  {
    id: 'tag-high-spending',
    name: '高消费力',
    group: 'spending',
    toneModifier: 'professional',
    description: '消费能力较强、愿意为品质买单的客人，话术可推荐高端项目组合和长期管理方案。',
  },
  {
    id: 'tag-price-sensitive',
    name: '价格敏感',
    group: 'spending',
    toneModifier: 'warm',
    description: '对价格比较敏感的客人，话术侧重性价比和分期方案，避免推荐过于昂贵的组合。',
  },
  {
    id: 'tag-hesitant',
    name: '犹豫型',
    group: 'personality',
    toneModifier: 'warm',
    description: '决策犹豫、反复比较的客人，话术需要更多案例分享和耐心引导，不给过多压力。',
  },
  {
    id: 'tag-impulsive',
    name: '冲动型',
    group: 'personality',
    toneModifier: 'enthusiastic',
    description: '决策快速、容易冲动的客人，话术需要适度引导理性思考，确保选择适合的方案而非最贵的。',
  },
  {
    id: 'tag-rational',
    name: '理性对比型',
    group: 'personality',
    toneModifier: 'professional',
    description: '注重数据对比和原理分析的客人，话术以专业数据和科学原理为主，提供充分的对比信息。',
  },
]

export default profileTags
export { profileTags as defaultProfileTags }
