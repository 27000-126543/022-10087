export type ToneModifier = 'warm' | 'professional' | 'urgent' | 'cautious' | 'enthusiastic'

export interface ScriptEntry {
  id: string
  keywords: string[]
  empathy: string
  explanation: string
  guide: string
  category: string
  projectRef?: string
  toneOverrides?: Record<string, { empathy?: string; explanation?: string; guide?: string }>
}

const scripts: ScriptEntry[] = [
  {
    id: 'script-thermage-pain',
    keywords: ['热玛吉', '疼', '疼痛', '怕痛'],
    empathy: '很多客人第一次做热玛吉都会有这个担心，您的顾虑非常正常。',
    explanation: '热玛吉确实会有一定热感，但新一代设备温控更精准，操作中我们会持续监测表皮温度，确保在舒适范围内完成治疗。',
    guide: '建议您术前可以敷表麻40分钟，治疗中我们也会用冷喷辅助降温。如果您特别敏感，可以选择分区域短时操作模式。',
    category: '抗衰',
    projectRef: 'proj-thermage',
    toneOverrides: {
      warm: { empathy: '亲爱的，第一次做热玛吉担心疼是完全正常的，很多客人一开始都有这个顾虑呢。' },
      cautious: { explanation: '热玛吉热感是正常的组织反应，如果您是敏感肌，我们会额外关注表皮温度，全程低温操作。' },
      urgent: { guide: '时间紧迫的话，我们可以在敷麻同时进行其他准备，不会耽误整体流程。' },
      professional: { explanation: '热玛吉通过射频能量加热真皮层至65-70°C，表皮温度控制在40°C以下，配合冷媒系统确保安全舒适。' },
    },
  },
  {
    id: 'script-water-shine-effect',
    keywords: ['水光针', '效果', '多久见效', '有没有用'],
    empathy: '您关心效果是完全可以理解的，我们做项目就是希望看到实实在在的改变。',
    explanation: '水光针注射后3-7天开始显现效果，2-4周达到最佳状态。一般建议3次为一个疗程，间隔2-4周，效果会叠加更持久。',
    guide: '首次做水光针的客人，我建议先做一个疗程3次，这样皮肤的含水量和光泽度会有非常明显的提升。',
    category: '注射',
    projectRef: 'proj-water-shine',
    toneOverrides: {
      warm: { empathy: '亲爱的，关心效果是应该的，花钱就是要看到变化的嘛！' },
      cautious: { explanation: '水光针是基础补水项目，成分透明质酸是人体自有物质，敏感肌也可以安心选择，我们会选用低浓度配方。' },
      urgent: { guide: '如果婚期临近，建议选择长效水光配合即刻补水面膜，当天就能看到水润感。' },
      professional: { explanation: '水光针通过负压注射将小分子玻尿酸送入真皮层，提升皮肤含水量约30%-50%，效果维持3-6个月。' },
    },
  },
  {
    id: 'script-budget-antiaging',
    keywords: ['预算', '抗衰', '便宜', '性价比'],
    empathy: '理性消费非常明智，我们也会帮您把每一分钱花在刀刃上。',
    explanation: '抗衰不一定要做最贵的项目，关键是对症下药。不同年龄段和肤况，适合的方案差异很大。比如初期抗衰，光电+水光的组合性价比就很高。',
    guide: '建议您先做一个皮肤检测，我们根据实际需求推荐最适合的方案，避免过度消费。也可以先做基础项目，后续再逐步升级。',
    category: '抗衰',
    toneOverrides: {
      warm: { empathy: '亲爱的，合理规划预算是很好的习惯，我们一定会给您最实在的方案。' },
      cautious: { guide: '预算有限的情况下，建议优先选择温和的射频类项目，效果稳定且恢复期短，不容易出问题。' },
      urgent: { guide: '如果时间紧又想控制预算，可以先做一次光子嫩肤+水光针组合，见效快且费用相对可控。' },
      professional: { explanation: '抗衰方案的投入产出比取决于能量设备的精准度和注射材料的选择，并非价格越高效果越好。' },
    },
  },
  {
    id: 'script-botox-safety',
    keywords: ['肉毒素', '安全', '副作用', '中毒'],
    empathy: '安全是第一位的，您有这样的顾虑说明您很负责任。',
    explanation: '肉毒素在医美领域应用已超过20年，是FDA和NMPA双认证的成熟产品。我们使用的剂量远低于中毒剂量，正规操作非常安全。',
    guide: '我们使用的是经过认证的品牌产品，医生会根据您的肌肉情况精准计算剂量。术后1-2周效果显现，如有任何不适可随时联系。',
    category: '注射',
    projectRef: 'proj-botox',
    toneOverrides: {
      warm: { empathy: '亲爱的，担心安全是人之常情，换做我也会多了解一些再决定。' },
      cautious: { explanation: '肉毒素是高度提纯的蛋白质，会被人体自然代谢，不会在体内蓄积。敏感体质建议先做小剂量试打。' },
      urgent: { guide: '如果婚礼前需要瘦脸，建议提前至少1个月做肉毒，这样效果稳定且有缓冲时间。' },
      professional: { explanation: 'A型肉毒毒素通过阻断神经-肌肉接头乙酰胆碱释放实现肌肉松弛，美容剂量通常为20-100单位，远低于2000单位的毒性阈值。' },
    },
  },
  {
    id: 'script-picofreckle',
    keywords: ['皮秒', '祛斑', '色斑', '色素'],
    empathy: '色斑确实很影响气色，很多客人为此困扰，您不是一个人。',
    explanation: '皮秒激光利用超短脉冲将色素颗粒击碎成更小微粒，更容易被代谢排出。针对雀斑、晒斑效果明显，黄褐斑需要配合其他治疗。',
    guide: '建议先来做个皮肤检测，确定色斑类型和层次，再制定个性化方案。一般2-3次治疗可以有显著改善。',
    category: '激光',
    projectRef: 'proj-pico-laser',
    toneOverrides: {
      warm: { empathy: '亲爱的，斑斑点点确实让人烦恼，不过现在技术很先进，祛斑效果好很多了。' },
      cautious: { explanation: '皮秒相对传统激光更温和，对周围组织损伤更小，敏感肌也可以考虑，但术后需严格防晒。' },
      urgent: { guide: '如果婚期前想祛斑，建议至少提前2个月开始治疗，术后需要防晒恢复期。' },
      professional: { explanation: '皮秒激光脉宽在皮秒级(10⁻¹²s)，光声效应为主，较传统调Q激光的光热效应减少周围组织热损伤约70%。' },
    },
  },
  {
    id: 'script-hyaluronic-fill',
    keywords: ['玻尿酸', '填充', '隆鼻', '下巴', '法令纹'],
    empathy: '想要改善面部轮廓是很好的想法，适度填充可以让五官更精致自然。',
    explanation: '玻尿酸填充是即刻见效的项目，注射后马上就能看到效果。我们选用的是大分子交联玻尿酸，支撑力好且维持时间长，一般6-12个月。',
    guide: '建议您先面诊，医生会根据面部基础条件设计填充方案，遵循少量多次的原则，效果会更自然。',
    category: '注射',
    projectRef: 'proj-hyaluronic',
    toneOverrides: {
      warm: { empathy: '亲爱的，想要更精致是每个女生的追求，我们会帮您做到自然好看的。' },
      cautious: { explanation: '玻尿酸是人体自有成分，可被自然代谢。敏感肌建议选择含利多卡因的配方，减少注射不适。' },
      urgent: { guide: '玻尿酸填充是即刻见效的，如果婚期临近，可以在婚礼前1-2周完成，留出消肿时间。' },
      professional: { explanation: '交联玻尿酸的G值(G prime)决定支撑力，鼻部和下巴选用高G值产品，唇部和泪沟选用低G值产品，确保解剖学适配。' },
    },
  },
  {
    id: 'script-ipl-rejuvenation',
    keywords: ['光子嫩肤', '嫩肤', '提亮', '红血丝'],
    empathy: '皮肤暗沉和红血丝确实让人困扰，光子嫩肤是改善这些问题很好的入门项目。',
    explanation: '光子嫩肤通过强脉冲光作用于皮肤，可以改善红血丝、暗沉、毛孔粗大等多种问题。属于无创治疗，恢复期短，适合日常保养。',
    guide: '光子嫩肤建议3-5次为一个疗程，每次间隔3-4周。术后注意补水和防晒，效果会越来越好。',
    category: '激光',
    projectRef: 'proj-ipl',
    toneOverrides: {
      warm: { empathy: '亲爱的，光子嫩肤是很多客人的第一个医美项目，也是我非常推荐的入门选择。' },
      cautious: { explanation: '光子嫩肤能量可调，敏感肌可以选择低能量模式，术后可能有轻微泛红，通常几小时内消退。' },
      urgent: { guide: '光子嫩肤恢复期很短，基本不影响日常，如果是婚期前急救可以提前1-2周做。' },
      professional: { explanation: 'IPL通过500-1200nm宽谱强脉冲光，血红蛋白和黑色素选择性吸收后产生光热效应，实现嫩肤和去红。' },
    },
  },
  {
    id: 'script-hifu-effect',
    keywords: ['超声刀', '效果', '提拉', '下垂'],
    empathy: '面部松弛下垂是自然老化过程，想要改善是完全可以理解的。',
    explanation: '超声刀通过聚焦超声能量作用于SMAS筋膜层，实现深层提拉紧致。效果在术后2-3个月逐渐显现，可维持1-2年。',
    guide: '超声刀适合中度松弛的客人，如果您是初老阶段，也可以考虑热玛吉+超声刀联合治疗，效果更全面。',
    category: '抗衰',
    projectRef: 'proj-hifu',
    toneOverrides: {
      warm: { empathy: '亲爱的，脸部松弛让人显老，好多客人都说做完超声刀感觉回到了几年前。' },
      cautious: { explanation: '超声刀属于无创提拉，不破坏表皮，但治疗中有酸胀感是正常的。敏感肌可以降低能量档位。' },
      urgent: { guide: '超声刀效果需要2-3个月才能完全显现，如果婚期很近，建议配合玻尿酸填充来即刻改善轮廓。' },
      professional: { explanation: '微聚焦超声作用于SMAS层和真皮深层，温度达60-70°C诱发胶原蛋白变性收缩和新生，实现非手术提拉。' },
    },
  },
  {
    id: 'script-double-eyelid-postop',
    keywords: ['双眼皮', '术后', '恢复', '肿胀', '不对称'],
    empathy: '术后恢复期的焦虑我们非常理解，这是很多客人都会经历的阶段。',
    explanation: '双眼皮术后肿胀是正常现象，一般7天拆线，1-2周消肿明显，3-6个月完全恢复自然。早期轻微不对称也属正常。',
    guide: '术后48小时内冰敷，之后热敷促进消肿。避免低头和剧烈运动，睡时枕头垫高。如3个月后仍明显不对称，可联系医生复查。',
    category: '术后',
    toneOverrides: {
      warm: { empathy: '亲爱的，刚做完手术有担心太正常了，恢复期需要一点耐心哦。' },
      cautious: { explanation: '术后恢复期要特别注意清洁和护理，敏感体质消肿可能稍慢一些，但最终效果不会受影响。' },
      urgent: { guide: '如果婚期在1个月内，建议术后使用消脱止等辅助消肿药物，并配合冷热敷加快恢复。' },
      professional: { explanation: '重睑术后组织水肿高峰在48-72小时，淋巴回流重建约需2-4周，瘢痕重塑期3-6个月，期间轻微不对称属正常组织反应。' },
    },
  },
  {
    id: 'script-thread-lift',
    keywords: ['线雕', '提升', '线', '脸部提升'],
    empathy: '面部松弛想要提升，线雕是一个见效较快的选择，您的想法很对路。',
    explanation: '线雕通过植入可吸收蛋白线对组织进行物理提拉，同时刺激胶原蛋白新生。即刻提拉效果明显，长期效果可维持1-2年。',
    guide: '线雕适合轻中度松弛，线材有PDO、PLLA等不同材质，医生会根据您的面部情况选择合适的线材和布线方案。',
    category: '抗衰',
    projectRef: 'proj-thread-lift',
    toneOverrides: {
      warm: { empathy: '亲爱的，线雕做完了很多人都说效果立竿见影，做完就能看到变化。' },
      cautious: { explanation: '线雕用的蛋白线是可以被人体自然吸收的，敏感肌术后可能有轻微肿胀，一般3-5天消退。' },
      urgent: { guide: '线雕是即刻见效的，但如果婚期前做，建议至少提前2周，留出消肿时间。' },
      professional: { explanation: '线雕通过倒刺线的机械悬吊和线材降解过程中的异物反应刺激胶原再生，PDO线维持6-8个月，PLLA线可达18-24个月。' },
    },
  },
  {
    id: 'script-water-shine-allergy',
    keywords: ['水光针', '过敏', '红肿', '敏感'],
    empathy: '担心过敏是很合理的，毕竟是往皮肤里注射，谨慎一些没毛病。',
    explanation: '水光针的主要成分是透明质酸，这是人体自有的物质，过敏概率很低。但个别对交联剂或麻药成分可能会有反应。',
    guide: '如果您有过敏史，建议术前告知医生，我们可以先做皮试。同时选择不含交联剂的非交联玻尿酸，更安全。',
    category: '注射',
    projectRef: 'proj-water-shine',
    toneOverrides: {
      warm: { empathy: '亲爱的，担心过敏是人之常情，我们一定会帮您做好万全准备的。' },
      cautious: { explanation: '敏感肌做水光建议选用非交联玻尿酸，成分更单一，过敏风险更低。术后配合修复类产品，恢复更快。' },
      urgent: { guide: '如果婚期临近又担心过敏，建议提前2周做一次小范围测试，确认无反应后再做全脸。' },
      professional: { explanation: '水光针过敏反应多源于交联剂BDDE残留或利多卡因，非交联玻尿酸致敏率<0.1%，建议过敏体质选用无交联配方。' },
    },
  },
  {
    id: 'script-thermage-recovery',
    keywords: ['热玛吉', '恢复期', '恢复', '多久', '术后'],
    empathy: '关心恢复期很正常，毕竟生活和社交都要安排好。',
    explanation: '热玛吉属于无创治疗，基本没有恢复期。术后可能有轻微泛红，1-2小时即可消退，不影响正常生活和工作。',
    guide: '术后当天避免高温环境（桑拿、暴晒），加强补水和防晒即可。第二天可以正常化妆和护肤。',
    category: '抗衰',
    projectRef: 'proj-thermage',
    toneOverrides: {
      warm: { empathy: '亲爱的，热玛吉几乎没有恢复期，做完就能正常出门，不用担心影响日常。' },
      cautious: { explanation: '敏感肌术后泛红可能稍明显一些，一般2-4小时消退，建议术后使用修复面霜。' },
      urgent: { guide: '热玛吉没有恢复期，如果婚期前做，当天就能正常社交，非常适合时间紧的客人。' },
      professional: { explanation: '热玛吉术后反应轻微，偶有暂时性红斑和水肿，通常1-4小时消退。术后4周开始胶原新生，3-6个月效果最佳。' },
    },
  },
  {
    id: 'script-botox-effect-time',
    keywords: ['瘦脸针', '效果', '多久', '见效时间'],
    empathy: '关心见效时间是应该的，毕竟安排好时间才能不影响重要日程。',
    explanation: '瘦脸针注射后一般7-14天开始见效，1个月左右效果最明显。效果可维持4-6个月，建议3-4次后咬肌会逐渐缩小。',
    guide: '如果您有重要活动，建议至少提前1个月做瘦脸针，确保效果达到最佳状态。',
    category: '注射',
    projectRef: 'proj-botox',
    toneOverrides: {
      warm: { empathy: '亲爱的，瘦脸针见效还是蛮快的，一般一周左右就能感觉脸小了一圈。' },
      cautious: { explanation: '瘦脸针效果是渐进式的，不会突然变化，看起来很自然。敏感体质也不会有特殊反应。' },
      urgent: { guide: '如果婚期在1个月以上，瘦脸针完全来得及见效。如果更近，可以配合发型和修容做即时改善。' },
      professional: { explanation: 'A型肉毒毒素注射咬肌后，药物与神经末梢结合需24-72小时，肌肉松弛效应在1-2周达峰，维持约12-16周。' },
    },
  },
  {
    id: 'script-hyaluronic-duration',
    keywords: ['玻尿酸', '维持时间', '多久', '保持'],
    empathy: '关心维持时间很正常，我们都希望效果能持久一些。',
    explanation: '玻尿酸的维持时间因部位和产品不同有差异：唇部3-6个月，鼻部和下巴6-12个月，法令纹6-9个月。代谢速度也和个人体质有关。',
    guide: '建议您选择正规品牌的大分子交联玻尿酸，维持时间更长。定期补打可以延长效果，后续用量会比初次少。',
    category: '注射',
    projectRef: 'proj-hyaluronic',
    toneOverrides: {
      warm: { empathy: '亲爱的，玻尿酸的效果维持还是不错的，而且补打后维持时间会更长。' },
      cautious: { explanation: '玻尿酸会被人体自然代谢，不会残留。如果对效果不满意，还可以用溶解酶调整，可逆性很强。' },
      urgent: { guide: '玻尿酸是即刻见效的，婚期前1-2周做最合适，效果正好稳定，又有时间微调。' },
      professional: { explanation: '交联玻尿酸的半衰期约6-9个月，受注射部位血供、肌肉活动度和交联度影响。高交联度产品(HA-D)降解速率更慢。' },
    },
  },
  {
    id: 'script-photo-contra',
    keywords: ['光电', '禁忌', '不能做', '不适合'],
    empathy: '了解项目禁忌是非常重要的，说明您对自己负责，我们也会严格把关。',
    explanation: '光电类项目的禁忌包括：孕期哺乳期、光敏感疾病、近期暴晒、正在使用维A酸类药物、有开放性伤口或感染等。具体需要面诊评估。',
    guide: '建议您来院时带上近期用药清单，我们会做详细评估。如果有不适合光电的情况，也可以选择其他类型的项目达到类似效果。',
    category: '禁忌',
    toneOverrides: {
      warm: { empathy: '亲爱的，了解自己适不适合做是第一步，我们会帮您把关的。' },
      cautious: { explanation: '敏感肌做光电类需要特别谨慎，我们可以选择低能量模式或替代方案，安全永远排在第一位。' },
      urgent: { guide: '如果光电类不适合，注射类项目如水光针、玻尿酸也能快速改善皮肤状态，不影响婚期准备。' },
      professional: { explanation: '光电类禁忌症分为绝对禁忌（红斑狼疮、着色性干皮病等光敏感疾病）和相对禁忌（近期暴晒、口服异维A酸等），需个体化评估。' },
    },
  },
]

export default scripts
export { scripts as defaultScripts }
